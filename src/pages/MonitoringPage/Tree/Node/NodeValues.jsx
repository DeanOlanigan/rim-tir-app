import { Code } from "@chakra-ui/react";
import { memo } from "react";
import { useLiveValue } from "../../store/mqtt-stream-store";

export const NodeValues = memo(function NodeValues({ id }) {
    const live = useLiveValue(id);

    return (
        <Code
            w={"100px"}
            variant={"surface"}
            justifyContent={"center"}
            truncate
        >
            {live?.v?.toString()}
        </Code>
    );
});
