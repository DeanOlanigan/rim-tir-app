import { LuFolder, LuVariable } from "react-icons/lu";

export const TypeIcon = (props) => {
    if (props.droppable) {
        return <LuFolder />;
    }

    switch (props.type) {
        case "variable":
            return <LuVariable />;
        default:
            return null;
    }
};
