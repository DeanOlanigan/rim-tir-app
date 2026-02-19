import { Heading, VStack } from "@chakra-ui/react";
import { LOCALE } from "../../constants";
import { PropertyColor } from "../PropertyColor";

export const FillBlock = ({ ids }) => {
    return (
        <VStack align={"start"} w={"100%"}>
            <Heading size={"md"}>{LOCALE.fill}</Heading>
            <PropertyColor ids={ids} property="fill" />
        </VStack>
    );
};
