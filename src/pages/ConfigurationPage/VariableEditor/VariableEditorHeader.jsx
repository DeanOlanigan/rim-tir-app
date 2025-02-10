import { HStack, Heading, IconButton, Editable } from "@chakra-ui/react";
import { LuPencilLine, LuX, LuCheck } from "react-icons/lu";

export const VariableEditorHeader = ({data}) => {
    return (
        <HStack
            w={"100%"}
            border={"1px solid"}
            borderColor={"border"}
            borderRadius={"md"}
            shadow={"md"}
            p={"4"}
        >
            <Heading textWrap={"nowrap"}>Конфигурация переменной</Heading>
            <Editable.Root
                maxW={"300px"}
                fontSize={"lg"}
                fontWeight={"medium"}
                defaultValue={data.data.name}
            >
                <Editable.Preview />
                <Editable.Input />
                <Editable.Control>
                    <Editable.EditTrigger asChild>
                        <IconButton variant="ghost" size="xs">
                            <LuPencilLine />
                        </IconButton>
                    </Editable.EditTrigger>
                    <Editable.CancelTrigger asChild>
                        <IconButton variant="outline" size="xs">
                            <LuX />
                        </IconButton>
                    </Editable.CancelTrigger>
                    <Editable.SubmitTrigger asChild>
                        <IconButton variant="outline" size="xs">
                            <LuCheck />
                        </IconButton>
                    </Editable.SubmitTrigger>
                </Editable.Control>
            </Editable.Root>
        </HStack>
    );
};
