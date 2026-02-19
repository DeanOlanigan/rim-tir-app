import { Fieldset, Group } from "@chakra-ui/react";
import { LOCALE } from "../../constants";
import { PropertyInput } from "../PropertyInput";

export const SkewBlock = ({ ids }) => {
    return (
        <Fieldset.Root>
            <Fieldset.Legend>{LOCALE.skew}</Fieldset.Legend>
            <Fieldset.Content mt={1}>
                <Group>
                    <PropertyInput ids={ids} property="skewX" label="X" />
                    <PropertyInput ids={ids} property="skewY" label="Y" />
                </Group>
            </Fieldset.Content>
        </Fieldset.Root>
    );
};
