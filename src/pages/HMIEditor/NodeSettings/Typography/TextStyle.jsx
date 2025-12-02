import {
    CheckboxCard,
    CheckboxGroup,
    Fieldset,
    Group,
    Icon,
} from "@chakra-ui/react";
import { useState } from "react";
import { LuBold, LuItalic } from "react-icons/lu";
import { patchNodeThrottled } from "../utils";

// eslint-disable-next-line
//TODO Можно добавить обработку font weight
// https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/font#formal_syntax

const items = [
    {
        value: "bold",
        icon: LuBold,
    },
    {
        value: "italic",
        icon: LuItalic,
    },
];

export const TextStyleBlock = ({ node }) => {
    const [value, setValue] = useState(node.fontStyle().split(" "));

    const handleChange = (e) => {
        setValue(e);
        const str = e.length === 0 ? "" : e.join(" ");
        node.fontStyle(str);
        patchNodeThrottled(node.id(), { fontStyle: str });
    };

    return (
        <Fieldset.Root>
            <CheckboxGroup value={value} onValueChange={handleChange}>
                <Fieldset.Legend>Text style</Fieldset.Legend>
                <Group attached>
                    {items.map((item) => (
                        <CheckboxCard.Root
                            key={item.value}
                            value={item.value}
                            size={"sm"}
                            height={"8"}
                            width={"8"}
                            align={"center"}
                            justify={"center"}
                        >
                            <CheckboxCard.HiddenInput />
                            <CheckboxCard.Control p={0}>
                                <CheckboxCard.Content>
                                    <Icon as={item.icon} />
                                </CheckboxCard.Content>
                            </CheckboxCard.Control>
                        </CheckboxCard.Root>
                    ))}
                </Group>
            </CheckboxGroup>
        </Fieldset.Root>
    );
};
