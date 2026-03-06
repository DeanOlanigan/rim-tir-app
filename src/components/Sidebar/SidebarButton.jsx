import { Button, Icon, IconButton, Text } from "@chakra-ui/react";

export const SidebarAction = ({
    icon,
    label,
    isActive,
    isPending,
    collapsed,
    onClick,
    ...props
}) => {
    if (collapsed) {
        return (
            <IconButton
                onClick={onClick}
                variant={isActive ? "solid" : "ghost"}
                loading={isPending}
                size="xs"
                {...props}
            >
                <Icon as={icon} boxSize={5} />
            </IconButton>
        );
    }

    return (
        <Button
            onClick={onClick}
            variant={isActive ? "solid" : "ghost"}
            loading={isPending}
            size="xs"
            w="full"
            justifyContent="flex-start"
            gap={2}
            {...props}
        >
            <Icon as={icon} boxSize={5} />
            <Text
                fontSize="sm"
                fontWeight="medium"
                overflow="hidden"
                textOverflow="ellipsis"
                whiteSpace="nowrap"
            >
                {label}
            </Text>
        </Button>
    );
};

export const SidebarButton = ({ icon, name, isActive, onClick, ...props }) => {
    return (
        <Button
            onClick={onClick}
            variant={isActive ? "solid" : "ghost"}
            size="xs"
            w={"full"}
            justifyContent={"start"}
            gap={2}
            {...props}
        >
            <Icon as={icon} boxSize={5} />
            <Text
                fontSize="sm"
                fontWeight="medium"
                overflow="hidden"
                textOverflow="ellipsis"
                whiteSpace="nowrap"
            >
                {name}
            </Text>
        </Button>
    );
};

export const SidebarCollapsedButton = ({
    icon,
    isActive,
    onClick,
    ...props
}) => {
    return (
        <IconButton
            onClick={onClick}
            variant={isActive ? "solid" : "ghost"}
            size="xs"
            {...props}
        >
            <Icon as={icon} boxSize={5} />
        </IconButton>
    );
};
