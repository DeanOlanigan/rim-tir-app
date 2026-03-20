import { CanAccess } from "@/CanAccess";
import { Flex, IconButton } from "@chakra-ui/react";
import { LuPencil, LuPencilOff } from "react-icons/lu";

export const CellLayout = ({ isEditing, setIsEditing, children }) => {
    return (
        <Flex gap={"1"}>
            <Flex
                gap={"1"}
                direction={isEditing ? "column" : "row"}
                position={"relative"}
            >
                {children}
            </Flex>
            <CanAccess right={"config.editor"}>
                <IconButton
                    size={"2xs"}
                    variant={"outline"}
                    borderRadius={"full"}
                    onClick={() => setIsEditing((prev) => !prev)}
                    opacity={"0"}
                    _hover={{
                        colorPalette: "blue",
                    }}
                    _groupHover={{ opacity: 1 }}
                >
                    {isEditing ? <LuPencilOff /> : <LuPencil />}
                </IconButton>
            </CanAccess>
        </Flex>
    );
};
