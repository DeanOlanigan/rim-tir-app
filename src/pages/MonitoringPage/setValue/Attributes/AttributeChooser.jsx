import { CheckboxGroup, Fieldset, SimpleGrid } from "@chakra-ui/react";
import { attributesGrouped, attributes } from "./attributes";
import { AttributeCheckbox } from "./AttributeCheckbox";
import { useState } from "react";
import { useMonitoringLive } from "../../store/mqtt-stream-store";

export const AttributeChooser = ({ mode, id }) => {
    const curChecked =
        useMonitoringLive.getState().latest.get(id)?.quality?.attributes ?? [];
    const defChecked =
        mode === "manual"
            ? ["blocked", "substituted", "outdated"]
            : ["invalid"];
    const [checked, setChecked] = useState([...curChecked, ...defChecked]);
    const handleChange = (value) => setChecked(value);

    return (
        <CheckboxGroup
            name="attributes"
            value={checked}
            onValueChange={handleChange}
        >
            {attributesGrouped.map((group) => {
                return (
                    <Fieldset.Root key={group.name}>
                        <Fieldset.Legend>{group.label}</Fieldset.Legend>
                        <Fieldset.Content>
                            <SimpleGrid
                                columns={2}
                                columnGap={"2"}
                                rowGap={"2"}
                                w={"100%"}
                            >
                                {group.attributes.map((attr) => {
                                    const attribute = attributes[attr];
                                    return (
                                        <AttributeCheckbox
                                            key={attribute.name}
                                            attr={attribute}
                                            mode={mode}
                                        />
                                    );
                                })}
                            </SimpleGrid>
                        </Fieldset.Content>
                    </Fieldset.Root>
                );
            })}
        </CheckboxGroup>
    );
};
