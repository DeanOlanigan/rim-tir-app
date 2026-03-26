import { QK } from "@/api";
import { getRoles } from "@/api/routes/roles.api";
import { getSettings } from "@/api/routes/settings.api";
import { getUsers } from "@/api/routes/users.api";
import { queryClient } from "@/queryClients";
import { configuratorConfig } from "@/store/configurator-config";

export async function monitoringLoader() {
    const { ensureConfiguratorConfig } =
        await import("@/utils/configurationParser");
    await ensureConfiguratorConfig();
    return null;
}

export async function settingsLoader() {
    return await Promise.all([
        queryClient.prefetchQuery({
            queryKey: ["settings"],
            queryFn: getSettings,
            retry: false,
        }),
        queryClient.prefetchQuery({
            queryKey: QK.users,
            queryFn: getUsers,
        }),
        queryClient.prefetchQuery({
            queryKey: QK.roles,
            queryFn: getRoles,
        }),
    ]);
}

export async function configurationLoader() {
    const [
        configurationParser,
        variablesStoreMod,
        validationMod,
        validationStoreMod,
    ] = await Promise.all([
        import("@/utils/configurationParser"),
        import("@/store/variables-store"),
        import("@/utils/validation"),
        import("@/store/validation-store"),
    ]);

    const { ensureConfiguratorConfig } = configurationParser;
    const { useVariablesStore, rehydrateSettings } = variablesStoreMod;
    const { validateAll } = validationMod;
    const { useValidationStore } = validationStoreMod;

    await ensureConfiguratorConfig();
    await rehydrateSettings();

    const settings = useVariablesStore.getState().settings || {};
    const draft = validateAll(settings, configuratorConfig);
    useValidationStore.getState().applyDraft2(draft);

    return null;
}
