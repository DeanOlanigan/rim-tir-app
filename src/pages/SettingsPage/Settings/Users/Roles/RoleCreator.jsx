import {
    Button,
    Card,
    Dialog,
    Field,
    HStack,
    IconButton,
    Input,
    StackSeparator,
} from "@chakra-ui/react";
import { LuUserCog } from "react-icons/lu";

export const RoleCreator = () => {
    return (
        <Dialog.Root
            placement={"center"}
            motionPreset={"slide-in-bottom"}
            size={"xl"}
        >
            <Dialog.Trigger>
                <IconButton size="sm" w="50px">
                    <LuUserCog />
                </IconButton>
            </Dialog.Trigger>
            <Dialog.Backdrop />
            <Dialog.Positioner>
                <Dialog.Content>
                    <HStack separator={<StackSeparator />}>
                        <Card.Root h={"100%"} w={"50%"} variant={"elevated"}>
                            <Card.Header>
                                <Card.Title>Редактор ролей</Card.Title>
                            </Card.Header>
                            <Card.Body></Card.Body>
                        </Card.Root>
                        <Card.Root h={"100%"} w={"50%"} variant={"elevated"}>
                            <Card.Header>
                                <Card.Title>Создание ролей</Card.Title>
                            </Card.Header>
                            <Card.Body onSubmit={() => console.log("123")}>
                                <Field.Root>
                                    <Field.Label>Название роли</Field.Label>
                                    <Input
                                        type=""
                                        placeholder="Напишите название роли"
                                        required
                                    />
                                </Field.Root>
                                <Button type="submit">ДЩД</Button>
                            </Card.Body>
                        </Card.Root>
                    </HStack>
                </Dialog.Content>
            </Dialog.Positioner>
        </Dialog.Root>
    );
};
