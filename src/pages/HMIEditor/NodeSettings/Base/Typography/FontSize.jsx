import { Field } from "@chakra-ui/react";
import { RxFontSize } from "react-icons/rx";
import { LOCALE } from "@/pages/HMIEditor/constants";
import { PropertyInput } from "../../PropertyInput";

export const FontSizeBlock = ({ ids }) => {
    return (
        <Field.Root>
            <Field.Label>{LOCALE.fontSize}</Field.Label>
            <PropertyInput
                ids={ids}
                property="fontSize"
                label={<RxFontSize size={16} />}
                min={1}
                step={1}
            />
        </Field.Root>
    );
};
