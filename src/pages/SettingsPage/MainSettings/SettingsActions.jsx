import { Button, Group, IconButton } from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";
import { LuRotateCcw } from "react-icons/lu";

export const SettingsActions = ({ onReset, isSaving }) => {
    const {
        formState: { isDirty, isValid, isSubmitting },
    } = useFormContext();

    return (
        <Group attached w="100%">
            <Button
                flex={1}
                type="submit"
                disabled={!isDirty || !isValid}
                loading={isSubmitting || isSaving}
            >
                {!isDirty ? "Нет изменений" : "Применить изменения"}
            </Button>

            <IconButton
                type="button"
                disabled={!isDirty}
                title={!isDirty ? "Нечего сбрасывать" : "Сбросить"}
                onClick={onReset}
            >
                <LuRotateCcw />
            </IconButton>
        </Group>
    );
};
