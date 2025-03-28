import { Text } from "@chakra-ui/react";
import { useState } from "react";
import { dataTypesBytes } from "../../../../../../config/filterOptions";
import { SelectInput } from "../../../../InputComponents";

export const TypeCell = ({ id, type }) => {
    const [isEditType, setIsEditType] = useState(false);

    const { label: typeLabel } = dataTypesBytes.items.find(
        (item) => item.value === type
    );

    const render = isEditType ? (
        <SelectInput
            targetKey={"type"}
            id={id}
            value={type}
            autoFocus
            defaultOpen
            onExitComplete={() => setIsEditType(false)}
        />
    ) : (
        <Text
            _hover={{ color: "fg.info" }}
            cursor={"pointer"}
            onClick={() => setIsEditType(true)}
        >
            {typeLabel}
        </Text>
    );

    return render;
};
