import { QK } from "@/api";
import { apiv2 } from "@/api/baseUrl";
import { getRoles } from "@/api/getRoles";
import { getUsers } from "@/api/getUsers";
import { getProject } from "@/api/hmi";
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
            queryFn: async () => {
                const res = await apiv2.get("/settings");
                await new Promise((res) => setTimeout(res, 1000));
                return res.data;
            },
            retry: false,
        }),
        queryClient.prefetchQuery({
            queryKey: QK.users,
            queryFn: async () => getUsers(),
        }),
        queryClient.prefetchQuery({
            queryKey: QK.roles,
            queryFn: async () => getRoles(),
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

export async function hmiEditorLoader({ request }) {
    const url = new URL(request.url);
    const project = url.searchParams.get("project");

    if (!project) return null;

    return queryClient.ensureQueryData({
        queryKey: ["hmiProject", project],
        queryFn: () => getProject(project),
    });
}
