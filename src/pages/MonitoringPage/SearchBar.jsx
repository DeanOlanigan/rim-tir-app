import { IconButton, Input, InputGroup } from "@chakra-ui/react";
import { useState } from "react";
import { LuArrowRight, LuSearch, LuX } from "react-icons/lu";

export const SearchBar = ({ searchTerm, setSearchTerm }) => {
    const [innerTerm, setInnerTerm] = useState(searchTerm);

    return (
        <InputGroup
            px={"2"}
            maxW={"25rem"}
            startElement={<LuSearch />}
            endElement={
                innerTerm && (
                    <>
                        <IconButton
                            size={"2xs"}
                            rounded={"full"}
                            variant={"ghost"}
                            onClick={() => {
                                setInnerTerm("");
                                setSearchTerm("");
                            }}
                        >
                            <LuX />
                        </IconButton>
                        <IconButton
                            size={"2xs"}
                            rounded={"full"}
                            variant={"surface"}
                            onClick={() => {
                                setSearchTerm(innerTerm);
                            }}
                        >
                            <LuArrowRight />
                        </IconButton>
                    </>
                )
            }
        >
            <Input
                placeholder="Поиск"
                size={"xs"}
                bg={"bg"}
                borderRadius={"full"}
                value={innerTerm}
                onChange={(e) => {
                    setInnerTerm(e.target.value);
                }}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        setSearchTerm(innerTerm);
                    }
                }}
            />
        </InputGroup>
    );
};
