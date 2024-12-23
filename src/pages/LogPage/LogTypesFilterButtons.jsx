import { CheckboxCard, CheckboxGroup, Group, Icon } from "@chakra-ui/react";
import { LuCircleAlert, LuInfo, LuTriangleAlert } from "react-icons/lu";
import { useLogContext } from "../../providers/LogProvider/LogContext";

function LogTypesFilterButtons() {
    const { dispatch } = useLogContext();

    return (
        <CheckboxGroup
            onValueChange={(activeFilters) => {
                const newFilterState = {
                    WARNING: activeFilters.includes("WARNING"),
                    ERROR: activeFilters.includes("ERROR"),
                    INFO: activeFilters.includes("INFO"),
                };
                dispatch({ type: "SET_FILTER", payload: newFilterState });
            }}
            defaultValue={["WARNING", "ERROR", "INFO"]}
        >
            <Group attached shadow={"md"}>
                <CheckboxCard.Root variant={"surface"} colorPalette={"yellow"} value={"WARNING"} key={"WARNING"}>
                    <CheckboxCard.HiddenInput />
                    <CheckboxCard.Control p={"0.45rem"}>
                        <Icon fontSize={"16px"}>
                            <LuTriangleAlert/>
                        </Icon>
                    </CheckboxCard.Control>
                </CheckboxCard.Root>
                <CheckboxCard.Root variant={"surface"} colorPalette={"red"} value={"ERROR"} key={"ERROR"}>
                    <CheckboxCard.HiddenInput />
                    <CheckboxCard.Control p={"0.45rem"}>
                        <Icon fontSize={"16px"}>
                            <LuCircleAlert/>
                        </Icon>
                    </CheckboxCard.Control>
                </CheckboxCard.Root>
                <CheckboxCard.Root variant={"surface"} colorPalette={"blue"} value={"INFO"} key={"INFO"}>
                    <CheckboxCard.HiddenInput />
                    <CheckboxCard.Control p={"0.45rem"}>
                        <Icon fontSize={"16px"}>
                            <LuInfo/>
                        </Icon>
                    </CheckboxCard.Control>
                </CheckboxCard.Root>
            </Group>
        </CheckboxGroup>
    );
}

export default LogTypesFilterButtons;
