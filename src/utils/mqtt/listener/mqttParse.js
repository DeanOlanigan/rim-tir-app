export function parseVarMessage(topic, payload) {
    const parts = topic.split("/");
    const uuid = parts[parts.length - 1];
    if (!uuid) return null;

    try {
        const txt = new TextDecoder("utf-8").decode(payload);
        const data = JSON.parse(txt);
        return { uuid, data };
    } catch {
        return null;
    }
}

export function projectToCache(prev, msg) {
    const base = prev;
    if (base.state.settings[msg.uuid] === undefined) return prev;

    return {
        ...base,
        state: {
            ...base.state,
            settings: {
                ...base.state.settings,
                [msg.uuid]: {
                    ...base.state.settings[msg.uuid],
                    mqttPacket: msg.data,
                },
            },
        },
    };
}
