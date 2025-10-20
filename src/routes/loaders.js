export async function monitoringLoader() {
    const { ensureConfiguratorConfig } = await import(
        "@/utils/configurationParser"
    );
    await ensureConfiguratorConfig();
    return null;
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

    const { ensureConfiguratorConfig, configuratorConfig } =
        configurationParser;
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
