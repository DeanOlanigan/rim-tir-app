import { IconButton } from "@chakra-ui/react";
import { ConfMenu } from "./ConfMenu";
import { RouterMenu } from "./RouterMenu";
import { ValidationErrorsContainer } from "../Validation/ValidationErrorsContainer";
import { LuFlipHorizontal2, LuFlipVertical2 } from "react-icons/lu";
import { useConfigStore } from "../stores";
import { SubHeader } from "@/components/Header/SubHeader";
import { ConfigInfo } from "@/components/ConfigInfo";
import { useConfigInfoStore } from "@/store/config-info-store";

export const BaseConfCard = () => {
    return (
        <SubHeader>
            <FlipButton />
            <ConfMenu />
            <RouterMenu />
            <ConfigInfoWrapper />
            <ValidationErrorsContainer />
        </SubHeader>
    );
};

const ConfigInfoWrapper = () => {
    const { name, date, description } = useConfigInfoStore(
        (state) => state.configInfo
    );
    return <ConfigInfo name={name} date={date} description={description} />;
};

const FlipButton = () => {
    const { flip, setFlip } = useConfigStore((state) => state);
    return (
        <IconButton variant="surface" size="2xs" onClick={() => setFlip()}>
            {flip === "vertical" ? <LuFlipHorizontal2 /> : <LuFlipVertical2 />}
        </IconButton>
    );
};
