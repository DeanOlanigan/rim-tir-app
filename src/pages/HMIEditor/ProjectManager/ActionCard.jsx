import { Card, Icon, Text } from "@chakra-ui/react";

export const ActionCard = ({ icon, title, subTitle, onClick, ...props }) => {
    return (
        <Card.Root
            variant="outline"
            borderStyle="dashed"
            cursor="pointer"
            h={"full"}
            _hover={{
                bg: "colorPalette.500/10",
                borderColor: "colorPalette.500",
            }}
            onClick={onClick}
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
