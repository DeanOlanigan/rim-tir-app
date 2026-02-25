import { Arrow, Ellipse, Group, Line, Rect, Text } from "react-konva";
import { useActionsStore } from "./../store/actions-store";
import { patchStoreRaf, useNodeStore } from "./../store/node-store";
import { ACTIONS, SHAPES } from "../constants";
import { dragBound } from "./utils/dragBound";
import { isHasRadius, round4 } from "../utils";
import { VariablePolygon } from "./shapes/VariablePolygon.react";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { Html } from "react-konva-utils";
import { useHandlers } from "./hooks/useHandlers";

function ellipseToKonva(p) {
    const cx = p.x + p.width / 2;
    const cy = p.y + p.height / 2;
    return {
        x: cx,
        y: cy,
        radiusX: p.width / 2,
        radiusY: p.height / 2,
        rotation: p.rotation ?? 0,
    };
}

function move(node) {
    const type = node.attrs.type;
    let x, y;
    if (isHasRadius(type)) {
        const rx = Math.abs(node.radiusX() * node.scaleX());
        const ry = Math.abs(node.radiusY() * node.scaleY());

        const width = rx * 2;
        const height = ry * 2;

        x = round4(node.x() - width / 2);
        y = round4(node.y() - height / 2);
    } else {
        x = round4(node.x());
        y = round4(node.y());
    }

    return { x, y };
}

const common = {
    name: "node",
    fillAfterStrokeEnabled: true,
    shadowForStrokeEnabled: false,
    dragBoundFunc(pos) {
        const { gridSize, snapToGrid } = useActionsStore.getState();
        const stage = this.getStage();
        const absRect = this.getClientRect({
            skipShadow: true,
            skipStroke: true,
        });
        const curAbsPos = this.getAbsolutePosition();

        const absTlCurrent = {
            x: absRect.x,
            y: absRect.y,
        };
        const deltaPos = {
            x: pos.x - curAbsPos.x,
            y: pos.y - curAbsPos.y,
        };
        const absTlProposed = {
            x: absTlCurrent.x + deltaPos.x,
            y: absTlCurrent.y + deltaPos.y,
        };

        const abs = dragBound(absTlProposed, stage, gridSize, snapToGrid);

        const delta = {
            x: abs.x - absTlProposed.x,
            y: abs.y - absTlProposed.y,
        };

        return {
            x: pos.x + delta.x,
            y: pos.y + delta.y,
        };
    },
    onDragStart(e) {
        const node = e.target;
        const id = node.id();
        if (!id) return;
        if (e.evt.ctrlKey && node.isDragging()) {
            node.stopDrag();
            return;
        }
        useNodeStore.getState().beginInteractiveSnapshot([id], ["x", "y"]);
    },
    onDragMove(e) {
        const node = e.target;
        const id = node.id();
        if (!id) return;
        const patch = {};
        patch[id] = move(node);
        patchStoreRaf(patch);
    },
    onDragEnd(e) {
        const node = e.target;
        const id = node.id();
        if (!id) return;
        patchStoreRaf.flushNow?.();
        useNodeStore.getState().commitInteractiveSnapshot(["x", "y"]);
    },
};

export const Nodes = ({ nodesRef }) => {
    const viewOnlyMode = useActionsStore((state) => state.viewOnlyMode);
    const currentAction = useActionsStore((state) => state.currentAction);
    const activePageId = useNodeStore((s) => s.activePageId);
    const rootIds = useNodeStore((s) => s.pages[activePageId]?.rootIds || []);
    return (
        <NodeWrapper
            ids={rootIds}
            nodesRef={nodesRef}
            draggable={currentAction === ACTIONS.select && !viewOnlyMode}
        />
    );
};

const NodeWrapper = memo(({ ids, draggable, nodesRef }) => {
    return ids.map((id) => (
        <NodeInstance
            key={id}
            id={id}
            draggable={draggable}
            nodesRef={nodesRef}
        />
    ));
});
NodeWrapper.displayName = "NodeWrapper";

const NodeInstance = ({ id, draggable, nodesRef }) => {
    const node = useNodeStore((state) => state.nodes[id]);
    const handlers = useHandlers(node);

    const prevHandlersRef = useRef(handlers);
    useEffect(() => {
        if (!handlers || !prevHandlersRef.current) return;

        // Пробегаемся по всем ключам (onClick, onPointerDown и т.д.)
        Object.keys(handlers).forEach((key) => {
            const isDifferent = prevHandlersRef.current[key] !== handlers[key];
            if (isDifferent) {
                console.warn(
                    `⚠️ Handler changed: [${key}] for Node ${id}. \n` +
                        `Это заставит React-Konva перерисовать слушатель.`,
                );
            }
        });

        // Сохраняем текущие для следующего сравнения
        prevHandlersRef.current = handlers;
    }, [handlers, id]);

    const registerRef = useCallback(
        (el) => {
            if (el) nodesRef.current.set(id, el);
            else nodesRef.current.delete(id);
        },
        [id, nodesRef],
    );

    if (!node) return null;

    const params = {
        ...node,
        ...common,
        draggable,
        ...handlers,
    };

    switch (node.type) {
        case SHAPES.rect:
            return <Rect key={id} {...params} ref={registerRef} />;
        case SHAPES.polygon: {
            const k = ellipseToKonva(node);
            return (
                <VariablePolygon
                    key={id}
                    {...params}
                    x={k.x}
                    y={k.y}
                    radiusX={k.radiusX}
                    radiusY={k.radiusY}
                    rotation={k.rotation}
                    ref={registerRef}
                />
            );
        }
        case SHAPES.ellipse: {
            const k = ellipseToKonva(node);
            return (
                <Ellipse
                    key={id}
                    {...params}
                    x={k.x}
                    y={k.y}
                    radiusX={k.radiusX}
                    radiusY={k.radiusY}
                    rotation={k.rotation}
                    ref={registerRef}
                />
            );
        }
        case SHAPES.text:
            return <Text key={id} {...params} ref={registerRef} />;
        /* return (
                <TextWithEdit key={id} params={params} refReg={registerRef} />
            ); */
        case SHAPES.line:
            return (
                <Line
                    key={id}
                    {...params}
                    ref={registerRef}
                    hitStrokeWidth={node.strokeWidth + 3 || 3}
                />
            );
        case SHAPES.arrow:
            return (
                <Arrow
                    key={id}
                    {...params}
                    ref={registerRef}
                    hitStrokeWidth={node.strokeWidth + 3 || 3}
                />
            );
        case SHAPES.group:
            return (
                <Group key={id} {...params} ref={registerRef}>
                    <NodeWrapper
                        ids={node.childrenIds}
                        nodesRef={nodesRef}
                        draggable={false}
                    />
                </Group>
            );
        default:
            return null;
    }
};

// eslint-disable-next-line
const TextWithEdit = ({ params, refReg }) => {
    const [text, setText] = useState(params.text);
    const [isEditing, setIsEditing] = useState(false);
    const textRef = useRef();

    const handleTextChange = useCallback((newText) => {
        setText(newText);
    }, []);

    const handleTextDblClick = useCallback(() => {
        setIsEditing(true);
    }, []);

    return (
        <>
            <Text
                ref={(el) => {
                    refReg(el);
                    if (el) textRef.current = el;
                    else textRef.current = null;
                }}
                {...params}
                text={text}
                onDblClick={handleTextDblClick}
                visible={!isEditing}
            />
            {isEditing && (
                <TextEditor
                    textNode={textRef.current}
                    onChange={handleTextChange}
                    onClose={() => {
                        setIsEditing(false);
                        useNodeStore.getState().updateNode(params.id, { text });
                    }}
                />
            )}
        </>
    );
};

const TextEditor = (props) => {
    return (
        <Html>
            <TextArea {...props} />
        </Html>
    );
};

const TextArea = ({ textNode, onClose, onChange }) => {
    const textareaRef = useRef(null);

    useEffect(() => {
        if (!textareaRef.current) return;

        const textarea = textareaRef.current;
        const textPosition = textNode.position();
        const areaPosition = {
            x: textPosition.x,
            y: textPosition.y,
        };

        // Match styles with the text node
        textarea.value = textNode.text();
        textarea.style.position = "absolute";
        textarea.style.top = `${areaPosition.y}px`;
        textarea.style.left = `${areaPosition.x}px`;
        textarea.style.width = `${textNode.width() - textNode.padding() * 2}px`;
        textarea.style.height = `${
            textNode.height() - textNode.padding() * 2 + 5
        }px`;
        textarea.style.fontSize = `${textNode.fontSize()}px`;
        textarea.style.border = "none";
        textarea.style.padding = "0px";
        textarea.style.margin = "0px";
        textarea.style.overflow = "hidden";
        textarea.style.background = "none";
        textarea.style.outline = "none";
        textarea.style.resize = "none";
        textarea.style.lineHeight = textNode.lineHeight();
        textarea.style.fontFamily = textNode.fontFamily();
        textarea.style.transformOrigin = "left top";
        textarea.style.textAlign = textNode.align();
        textarea.style.color = textNode.fill();

        const rotation = textNode.rotation();
        let transform = "";
        if (rotation) {
            transform += `rotateZ(${rotation}deg)`;
        }
        textarea.style.transform = transform;

        textarea.style.height = "auto";
        textarea.style.height = `${textarea.scrollHeight + 3}px`;

        textarea.focus();

        const handleOutsideClick = (e) => {
            if (e.target !== textarea) {
                onChange(textarea.value);
                onClose();
            }
        };

        // Add event listeners
        const handleKeyDown = (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onChange(textarea.value);
                onClose();
            }
            if (e.key === "Escape") {
                onClose();
            }
        };

        const handleInput = () => {
            const scale = textNode.getAbsoluteScale().x;
            textarea.style.width = `${textNode.width() * scale}px`;
            textarea.style.height = "auto";
            textarea.style.height = `${
                textarea.scrollHeight + textNode.fontSize()
            }px`;
        };

        textarea.addEventListener("keydown", handleKeyDown);
        textarea.addEventListener("input", handleInput);
        setTimeout(() => {
            window.addEventListener("click", handleOutsideClick);
        });

        return () => {
            textarea.removeEventListener("keydown", handleKeyDown);
            textarea.removeEventListener("input", handleInput);
            window.removeEventListener("click", handleOutsideClick);
        };
    }, [textNode, onChange, onClose]);

    return (
        <textarea
            ref={textareaRef}
            style={{
                minHeight: "1em",
                position: "absolute",
            }}
        />
    );
};
