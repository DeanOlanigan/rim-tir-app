const MonitoringPageLazy = async () => {
    const [{ ensureConfiguratorConfig }] = await Promise.all([
        import("@/utils/configurationParser"),
    ]);

    await ensureConfiguratorConfig();

    const { default: MonitoringPage } = await import("./MonitoringPage");
    return { default: MonitoringPage };
};

export default MonitoringPageLazy;
