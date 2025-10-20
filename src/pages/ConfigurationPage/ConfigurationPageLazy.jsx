const ConfigurationPageLazy = async () => {
    const [
        { ensureConfiguratorConfig },
        { useVariablesStore, rehydrateSettings },
        { validateAll },
        { useValidationStore },
    ] = await Promise.all([
        import("@/utils/configurationParser"),
        import("@/store/variables-store"),
        import("@/utils/validation"),
        import("@/store/validation-store"),
    ]);

    await ensureConfiguratorConfig();

    await rehydrateSettings();

    const settings = useVariablesStore.getState().settings || {};
    const cfg = (await import("@/utils/configurationParser"))
        .configuratorConfig;
    const draft = validateAll(settings, cfg);
    useValidationStore.getState().applyDraft2(draft);

    const { default: ConfigurationPage } = await import("./ConfigurationPage");
    return { default: ConfigurationPage };
};

export default ConfigurationPageLazy;
