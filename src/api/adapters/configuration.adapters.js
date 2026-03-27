export function mapConfigurationResponseToState(response) {
    return parseConfigurationResponse(response);
}

function parseConfigurationResponse(data) {
    return {
        variables: data?.variables ?? [],
        send: data?.send ?? [],
        receive: data?.receive ?? [],
        settings: data?.settings ?? {},
        info: {
            ts: Number.parseInt(data?.info?.date) || 0,
            name: data?.info?.name || "",
            description: data?.info?.description || "",
        },
    };
}
