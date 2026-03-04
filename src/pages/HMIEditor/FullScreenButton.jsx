import { IconButton, Text } from "@chakra-ui/react";
import { Tooltip } from "@/components/ui/tooltip";
import { useAppStore } from "@/store/app-store";
import { LuMaximize, LuMinimize } from "react-icons/lu";

export const FullScreenButton = () => {
    const fullScreenMode = useAppStore((state) => state.fullScreenMode);
    return (
        <Tooltip
            showArrow
            content={
                fullScreenMode ? (
                    <Text>Выйти из полноэкранного режима</Text>
                ) : (
                    <Text>Перейти в полноэкранный режим</Text>
                )
            }
        >
            <IconButton
                pointerEvents={"auto"}
                size={"sm"}
                p={2}
                variant={"subtle"}
                rounded={"full"}
                shadow={"md"}
                onClick={() => useAppStore.getState().toggleFullScreenMode()}
            >
                {fullScreenMode ? <LuMinimize /> : <LuMaximize />}
            </IconButton>
        </Tooltip>
    );
};
