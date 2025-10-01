import { CheckboxCard, CheckboxGroup, Group } from "@chakra-ui/react";
import { LuCircleAlert, LuInfo, LuTriangleAlert } from "react-icons/lu";
import { useLogStore } from "../../Store/store";
import { LOG_LEVELS } from "@/config/constants";

export const LogTypesFilterButtons = () => {
    const filter = useLogStore((state) => state.filter);
    const { setFilter } = useLogStore.getState();

    return (
        <CheckboxGroup
            onValueChange={(activeFilters) => setFilter(activeFilters)}
            value={filter}
        >
            <Group attached shadow={"xs"}>
                <CheckboxCard.Root
                    variant={"surface"}
                    colorPalette={"yellow"}
                    value={LOG_LEVELS.warn}
                >
                    <CheckboxCard.HiddenInput />
                    <CheckboxCard.Control p={"0.45rem"}>
                        <LuTriangleAlert size={"16px"} />
                    </CheckboxCard.Control>
                </CheckboxCard.Root>
                <CheckboxCard.Root
                    variant={"surface"}
                    colorPalette={"red"}
                    value={LOG_LEVELS.error}
                >
                    <CheckboxCard.HiddenInput />
                    <CheckboxCard.Control p={"0.45rem"}>
                        <LuCircleAlert size={"16px"} />
                    </CheckboxCard.Control>
                </CheckboxCard.Root>
                <CheckboxCard.Root
                    variant={"surface"}
                    colorPalette={"blue"}
                    value={LOG_LEVELS.info}
                >
                    <CheckboxCard.HiddenInput />
                    <CheckboxCard.Control p={"0.45rem"}>
                        <LuInfo size={"16px"} />
                    </CheckboxCard.Control>
                </CheckboxCard.Root>
            </Group>
        </CheckboxGroup>
    );
};
