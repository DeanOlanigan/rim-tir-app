import { Card, Icon, Text } from "@chakra-ui/react";
import { useOpeningState } from "./useOpeningState";

export const ActionCard = ({
    icon,
    title,
    subTitle,
    onClick,
    disabled,
    ...props
}) => {
    const { isOpening } = useOpeningState();

    const isDisabled = isOpening || disabled;

    const style = {
        opacity: isDisabled ? 0.4 : 1,
        cursor: isDisabled ? "not-allowed" : "pointer",
        _hover: isDisabled
            ? {}
            : { bg: "colorPalette.subtle", borderColor: "colorPalette.500" },
        onClick: isDisabled ? () => {} : onClick,
    };

    return (
        <Card.Root
            variant="outline"
            borderStyle="dashed"
            h={"full"}
            {...style}
            {...props} // Важно для проброса рефов из FileUpload
        >
            <Card.Body
                display="flex"
                flexDirection="column"
                alignItems="center"
                textAlign={"center"}
                justifyContent="center"
                gap="2"
                h="full"
            >
                <Icon as={icon} boxSize="8" color="colorPalette.500" />
                <Text
                    fontWeight="medium"
                    fontSize="sm"
                    color="colorPalette.600"
                >
                    {title}
                </Text>
                <Text fontSize="xs" color="gray.400">
                    {subTitle}
                </Text>
            </Card.Body>
        </Card.Root>
    );
};
