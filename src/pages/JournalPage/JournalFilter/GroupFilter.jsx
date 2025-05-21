import { Stack, CheckboxGroup } from "@chakra-ui/react";
import { Checkbox } from "@/components/ui/checkbox";
import { groups } from "./filterOptions";

function GroupFilter({ filters, setFilters }) {
    console.log("Render GroupFilter");
    return (
        <Stack p={"1"}>
            <CheckboxGroup
                value={filters.groups}
                onValueChange={(value) =>
                    setFilters({ ...filters, groups: value })
                }
            >
                {groups.map((group) => (
                    <Checkbox key={group.value} value={group.value}>
                        {group.label}
                    </Checkbox>
                ))}
            </CheckboxGroup>
        </Stack>
    );
}

export default GroupFilter;
