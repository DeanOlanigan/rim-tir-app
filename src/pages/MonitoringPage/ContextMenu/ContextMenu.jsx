import { useContextMenuStore } from "@/store/contextMenu-store";
import { Menu, Portal } from "@chakra-ui/react";
import { LuInfo, LuSearch, LuTextCursorInput } from "react-icons/lu";
import { useSettingsFromCache } from "../useSettingsFromCache";
import { NODE_TYPES, TREE_TYPES } from "@/config/constants";
import { crossSelect } from "../Tree/crossSelect";
import { TbHandStop } from "react-icons/tb";
import { infoDialog, signalEditDialog } from "../setValue/dialog";

export const ContextMenu = () => {
    const { updateContext } = useContextMenuStore.getState();
    const { apiPath, x, y, visible } = useContextMenuStore(
        (state) => state.mnt
    );
    const settings = useSettingsFromCache();
    const nodeId = apiPath?.focusedNode?.id;
    const type = settings[nodeId]?.type;

    const isFolder = type === NODE_TYPES.folder;
    if (isFolder) return null;

    const isVariable = type === NODE_TYPES.variable;
    const isDataObject = type === NODE_TYPES.dataObject;

    const clickHandle = async () => {
        await crossSelect(
            settings,
            nodeId,
            "monitoring",
            Object.values(TREE_TYPES)
        );
    };

    return (
        <Menu.Root
            open={visible}
            onOpenChange={(e) => updateContext("mnt", { visible: e.open })}
            anchorPoint={{ x, y }}
            positioning={{
                getAnchorRect: () =>
                    DOMRect.fromRect({ x, y, width: 1, height: 1 }),
            }}
            unmountOnExit
            lazyMount
            skipAnimationOnMount
            size={"sm"}
        >
            <Portal>
                <Menu.Positioner>
                    <Menu.Content>
                        {(isDataObject || isVariable) && (
                            <Menu.Item value={"find"} onClick={clickHandle}>
                                <LuSearch />
                                Найти соответствие
                            </Menu.Item>
                        )}
                        {isVariable && (
                            <>
                                <Menu.Item
                                    value={"manual"}
                                    onClick={() => {
                                        signalEditDialog.open("manual", {
                                            title: "Ручной ввод",
                                            mode: "manual",
                                            icon: TbHandStop,
                                            nodeId,
                                        });
                                    }}
                                >
                                    <TbHandStop />
                                    Ручной ввод
                                </Menu.Item>
                                <Menu.Item
                                    value={"edit"}
                                    onClick={() => {
                                        signalEditDialog.open("edit", {
                                            title: "Редактор сигнала",
                                            mode: "edit",
                                            icon: LuTextCursorInput,
                                            nodeId,
                                        });
                                    }}
                                >
                                    <LuTextCursorInput />
                                    Редактор сигнала
                                </Menu.Item>
                            </>
                        )}
                        <Menu.Item
                            value={"info"}
                            onClick={() => {
                                infoDialog.open("info", {
                                    id: nodeId,
                                });
                            }}
                        >
                            <LuInfo />
                            Дополнительная информация
                        </Menu.Item>
                    </Menu.Content>
                </Menu.Positioner>
            </Portal>
        </Menu.Root>
    );
};
