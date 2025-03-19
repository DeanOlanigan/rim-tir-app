import { useEffect, useRef, useState } from "react";
import { useContextMenuStore } from "../../../../store/contextMenu-store";
import { motion, AnimatePresence } from "motion/react";
import { Menu, Portal } from "@chakra-ui/react";
import { ContextMenuList } from "./ContextMenuList";

export const ContextMenu = () => {
    const { context, updateContext } = useContextMenuStore((state) => state);
    const { apiPath, type, subType, treeType, x, y, visible } = context;

    const [position, setPosition] = useState({ x: 0, y: 0 });
    const menuRef = useRef(null);

    useEffect(() => {
        if (menuRef.current) {
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
    }, [x, y]);

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
                            top: position.y,
                            left: position.x,
                            zIndex: 9999,
                        }}
                    >
                        <Menu.Root open>
                            <ContextMenuList
                                apiPath={apiPath}
                                subType={subType}
                                type={type}
                                treeType={treeType}
                                updateContext={updateContext}
                            />
                        </Menu.Root>
                    </motion.div>
                )}
            </AnimatePresence>
        </Portal>
    );
};
