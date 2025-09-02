import { Field, NumberInput } from "@chakra-ui/react";
import { useState } from "react";

function validateNumber(value, c) {
    if (value === "" || value === null) return "Поле не может быть пустым";
    const n = Number(value);
    if (c.integer && !Number.isInteger(n)) return "Значение должно быть целым";
    if (c.min && n < c.min) return `Значение не может быть меньше ${c.min}`;
    if (c.max && n > c.max) return `Значение не может быть больше ${c.max}`;
    return null;
}

export const VariableValueInput = ({ dataType }) => {
    const [value, setValue] = useState(0);
    const [error, setError] = useState(null);

    const handleValueChange = (details) => {
        const next = details?.value ?? 0;
        setValue(next);
        const msg = validateNumber(next, dataType);
        setError(msg);
    };

    return (
        <Field.Root invalid={error !== null}>
            <Field.Label>Значение</Field.Label>
            <NumberInput.Root
                size={"xs"}
                min={dataType.min}
                max={dataType.max}
                step={dataType.step}
                onValueChange={handleValueChange}
                value={value}
            >
                <NumberInput.Control />
                <NumberInput.Input />
            </NumberInput.Root>
            <Field.ErrorText>{error}</Field.ErrorText>
            <Field.HelperText>
                {dataType.integer ? "Целое" : "С плавающей точкой"}{" "}
                {dataType.min !== null && `от ${dataType.min}`}{" "}
                {dataType.max && `до ${dataType.max}`}
            </Field.HelperText>
        </Field.Root>
    );
};
