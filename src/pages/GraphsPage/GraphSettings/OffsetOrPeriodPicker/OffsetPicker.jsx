import { 
    SelectContent,
    SelectItem,
    SelectLabel,
    SelectRoot,
    SelectTrigger,
    SelectValueText
} from "../../../../components/ui/select";
import { offsets } from "../graphSettingsConstants";

function OffsetPicker({settings, setOffset}) {
    return (
        <SelectRoot
            collection={offsets}
            size={"xs"}
            defaultValue={["120"]}
            onValueChange={(value) => {
                setOffset({
                    ...settings,
                    offset: parseInt(value.value[0])
                });
            }}
        >
            <SelectLabel>Оффсет:</SelectLabel>
            <SelectTrigger>
                <SelectValueText placeholder="Выберите оффсет" />
            </SelectTrigger>
            <SelectContent>
                {offsets.items.map((row) => (
                    <SelectItem item={row} key={row.value}>
                        {row.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </SelectRoot>
    );
}

export default OffsetPicker;
