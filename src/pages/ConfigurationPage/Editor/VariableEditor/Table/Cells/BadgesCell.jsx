import { useState } from "react";
import { CellLayout } from "./BadgesCell/CellLayout";
import { Badge as MyBadge } from "./BadgesCell/Badge";

export const BadgesCell = ({ id }) => {
    const [isEditing, setIsEditing] = useState(false);

    return (
        <CellLayout isEditing={isEditing} setIsEditing={setIsEditing}>
            <MyBadge
                id={id}
                param={"cmd"}
                childrenParams={null}
                isEditing={isEditing}
            />
            <MyBadge
                id={id}
                param={"isSpecial"}
                childrenParams={["specialCycleDelay"]}
                isEditing={isEditing}
            />
            <MyBadge
                id={id}
                param={"graph"}
                childrenParams={["measurement", "aperture"]}
                isEditing={isEditing}
            />
            <MyBadge
                id={id}
                param={"archive"}
                childrenParams={["group"]}
                isEditing={isEditing}
            />
        </CellLayout>
    );
};
