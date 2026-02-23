import { Field, SegmentGroup } from "@chakra-ui/react";
import { TbCapProjecting, TbCapRounded, TbCapStraight } from "react-icons/tb";
import { sameCheck, useNodesByIds } from "../../utils";
import { useNodeStore } from "@/pages/HMIEditor/store/node-store";
import { LOCALE } from "@/pages/HMIEditor/constants";

export const LineCapBlock = ({ ids }) => {
    const lineCaps = useNodesByIds(ids, "lineCap");
    const lineCap = sameCheck(lineCaps);

    const handleChange = (e) => {
        const patch = {};
        for (const id of ids) patch[id] = { lineCap: e.value };
        useNodeStore.getState().updateNodes(patch);
    };

    return (
        <Field.Root>
            <Field.Label>{LOCALE.lineCap}</Field.Label>
            <SegmentGroup.Root
                size={"xs"}
                value={lineCap}
                onValueChange={handleChange}
            >
                <SegmentGroup.Indicator bg={"colorPalette.solid"} />
                <SegmentGroup.Items
                    items={[
                        { value: "butt", label: <TbCapStraight size={16} /> },
                        { value: "round", label: <TbCapRounded size={16} /> },
                        {
                            value: "square",
                            label: <TbCapProjecting size={16} />,
                        },
                    ]}
                />
            </SegmentGroup.Root>
        </Field.Root>
    );
};
