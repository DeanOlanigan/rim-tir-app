import { Flex, Group, IconButton } from "@chakra-ui/react";
import { ConfMenu } from "./ConfMenu";
import { RouterMenu } from "./RouterMenu";
import { ValidationErrorsContainer } from "../Validation/ValidationErrorsContainer";
import { LuFlipHorizontal2, LuFlipVertical2 } from "react-icons/lu";
import { useConfigStore } from "../stores";
import { ConfigInfo } from "@/components/ConfigInfo";
import { ConfChecker } from "./ConfChecker";
import { useVariablesStore } from "@/store/variables-store";

export const BaseConfCard = () => {
    return (
        <Flex
            px={4}
            py={1}
            gap={4}
            borderBottom={"0.25rem solid"}
            borderColor={"colorPalette.subtle"}
            h={"full"}
            maxH={"40px"}
            align={"center"}
        >
            <Flex gap={2} align={"center"}>
                <ConfigInfoWrapper />
                <ConfChecker />
            </Flex>
            <Group attached>
                <FlipButton />
                <ConfMenu />
                <RouterMenu />
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
