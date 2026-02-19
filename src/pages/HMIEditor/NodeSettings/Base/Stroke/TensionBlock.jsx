import { Field } from "@chakra-ui/react";
import { LuSpline } from "react-icons/lu";
import { LOCALE } from "@/pages/HMIEditor/constants";
import { PropertyInput } from "../../PropertyInput";

export const TensionBlock = ({ ids }) => {
    return (
        <Field.Root>
            <Field.Label>{LOCALE.tension}</Field.Label>
            <PropertyInput
                ids={ids}
                property="tension"
                label={<LuSpline />}
                min={0}
                max={2}
                step={0.1}
            />
        </Field.Root>
    );
};
