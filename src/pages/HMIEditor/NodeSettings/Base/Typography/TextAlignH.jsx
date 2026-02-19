import { Field, SegmentGroup } from "@chakra-ui/react";
import {
    LuAlignCenter,
    LuAlignJustify,
    LuAlignLeft,
    LuAlignRight,
} from "react-icons/lu";
import { sameCheck, useNodesByIds } from "../../utils";
import { useNodeStore } from "@/pages/HMIEditor/store/node-store";
import { LOCALE } from "@/pages/HMIEditor/constants";

export const TextAlignHBlock = ({ ids }) => {
    const aligns = useNodesByIds(ids, "align");
    const align = sameCheck(aligns);

    const handleChange = (e) => {
        const patch = {};
        ids.forEach((id) => {
            patch[id] = { align: e.value };
        });

        useNodeStore.getState().updateNodes(ids, patch);
    };

    return (
        <Field.Root>
            <Field.Label>{LOCALE.alignH}</Field.Label>
            <SegmentGroup.Root
                size={"xs"}
                value={align}
                onValueChange={handleChange}
            >
                <SegmentGroup.Indicator bg={"colorPalette.solid"} />
                <SegmentGroup.Items
                    items={[
                        { value: "left", label: <LuAlignLeft size={16} /> },
                        { value: "center", label: <LuAlignCenter size={16} /> },
                        { value: "right", label: <LuAlignRight size={16} /> },
                        {
                            value: "justify",
                            label: <LuAlignJustify size={16} />,
                        },
                    ]}
                />
            </SegmentGroup.Root>
        </Field.Root>
    );
};
