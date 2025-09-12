import { NODE_TYPES } from "@/config/constants";
import { Card } from "@chakra-ui/react";
import { memo } from "react";

export const TreeCard = memo(function TreeCard({ data = [], tree, empty }) {
    const isEmpty =
        data[0].type === NODE_TYPES.root && data[0].children.length === 0;
    return (
        <Card.Root
            size={"sm"}
            h={"100%"}
            data-state={"open"}
            animationDuration={"slow"}
            animationStyle={{
                _open: "scale-fade-in",
            }}
            className="group"
            border={"none"}
            bg={"transparent"}
        >
            <Card.Body px={"0"} overflow={"hidden"}>
                {isEmpty && empty}
                {tree}
            </Card.Body>
        </Card.Root>
    );
});
