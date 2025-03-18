import {
    Card,
    AbsoluteCenter,
    Icon,
    Text,
    Kbd,
    HStack,
    VStack,
    Menu,
    Portal,
} from "@chakra-ui/react";
import { TreeView } from "../Tree/TreeView";
import { TreeCardTitle } from "./Title";
import { useRef, useState, memo, useEffect } from "react";
import { LuBadgePlus } from "react-icons/lu";
import { useContextMenuStore } from "../../../store/contextMenu-store";
import { menuConfig } from "../../../config/contextMenu";

export const TreeCard = memo(function TreeCard({ data = [], treeType }) {
    console.log("RENDER VariableCard", treeType);
    const [isHovered, setIsHovered] = useState(false);

    const variableTreeRef = useRef(null);
    const cardRef = useRef(null);

    return (
        <Card.Root
            size={"sm"}
            h={"100%"}
            data-state={"open"}
            animationDuration={"slow"}
            animationStyle={{
                _open: "scale-fade-in",
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Card.Header>
                <Card.Title>
                    <TreeCardTitle
                        type={treeType}
                        isHovered={isHovered}
                        variableTreeRef={variableTreeRef}
                    />
                </Card.Title>
            </Card.Header>
            <Card.Body px={"0"} overflow={"hidden"} ref={cardRef}>
                {data.length === 0 && <EmptyCard />}
                <TreeView
                    ref={variableTreeRef}
                    data={data}
                    treeType={treeType}
                />
                <Portal>
                    <ContextMenuList />
                </Portal>
            </Card.Body>
        </Card.Root>
    );
});

const EmptyCard = () => {
    return (
        <AbsoluteCenter>
            <VStack w={"100%"}>
                <Icon fontSize={"164px"} color={"bg.muted"}>
                    <LuBadgePlus />
                </Icon>
                <HStack>
                    <Text color={"fg.subtle"} fontWeight={"medium"}>
                        Открыть контекстное меню
                    </Text>
                    <Kbd>ПКМ</Kbd>
                </HStack>
            </VStack>
        </AbsoluteCenter>
    );
};

const ContextMenuList = () => {
    const context = useContextMenuStore((state) => state.context);
    const { apiPath, type, subType, treeType, x, y, visible } = context;
    const menuRef = useRef(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        if (visible && menuRef.current) {
            const menuRect = menuRef.current.getBoundingClientRect();
            let newX = x;
            let newY = y;
            const pad = 16; // небольшой отступ

            // проверяем правый край
            if (newX + menuRect.width > window.innerWidth) {
                newX = window.innerWidth - menuRect.width - pad;
            }
            // проверяем нижний край
            if (newY + menuRect.height > window.innerHeight) {
                newY = window.innerHeight - menuRect.height - pad;
            }

            setPosition({ x: newX, y: newY });
        }
    }, [x, y, visible]);

    if (!visible) return null;
    if (!apiPath) return null;

    const focusedNodeType = subType || type || "default";
    const items = menuConfig[treeType][focusedNodeType];
    if (!items) return null;

    return (
        <div
            ref={menuRef}
            style={{
                position: "fixed",
                top: position.y,
                left: position.x,
                zIndex: 9999,
            }}
        >
            <Menu.Root open>
                <Menu.Content>
                    {items.map((item, index) => {
                        if (item.type === "separator") {
                            return <Menu.Separator key={`sep_${index}`} />;
                        }
                        return (
                            <Menu.Item
                                key={item.key}
                                value={item.key}
                                {...item.style}
                                onClick={() => item.action?.(apiPath)}
                            >
                                {item.icon?.()}
                                {item.label}
                            </Menu.Item>
                        );
                    })}
                </Menu.Content>
            </Menu.Root>
        </div>
    );
};
