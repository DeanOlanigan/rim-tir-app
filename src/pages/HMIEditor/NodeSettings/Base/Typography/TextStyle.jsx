import {
    CheckboxCard,
    CheckboxGroup,
    Fieldset,
    Group,
    Icon,
} from "@chakra-ui/react";
import { LuBold, LuItalic } from "react-icons/lu";
import { sameCheck, useNodesByIds } from "../../utils";
import { useNodeStore } from "@/pages/HMIEditor/store/node-store";
import { LOCALE } from "@/pages/HMIEditor/constants";

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

export const TextStyleBlock = ({ ids }) => {
    const fontStyles = useNodesByIds(ids, "fontStyle");
    const fontStyle = sameCheck(fontStyles);

    const handleChange = (e) => {
        const str = e.length === 0 ? "" : e.join(" ");
        const patch = {};
        for (const id of ids) patch[id] = { fontStyle: str };
        useNodeStore.getState().updateNodes(patch);
    };

    return (
        <Fieldset.Root>
            <CheckboxGroup
                value={fontStyle?.split(" ")}
                onValueChange={handleChange}
            >
                <Fieldset.Legend>{LOCALE.textStyle}</Fieldset.Legend>
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
