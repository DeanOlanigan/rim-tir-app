import { NODE_TYPES } from "@/config/constants";
import { useThrottledResizeObserver } from "@/hooks/useThrottledResizeObserver";
import { Flex } from "@chakra-ui/react";
import { memo } from "react";

export const TreeCard = memo(function TreeCard({ data = [], tree, empty }) {
    const { ref, width, height } = useThrottledResizeObserver(100);
    const isEmpty =
        data[0].type === NODE_TYPES.root && data[0].children.length === 0;
    return (
        <Flex
            ref={ref}
            w={"100%"}
            h={"100%"}
            position={"relative"}
            className="group"
            px={"2"}
        >
            {isEmpty && empty}
            {typeof tree === "function" ? tree({ width, height }) : tree}
        </Flex>
    );
});
