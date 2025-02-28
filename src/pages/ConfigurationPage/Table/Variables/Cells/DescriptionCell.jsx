import { Textarea } from "@chakra-ui/react";
import { useVariablesStore } from "../../../../../store/variables-store";
import { memo } from "react";

export const DescriptionCell = memo(function DescriptionCell({
    description,
    id,
}) {
    console.log("Render DescriptionCell");
    const setSettings = useVariablesStore((state) => state.setSettings);

    return (
        <Textarea
            size={"xs"}
            minH={"32px"}
            value={description}
            onChange={(e) => {
                setSettings(id, {
                    description: e.target.value,
                });
            }}
        />
    );
});
