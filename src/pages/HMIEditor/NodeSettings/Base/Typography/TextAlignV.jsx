import { Field, SegmentGroup } from "@chakra-ui/react";
import { LuArrowDownToLine, LuArrowUpToLine } from "react-icons/lu";
import { BsArrowsCollapse } from "react-icons/bs";
import { sameCheck, useNodesByIds } from "../../utils";
import { useNodeStore } from "@/pages/HMIEditor/store/node-store";
import { LOCALE } from "@/pages/HMIEditor/constants";

export const TextAlignVBlock = ({ ids }) => {
    const verticalAligns = useNodesByIds(ids, "verticalAlign");
    const verticalAlign = sameCheck(verticalAligns);

    const handleChange = (e) => {
        const patch = {};

        for (const id of ids) patch[id] = { verticalAlign: e.value };
        useNodeStore.getState().updateNodes(patch);
    };

    return (
        <Field.Root>
            <Field.Label>{LOCALE.alignV}</Field.Label>
            <SegmentGroup.Root
                size={"xs"}
                value={verticalAlign}
                onValueChange={handleChange}
            >
                <SegmentGroup.Indicator bg={"colorPalette.solid"} />
                <SegmentGroup.Items
                    items={[
                        { value: "top", label: <LuArrowUpToLine size={16} /> },
                        {
                            value: "middle",
                            label: <BsArrowsCollapse size={16} />,
                        },
                        {
                            value: "bottom",
                            label: <LuArrowDownToLine size={16} />,
                        },
                    ]}
                />
            </SegmentGroup.Root>
        </Field.Root>
    );
};
