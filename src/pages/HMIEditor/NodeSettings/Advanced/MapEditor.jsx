import { Heading, HStack, IconButton, Input, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { LuPlus, LuTrash2 } from "react-icons/lu";
import { ParamSet } from "./ParamSet";

export const MapEditor = ({ type }) => {
    const [rules, setRules] = useState([]);

    return (
        <VStack align={"start"} w={"100%"}>
            <HStack w={"100%"}>
                <Heading size={"sm"} w={"100%"}>
                    Map Editor
                </Heading>
                <IconButton
                    variant={"outline"}
                    size={"xs"}
                    onClick={() => setRules([...rules, { id: Date.now() }])}
                >
                    <LuPlus />
                </IconButton>
            </HStack>
            {rules.map((rule) => (
                <HStack key={rule.id} w={"100%"}>
                    <Input w={"120px"} size={"xs"} />→<ParamSet type={type} />
                    <IconButton
                        variant={"outline"}
                        size={"xs"}
                        onClick={() =>
                            setRules(rules.filter((r) => r.id !== rule.id))
                        }
                    >
                        <LuTrash2 />
                    </IconButton>
                </HStack>
            ))}
        </VStack>
    );
};
