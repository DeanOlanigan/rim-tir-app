import {
    SelectContent,
    SelectItem,
    SelectLabel,
    SelectRoot,
    SelectTrigger,
    SelectValueText,
} from "@/components/ui/select";
import { useVariablesOptions } from "@/hooks/useVariablesOptions";

function VariablesChoser({ filters, setFilters }) {
    console.log("Render VariablesChoser");

    const rows = useVariablesOptions();

    return (
        <SelectRoot
            collection={rows}
            size={"xs"}
            multiple
            onValueChange={(value) =>
                setFilters({ ...filters, variables: value.value })
            }
            value={filters.variables}
        >
            <SelectLabel>Переменные:</SelectLabel>
            <SelectTrigger clearable>
                <SelectValueText placeholder="Выберите переменные" />
            </SelectTrigger>
            <SelectContent>
                {rows.items.map((row) => (
                    <SelectItem item={row} key={row.value}>
                        {row.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </SelectRoot>
    );
}

export default VariablesChoser;
