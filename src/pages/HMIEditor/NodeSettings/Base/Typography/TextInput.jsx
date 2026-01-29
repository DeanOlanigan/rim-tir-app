import { Field, Textarea } from "@chakra-ui/react";
import { sameCheck, useNodesByIds } from "../../utils";
import { patchStoreRaf } from "@/pages/HMIEditor/store/node-store";

export const TextInputBlock = ({ ids }) => {
    const texts = useNodesByIds(ids, "text");
    const text = sameCheck(texts);

    const handleChange = (text) => {
        const patch = {};
        ids.forEach((id) => {
            patch[id] = { text };
        });
        patchStoreRaf(ids, patch);
    };

    return (
        <Field.Root>
            <Field.Label>Text</Field.Label>
            <Textarea
                size={"xs"}
                minHeight={"8"}
                height={"12"}
                maxHeight={"20"}
                value={text}
                onChange={(e) => handleChange(e.target.value)}
            />
        </Field.Root>
    );
};
