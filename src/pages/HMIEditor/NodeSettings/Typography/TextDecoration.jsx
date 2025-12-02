import {
    CheckboxCard,
    CheckboxGroup,
    Fieldset,
    Group,
    Icon,
} from "@chakra-ui/react";
import { useState } from "react";
import { LuStrikethrough, LuUnderline } from "react-icons/lu";
import { patchNodeThrottled } from "../utils";

const items = [
    {
        value: "underline",
        icon: LuUnderline,
    },
    {
        value: "line-through",
        icon: LuStrikethrough,
    },
];

export const TextDecorationBlock = ({ node }) => {
    const [value, setValue] = useState(node.textDecoration().split(" "));

    const handleChange = (e) => {
        setValue(e);
        const str = e.length === 0 ? "" : e.join(" ");
        node.textDecoration(str);
        patchNodeThrottled(node.id(), { textDecoration: str });
    };

    return (
        <Fieldset.Root>
            <CheckboxGroup value={value} onValueChange={handleChange}>
                <Fieldset.Legend>Text decoration</Fieldset.Legend>
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
