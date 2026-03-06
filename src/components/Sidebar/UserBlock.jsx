import { useLogoutMutation } from "@/hooks/useMutation";
import {
    Avatar,
    Badge,
    Button,
    HStack,
    Icon,
    Menu,
    Portal,
    Spacer,
    Text,
    VStack,
} from "@chakra-ui/react";
import { LuChevronRight, LuLogOut } from "react-icons/lu";

const colorPalette = ["red", "blue", "green", "yellow", "purple", "orange"];
const pickPalette = (name) => {
    const index = name.charCodeAt(0) % colorPalette.length;
    return colorPalette[index];
};
export const UserBlock = ({ user, collapsed }) => {
    return (
        <Menu.Root
            lazyMount
            unmountOnExit
            positioning={{ placement: "right-end" }}
        >
            <Menu.Trigger asChild>
                <UserBtn user={user} collapsed={collapsed} />
            </Menu.Trigger>
            <Portal>
                <Menu.Positioner>
                    <UserContent user={user} />
                </Menu.Positioner>
            </Portal>
        </Menu.Root>
    );
};

const UserBtn = ({ user, collapsed, ...props }) => {
    if (collapsed) {
        return (
            <Button
                variant={"ghost"}
                size={"lg"}
                rounded={"lg"}
                w={"full"}
                p={1}
                {...props}
            >
                <Avatar.Root
                    size="sm"
                    colorPalette={pickPalette(user.name)}
                    borderRadius="lg"
                >
                    <Avatar.Image src={user.avatar} />
                    <Avatar.Fallback name={user.name} />
                </Avatar.Root>
            </Button>
        );
    }

    return (
        <Button
            variant={"ghost"}
            size={"xl"}
            w={"full"}
            justifyContent={"start"}
            p={1}
            {...props}
        >
            <Avatar.Root
                size="sm"
                colorPalette={pickPalette(user.name)}
                borderRadius="lg"
            >
                <Avatar.Image src={user.avatar} />
                <Avatar.Fallback name={user.name} />
            </Avatar.Root>
            <VStack gap={0}>
                <Text fontSize="sm" fontWeight="medium" truncate>
                    {user.name}
                </Text>
                {user.roleNames.map((name) => (
                    <Badge key={name} variant="subtle" size={"xs"}>
                        {name}
                    </Badge>
                ))}
            </VStack>
            <Spacer />
            <Icon as={LuChevronRight} boxSize={5} />
        </Button>
    );
};

const UserContent = ({ user }) => {
    const logoutMutation = useLogoutMutation();
    return (
        <Menu.Content
            display={"flex"}
            flexDirection={"column"}
            zIndex={"popover"}
            gap="2"
        >
            <HStack>
                <Avatar.Root
                    size="lg"
                    colorPalette={pickPalette(user.name)}
                    borderRadius="lg"
                >
                    <Avatar.Image src={user.avatar} />
                    <Avatar.Fallback name={user.name} />
                </Avatar.Root>
                <Text>{user.name}</Text>
            </HStack>
            {user.roleNames.map((name) => (
                <Badge key={name} variant="subtle">
                    {name}
                </Badge>
            ))}
            <Menu.Item value={"logout"} onClick={logoutMutation.mutate}>
                <LuLogOut />
                Выйти
            </Menu.Item>
        </Menu.Content>
    );
};
