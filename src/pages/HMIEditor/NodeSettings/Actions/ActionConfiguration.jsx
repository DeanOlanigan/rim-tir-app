import { Box } from "@chakra-ui/react";
import { Navigate } from "./Navigate";
import { ToggleTag } from "./ToggleTag";
import { Confirmation } from "./Confirmation";
import { WriteTag } from "./WriteTag";

export const ActionConfiguration = ({ action, onUpdate }) => {
    const handleChange = (key, value) => {
        onUpdate({
            ...action,
            options: { ...action.options, [key]: value },
        });
    };

    // 1. WRITE_TAG
    if (action.type === "WRITE_TAG") {
        return <WriteTag action={action} handleChange={handleChange} />;
    }

    // 2. CONFIRMATION
    if (action.type === "CONFIRMATION") {
        return <Confirmation action={action} handleChange={handleChange} />;
    }

    // 3. NAVIGATE
    if (action.type === "NAVIGATE") {
        return <Navigate action={action} handleChange={handleChange} />;
    }

    if (action.type === "TOGGLE_TAG") {
        return <ToggleTag action={action} handleChange={handleChange} />;
    }

    return (
        <Box color="gray.500" fontSize="sm">
            No settings for this type.
        </Box>
    );
};
