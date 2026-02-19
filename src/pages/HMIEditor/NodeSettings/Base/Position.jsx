import { Fieldset, Group } from "@chakra-ui/react";
import { LOCALE } from "../../constants";
import { PropertyInput } from "../PropertyInput";

export const PositionBlock = ({ ids }) => {
    return (
        <Fieldset.Root>
            <Fieldset.Legend>{LOCALE.position}</Fieldset.Legend>
            <Fieldset.Content mt={1}>
                <Group>
                    <PropertyInput ids={ids} property="x" label="X" />
                    <PropertyInput ids={ids} property="y" label="Y" />
                </Group>
            </Fieldset.Content>
        </Fieldset.Root>
    );
};
