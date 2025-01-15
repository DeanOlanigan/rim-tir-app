import { Stack, CheckboxGroup } from "@chakra-ui/react";
import { Checkbox } from "../../../components/ui/checkbox";
import { messageTypes } from "./filterOptions";

function MessageTypes({ filters, setFilters }) {
    console.log("Render MessageTypes");
    return (
        <Stack p={"1"}>
            <CheckboxGroup
                value={filters.events}
                onValueChange={(types) => setFilters({...filters, events: types})}
            >
                {messageTypes.map((type) => (
                    <Checkbox key={type.value} value={type.value}>{type.label}</Checkbox>
                ))}
            </CheckboxGroup>
        </Stack>
    );
}

export default MessageTypes;
