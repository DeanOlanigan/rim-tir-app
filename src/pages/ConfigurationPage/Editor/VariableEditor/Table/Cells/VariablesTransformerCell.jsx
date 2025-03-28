import {
    PopoverBody,
    PopoverContent,
    PopoverRoot,
    PopoverTrigger,
} from "../../../../../../components/ui/popover";
import { Button, Text, Box } from "@chakra-ui/react";
import { memo } from "react";
import { DebouncedEditor, NumberInput } from "../../../../InputComponents";

export const VariablesTransformerCell = memo(function VariablesTransformerCell(
    props
) {
    //console.log("Render VariablesTransformerCell");
    const { isLua, luaExpression, coefficient, id } = props;

    return isLua ? (
        <PopoverRoot portalled>
            <PopoverTrigger asChild>
                <Button
                    size={"xs"}
                    variant={"surface"}
                    w={"100%"}
                    maxW={"150px"}
                >
                    <Text truncate>{luaExpression || "Написать"}</Text>
                </Button>
            </PopoverTrigger>
            <PopoverContent>
                <PopoverBody asChild>
                    <Box
                        background={"bg"}
                        w={"440px"}
                        borderRadius={"md"}
                        shadow={"xl"}
                    >
                        <DebouncedEditor
                            id={id}
                            luaExpression={luaExpression}
                            height={"300px"}
                            width={"400px"}
                        />
                    </Box>
                </PopoverBody>
            </PopoverContent>
        </PopoverRoot>
    ) : (
        <NumberInput targetKey={"coefficient"} id={id} value={coefficient} />
    );
});
