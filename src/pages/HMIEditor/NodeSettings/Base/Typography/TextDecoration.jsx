import {
    CheckboxCard,
    CheckboxGroup,
    Fieldset,
    Group,
    Icon,
} from "@chakra-ui/react";
import { LuStrikethrough, LuUnderline } from "react-icons/lu";
import { sameCheck, useNodesByIds } from "../../utils";
import { useNodeStore } from "@/pages/HMIEditor/store/node-store";
import { LOCALE } from "@/pages/HMIEditor/constants";

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

export const TextDecorationBlock = ({ ids }) => {
    const textDecorations = useNodesByIds(ids, "textDecoration");
    const textDecoration = sameCheck(textDecorations);

    const handleChange = (e) => {
        const str = e.length === 0 ? "" : e.join(" ");
        const patch = {};
        ids.forEach((id) => {
            patch[id] = { textDecoration: str };
        });

        useNodeStore.getState().updateNodes(ids, patch);
    };

    return (
        <Fieldset.Root>
            <CheckboxGroup
                value={textDecoration?.split(" ")}
                onValueChange={handleChange}
            >
                <Fieldset.Legend>{LOCALE.textDecoration}</Fieldset.Legend>
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
