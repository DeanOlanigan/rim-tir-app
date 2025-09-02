import { CheckboxGroup, Fieldset, SimpleGrid } from "@chakra-ui/react";
import { attributes } from "./attributes";
import { AttributeCheckbox } from "./AttributeCheckbox";
import { useState } from "react";

export const AttributeChooser = ({ mode }) => {
    const defChecked =
        mode === "manual" ? ["manual", "substituted", "invalid"] : ["invalid"];
    const [checked, setChecked] = useState(defChecked);
    const handleChange = (value) => setChecked(value);

    return (
        <Fieldset.Root>
            <Fieldset.Legend>Атрибуты</Fieldset.Legend>
            <Fieldset.Content>
                <CheckboxGroup
                    name="attributes"
                    value={checked}
                    onValueChange={handleChange}
                >
                    <SimpleGrid
                        columns={2}
                        columnGap={"2"}
                        rowGap={"2"}
                        w={"100%"}
                    >
                        {attributes.map((attr) => (
                            <AttributeCheckbox
                                key={attr.name}
                                attr={attr}
                                mode={mode}
                            />
                        ))}
                    </SimpleGrid>
                </CheckboxGroup>
            </Fieldset.Content>
        </Fieldset.Root>
    );
};
