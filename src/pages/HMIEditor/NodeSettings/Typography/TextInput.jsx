import { Field, Textarea } from "@chakra-ui/react";
import { useState } from "react";
import { patchNodeThrottled } from "../utils";

export const TextInputBlock = ({ node }) => {
    const [text, setText] = useState(node.text() ?? "");

    const handleChange = (text) => {
        setText(text);
        node.text(text);
        patchNodeThrottled(node.id(), { text });
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
