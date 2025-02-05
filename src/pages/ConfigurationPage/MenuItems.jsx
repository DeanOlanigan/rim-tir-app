import {
    LuPlus,
    LuTrash2,
    LuPencil,
} from "react-icons/lu";
import {
    MenuItem,
} from "../../components/ui/menu";

export const TestMenuItems = () => {
    return (
        <>
            <MenuItem value="add">
                <LuPlus />
                Добавить узел
            </MenuItem>
            <MenuItem value="rename">
                <LuPencil />
                Переименовать узел
            </MenuItem>
            <MenuItem value="delete">
                <LuTrash2 />
                Удалить узел
            </MenuItem>
        </>
    );
};
