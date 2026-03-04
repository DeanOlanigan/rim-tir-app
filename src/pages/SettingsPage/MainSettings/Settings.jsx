import { Button, Group, IconButton, Stack } from "@chakra-ui/react";
import { ServerSettings } from "./WebServSettings";
import { useSettings } from "./hooks/useSettings";
import { useEffect } from "react";
import { CanAccess } from "@/CanAccess";
import { useSettingsMutation } from "./hooks/useSettingsMutation";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LuRotateCcw } from "react-icons/lu";
import { RetentionSettings } from "./RetentionSettings";
import { settingsSchema } from "./settings.schema";

export const Settings = () => {
    const { data: settings, isLoading } = useSettings();
    const settingMutation = useSettingsMutation();

    const methods = useForm({
        resolver: zodResolver(settingsSchema),
        mode: "onChange",
        defaultValues: {
            webServer: {
                port: 8080,
                sessionTtlMinutes: 480,
                https: false,
                certificate: null,
            },
            retention: [],
        },
    });

    const {
        handleSubmit,
        reset,
        formState: { isDirty, isValid, isSubmitting },
    } = methods;

    useEffect(() => {
        if (settings) {
            reset(settings);
        }
    }, [settings, reset]);

    const onSubmit = async (values) => {
        await settingMutation.mutateAsync(values);
    };

    if (isLoading) return null;

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Stack gap="3" w={"100%"}>
                    <CanAccess right={"settings.web_server.edit"}>
                        <ServerSettings />
                    </CanAccess>

                    <RetentionSettings />

                    <CanAccess
                        anyOf={[
                            "settings.web_server.edit",
                            "settings.logs.edit",
                            "settings.journal.edit",
                        ]}
                    >
                        <Group attached w={"100%"}>
                            <Button
                                flex={1}
                                type={"submit"}
                                disabled={!isDirty || !isValid}
                                loading={
                                    isSubmitting || settingMutation.isPending
                                }
                            >
                                {!isDirty
                                    ? "Нет изменений"
                                    : "Применить изменения"}
                            </Button>
                            <IconButton
                                disabled={!isDirty}
                                title={
                                    !isDirty ? "Нечего сбрасывать" : "Сбросить"
                                }
                                onClick={() => {
                                    if (settings) reset(settings);
                                }}
                            >
                                <LuRotateCcw />
                            </IconButton>
                        </Group>
                    </CanAccess>
                </Stack>
            </form>
        </FormProvider>
    );
};
