import { Field, SegmentGroup } from "@chakra-ui/react";
import { TbCapProjecting, TbCapRounded, TbCapStraight } from "react-icons/tb";
import { sameCheck, useNodesByIds } from "../../utils";
import { patchStoreRaf } from "@/pages/HMIEditor/store/node-store";

export const LineCapBlock = ({ ids }) => {
    const lineCaps = useNodesByIds(ids, "lineCap");
    const lineCap = sameCheck(lineCaps);

    const handleChange = (e) => {
        const patch = {};
        ids.forEach((id) => {
            patch[id] = { lineCap: e.value };
        });
        patchStoreRaf(ids, patch);
    };

    return (
        <Field.Root>
            <Field.Label>Line Cap</Field.Label>
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
