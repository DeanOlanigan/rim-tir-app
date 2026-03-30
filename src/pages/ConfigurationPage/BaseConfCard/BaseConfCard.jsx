import { Flex, Group, IconButton } from "@chakra-ui/react";
import { ConfMenu } from "./ConfMenu";
import { ValidationErrorsContainer } from "../Validation/ValidationErrorsContainer";
import { LuFlipHorizontal2, LuFlipVertical2 } from "react-icons/lu";
import { useConfigStore } from "../stores";
import { ConfigInfo } from "@/components/ConfigInfo";
import { ConfChecker } from "./ConfChecker";
import { useVariablesStore } from "@/store/variables-store";
import { RADII_MAIN } from "@/config/constants";

export const BaseConfCard = () => {
    return (
        <Flex
            px={6}
            py={4}
            gap={4}
            bg={"bg.panel"}
            borderRadius={RADII_MAIN}
            shadow={"md"}
            w={"100%"}
            h={"full"}
            maxH={"4rem"}
            align={"center"}
        >
            <Flex gap={2} align={"center"}>
                <ConfigInfoWrapper />
                <ConfChecker />
            </Flex>
            <Group>
                <FlipButton />
                <ConfMenu />
            </Group>
            <ValidationErrorsContainer />
        </Flex>
    );
};

const ConfigInfoWrapper = () => {
    const info = useVariablesStore((state) => state.info);

    if (!info.name) return null;

    return (
        <ConfigInfo
            name={info.name}
            date={info.ts}
            description={info.description}
        />
    );
};

const FlipButton = ({ ...props }) => {
    const { flip, setFlip } = useConfigStore((state) => state);
    return (
        <IconButton
            variant="surface"
            size="2xs"
            onClick={() => setFlip()}
            {...props}
        >
            {flip === "vertical" ? <LuFlipHorizontal2 /> : <LuFlipVertical2 />}
        </IconButton>
    );
};
