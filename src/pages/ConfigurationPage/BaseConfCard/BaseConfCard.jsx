import { IconButton } from "@chakra-ui/react";
import { ConfMenu } from "./ConfMenu";
import { RouterMenu } from "./RouterMenu";
import { ValidationErrorsContainer } from "../Validation/ValidationErrorsContainer";
import { LuFlipHorizontal2, LuFlipVertical2 } from "react-icons/lu";
import { useConfigStore } from "../stores";
import { SubHeader } from "@/components/Header/SubHeader";
import { ConfigInfo } from "@/components/ConfigInfo";
import { ConfChecker } from "./ConfChecker";
import { useVariablesStore } from "@/store/variables-store";

export const BaseConfCard = () => {
    return (
        <SubHeader>
            <FlipButton />
            <ConfMenu />
            <RouterMenu />
            <ConfigInfoWrapper />
            <ValidationErrorsContainer />
            <ConfChecker />
        </SubHeader>
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

const FlipButton = () => {
    const { flip, setFlip } = useConfigStore((state) => state);
    return (
        <IconButton variant="surface" size="2xs" onClick={() => setFlip()}>
            {flip === "vertical" ? <LuFlipHorizontal2 /> : <LuFlipVertical2 />}
        </IconButton>
    );
};
