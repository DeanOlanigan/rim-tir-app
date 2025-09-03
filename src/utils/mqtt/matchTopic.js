export function matchTopic(filter, topic) {
    // примитивная поддержка MQTT wildcard: + (1 сегмент) и # (хвост)
    const f = filter.split("/");
    const t = topic.split("/");
    for (let i = 0; i < f.length; i++) {
        const seg = f[i];
        if (seg === "#") return true;
        if (seg === "+") {
            if (!t[i]) return false;
            continue;
        }
        if (seg !== t[i]) return false;
    }
    return f.length === t.length;
}
