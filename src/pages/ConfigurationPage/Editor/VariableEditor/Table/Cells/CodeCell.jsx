import { Code, Popover, Portal } from "@chakra-ui/react";
import { DebouncedEditor } from "@/pages/ConfigurationPage/InputComponents";

export const CodeCell = ({ id, code }) => {
    return (
        <Popover.Root lazyMount unmountOnExit modal>
            <Popover.Trigger asChild>
                <Code
                    size={"sm"}
                    maxW={"150px"}
                    truncate
                    lineClamp={2}
                    _hover={{
                        bg: "bg.emphasized",
                        cursor: "pointer",
                    }}
                    w={"100%"}
                >
                    {code || "Нажмите для редактирования"}
                </Code>
            </Popover.Trigger>
            <Portal>
                <Popover.Positioner>
                    <Popover.Content
                        w={"400px"}
                        h={"300px"}
                        p={"0"}
                        bg={"transparent"}
                        border={"1px solid"}
                        borderColor={"border.info"}
                        shadow={"none"}
                        overflow={"hidden"}
                    >
                        <DebouncedEditor id={id} luaExpression={code} />
                    </Popover.Content>
                </Popover.Positioner>
            </Portal>
        </Popover.Root>
    );
};
