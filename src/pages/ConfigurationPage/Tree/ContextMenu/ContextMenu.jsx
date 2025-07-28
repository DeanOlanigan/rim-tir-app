import { useEffect, useRef, useLayoutEffect } from "react";
import { useContextMenuStore } from "@/store/contextMenu-store";
import { motion, AnimatePresence } from "motion/react";
import { Menu, Portal } from "@chakra-ui/react";
import { ContextMenuList } from "./ContextMenuList";

export const ContextMenu = () => {
    console.log("%cRender ContextMenu", "color: white; background: purple;");
    const { context, updateContext } = useContextMenuStore((state) => state);
    const { apiPath, type, subType, x, y, visible } = context;

    const menuRef = useRef(null);

    useLayoutEffect(() => {
        if (!visible || !menuRef.current) return;

        const node = menuRef.current;
        const { width, height } = node.getBoundingClientRect();
        const pad = 16;

        const newX = Math.min(x, window.innerWidth - width - pad);
        const newY = Math.min(y, window.innerHeight - height - pad);

        node.style.left = `${newX}px`;
        node.style.top = `${newY}px`;
    }, [visible, x, y]);

    useEffect(() => {
        function handleOutsideClick(e) {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                updateContext({ visible: false });
            }
        }
        function handleKeyDown(e) {
            if (e.key === "Escape") {
                updateContext({ visible: false });
            }
        }

        if (visible) {
            document.addEventListener("click", handleOutsideClick);
            document.addEventListener("keydown", handleKeyDown);
        }
        return () => {
            document.removeEventListener("click", handleOutsideClick);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [visible, updateContext]);

    return (
        <Portal>
            <AnimatePresence>
                {visible && (
                    <motion.div
                        ref={menuRef}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        style={{
                            position: "fixed",
                            zIndex: 1000,
                        }}
                    >
                        <Menu.Root open size={"sm"}>
                            <ContextMenuList
                                apiPath={apiPath}
                                type={type}
                                subType={subType}
                                updateContext={updateContext}
                            />
                        </Menu.Root>
                    </motion.div>
                )}
            </AnimatePresence>
        </Portal>
    );
};
