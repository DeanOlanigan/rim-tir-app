import { Field } from "@chakra-ui/react";
import { MdLineWeight } from "react-icons/md";
import { LOCALE } from "@/pages/HMIEditor/constants";
import { PropertyInput } from "../../PropertyInput";

export const StrokeWeightBlock = ({ ids }) => {
    return (
        <Field.Root>
            <Field.Label>{LOCALE.strokeWidth}</Field.Label>
            <PropertyInput
                ids={ids}
                property="strokeWidth"
                label={<MdLineWeight />}
                min={0}
                max={100}
            />
        </Field.Root>
    );
};
