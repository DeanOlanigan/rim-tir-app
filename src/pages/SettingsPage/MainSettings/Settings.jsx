import { Stack } from "@chakra-ui/react";
import { ServerSettings } from "./WebServSettings";
import { useSettings } from "./hooks/useSettings";
import { useEffect, useRef } from "react";
import { CanAccess } from "@/CanAccess";
import { useSettingsMutation } from "./hooks/useSettingsMutation";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RetentionSettings } from "./RetentionSettings";
import { createDefaultSettings, settingsSchema } from "./settings.schema";
import { SettingsActions } from "./SettingsActions";

export const Settings = () => {
    const { data: settings } = useSettings();
    const settingMutation = useSettingsMutation();

    const methods = useForm({
        resolver: zodResolver(settingsSchema),
        mode: "onChange",
        defaultValues: createDefaultSettings(),
    });

    const { handleSubmit, reset } = methods;

    const didInitRef = useRef(false);

    useEffect(() => {
        if (!settings) return;
        // первый приход данных — инициализируем форму
        if (!didInitRef.current) {
            console.log("effect reset");
            reset(settings);
            didInitRef.current = true;
            return;
        }

        // если форма не редактируется — можно синхронизировать
        if (!methods.formState.isDirty) {
            console.log("effect reset2");
            reset(settings);
        }
    }, [settings, reset, methods.formState.isDirty]);

    const onSubmit = async (values) => {
        await settingMutation.mutateAsync(values);
        reset({
            ...values,
            webServer: {
                ...values.webServer,
                certificateFile: null,
            },
        });
    };

    const onReset = () => {
        if (!settings) return;
        reset(settings);
    };

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
                        <SettingsActions
                            onReset={onReset}
                            isSaving={settingMutation.isPending}
                        />
                    </CanAccess>
                </Stack>
            </form>
        </FormProvider>
    );
};
