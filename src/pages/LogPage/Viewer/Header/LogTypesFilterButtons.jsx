import { CheckboxCard, CheckboxGroup, Group } from "@chakra-ui/react";
import { LuCircleAlert, LuInfo, LuTriangleAlert } from "react-icons/lu";
import { useLogStore } from "../../store/store";
import { LOG_LEVELS } from "@/config/constants";
import { Tooltip } from "@/components/ui/tooltip";

export const LogTypesFilterButtons = () => {
    const filter = useLogStore((state) => state.filter);
    const { setFilter } = useLogStore.getState();

    return (
        <CheckboxGroup
            onValueChange={(activeFilters) => setFilter(activeFilters)}
            value={filter}
            zIndex={1}
        >
            <Group attached shadow={"xs"}>
                <CheckboxCard.Root
                    variant={"surface"}
                    colorPalette={"yellow"}
                    value={LOG_LEVELS.warn}
                >
                    <CheckboxCard.HiddenInput />
                    <Tooltip showArrow content={"Предупреждения"}>
                        <CheckboxCard.Control p={"0.45rem"}>
                            <LuTriangleAlert size={"16px"} />
                        </CheckboxCard.Control>
                    </Tooltip>
                </CheckboxCard.Root>

                <CheckboxCard.Root
                    variant={"surface"}
                    colorPalette={"red"}
                    value={LOG_LEVELS.error}
                >
                    <CheckboxCard.HiddenInput />
                    <Tooltip showArrow content={"Ошибки"}>
                        <CheckboxCard.Control p={"0.45rem"}>
                            <LuCircleAlert size={"16px"} />
                        </CheckboxCard.Control>
                    </Tooltip>
                </CheckboxCard.Root>
                <CheckboxCard.Root
                    variant={"surface"}
                    colorPalette={"blue"}
                    value={LOG_LEVELS.info}
                >
                    <CheckboxCard.HiddenInput />
                    <Tooltip showArrow content={"Информация"}>
                        <CheckboxCard.Control p={"0.45rem"}>
                            <LuInfo size={"16px"} />
                        </CheckboxCard.Control>
                    </Tooltip>
                </CheckboxCard.Root>
            </Group>
        </CheckboxGroup>
    );
};
