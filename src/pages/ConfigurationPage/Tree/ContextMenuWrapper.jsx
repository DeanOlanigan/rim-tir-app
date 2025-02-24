import {
    MenuRoot,
    MenuItem,
    MenuContent,
    MenuContextTrigger,
    MenuSeparator,
} from "../../../components/ui/menu";
import { LuFolder, LuVariable, LuPencil, LuTrash2 } from "react-icons/lu";

export const ContextMenuWrapper = ({
    apiPath,
    children,
    type = "root",
    node,
}) => {
    return (
        <MenuRoot lazyMount unmountOnExit>
            <MenuContextTrigger asChild>{children}</MenuContextTrigger>
            <MenuContent>
                {(type === "variable" || type === "folder") && (
                    <>
                        <MenuItem
                            value="rename"
                            onClick={() => {
                                apiPath.edit(node);
                            }}
                        >
                            <LuPencil />
                            Переименовать
                        </MenuItem>
                        <MenuItem
                            value="delete"
                            color="fg.error"
                            _hover={{ bg: "bg.error", color: "fg.error" }}
                            onClick={() => {
                                console.log(apiPath.selectedIds);
                                apiPath.delete([...apiPath.selectedIds]);
                            }}
                        >
                            <LuTrash2 />
                            Удалить
                        </MenuItem>
                        {type === "folder" && <MenuSeparator />}
                    </>
                )}
                {(type === "root" || type === "folder") && (
                    <>
                        <MenuItem
                            value="variable"
                            onClick={() => {
                                apiPath.create({
                                    type: "variable",
                                });
                            }}
                        >
                            <LuVariable />
                            Создать переменную...
                        </MenuItem>
                        <MenuItem
                            value="folder"
                            onClick={() => {
                                apiPath.create({
                                    type: "folder",
                                });
                            }}
                        >
                            <LuFolder />
                            Создать папку...
                        </MenuItem>
                    </>
                )}
            </MenuContent>
        </MenuRoot>
    );
};
