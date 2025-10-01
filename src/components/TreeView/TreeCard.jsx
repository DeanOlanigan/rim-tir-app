import { NODE_TYPES } from "@/config/constants";
import { Flex } from "@chakra-ui/react";
import { memo } from "react";

export const TreeCard = memo(function TreeCard({ data = [], tree, empty }) {
    const isEmpty =
        data[0].type === NODE_TYPES.root && data[0].children.length === 0;
    return (
        <Flex
            w={"100%"}
            h={"100%"}
            position={"relative"}
            className="group"
            data-state={"open"}
            animationDuration={"slow"}
            animationStyle={{
                _open: "scale-fade-in",
            }}
            px={"2"}
        >
            {isEmpty && empty}
            {tree}
        </Flex>
    );
});
