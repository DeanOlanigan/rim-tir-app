import { CheckboxCard, CheckboxGroup, Group } from "@chakra-ui/react";
import { LuCircleAlert, LuInfo, LuTriangleAlert } from "react-icons/lu";
import { useEffect } from "react";
import useLogViewerStore from "../../LogStore/LogViewerStore";

function LogTypesFilterButtons() {
    const setCurrentFilter = useLogViewerStore(state => state.setCurrentFilterZus);
    console.log("Render LogTypesFilterButtons");

    useEffect(() => {
        console.log("LogTypesFilterButtons useEffect triggered");
    });

    return (
        <CheckboxGroup
            onValueChange={(activeFilters) => {
                const newFilterState = {
                    WARNING: activeFilters.includes("WARNING"),
                    ERROR: activeFilters.includes("ERROR"),
                    INFO: activeFilters.includes("INFO"),
                };
                setCurrentFilter(newFilterState);
            }}
            defaultValue={["WARNING", "ERROR", "INFO"]}
        >
            <Group attached shadow={"xs"}>
                <CheckboxCard.Root
                    variant={"surface"}
                    colorPalette={"yellow"}
                    value={"WARNING"}
                    key={"WARNING"}
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
                    key={"ERROR"}
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
                    key={"INFO"}
                >
                    <CheckboxCard.HiddenInput />
                    <CheckboxCard.Control p={"0.45rem"}>
                        <LuInfo size={"16px"} />
                    </CheckboxCard.Control>
                </CheckboxCard.Root>
            </Group>
        </CheckboxGroup>
    );
}

export default LogTypesFilterButtons;
