import { CheckboxCard, CheckboxGroup, Group } from "@chakra-ui/react";
import { LuCircleAlert, LuInfo, LuTriangleAlert } from "react-icons/lu";
import { useLogStore } from "../../Store/store";

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
                    value={"WARNING"}
                >
                    <CheckboxCard.HiddenInput />
                    <CheckboxCard.Control p={"0.45rem"}>
                        <LuTriangleAlert size={"16px"} />
                    </CheckboxCard.Control>
                </CheckboxCard.Root>
                <CheckboxCard.Root
                    variant={"surface"}
                    colorPalette={"red"}
                    value={"ERROR"}
                >
                    <CheckboxCard.HiddenInput />
                    <CheckboxCard.Control p={"0.45rem"}>
                        <LuCircleAlert size={"16px"} />
                    </CheckboxCard.Control>
                </CheckboxCard.Root>
                <CheckboxCard.Root
                    variant={"surface"}
                    colorPalette={"blue"}
                    value={"INFO"}
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
