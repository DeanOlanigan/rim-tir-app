import { Field } from "@chakra-ui/react";
import { TbLineHeight } from "react-icons/tb";
import { LOCALE } from "@/pages/HMIEditor/constants";
import { PropertyInput } from "../../PropertyInput";

export const PaddingBlock = ({ ids }) => {
    return (
        <Field.Root>
            <Field.Label>{LOCALE.padding}</Field.Label>
            <PropertyInput
                ids={ids}
                property="padding"
                label={<TbLineHeight />}
                min={0}
            />
        </Field.Root>
    );
};
