import { Field } from "@chakra-ui/react";
import { TbLineHeight } from "react-icons/tb";
import { LOCALE } from "@/pages/HMIEditor/constants";
import { PropertyInput } from "../../PropertyInput";

export const LineHeightBlock = ({ ids }) => {
    return (
        <Field.Root>
            <Field.Label>{LOCALE.lineHeight}</Field.Label>
            <PropertyInput
                ids={ids}
                property="lineHeight"
                label={<TbLineHeight />}
                min={0}
                step={0.1}
            />
        </Field.Root>
    );
};
