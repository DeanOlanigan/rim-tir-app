import {
    PopoverBody,
    PopoverContent,
    PopoverRoot,
    PopoverTrigger,
} from "../../../../../components/ui/popover";
import { Button, Text, Box } from "@chakra-ui/react";
import { Editor } from "@monaco-editor/react";
import {
    NumberInputField,
    NumberInputRoot,
} from "../../../../../components/ui/number-input";
import { useVariablesStore } from "../../../../../store/variables-store";
import { useColorMode } from "../../../../../components/ui/color-mode";
import { memo } from "react";

export const VariablesTransformerCell = memo(function VariablesTransformerCell(
    props
) {
    console.log("Render VariablesTransformerCell");
    const { isLua, luaExpression, coefficient, id } = props;
    const setSettings = useVariablesStore((state) => state.setSettings);
    const { colorMode } = useColorMode();

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
                        <Editor
                            height={"300px"}
                            width={"400px"}
                            defaultLanguage="lua"
                            defaultValue={luaExpression}
                            theme={colorMode === "light" ? "vs" : "vs-dark"}
                            onChange={(value) => {
                                console.log("value", value);
                                setSettings(id, {
                                    luaExpression: value,
                                });
                            }}
                        />
                    </Box>
                </PopoverBody>
            </PopoverContent>
        </PopoverRoot>
    ) : (
        <NumberInputRoot
            value={coefficient}
            size={"xs"}
            onValueChange={(data) => {
                setSettings(id, {
                    coefficient: data.value,
                });
            }}
        >
            <NumberInputField />
        </NumberInputRoot>
    );
});
