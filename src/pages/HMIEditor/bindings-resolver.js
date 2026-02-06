export function resolveBinding(binding, runtimeValue, staticFallback) {
    if (!binding || binding.enabled === false) return staticFallback;
    if (runtimeValue === undefined || runtimeValue === null)
        return staticFallback;

    switch (binding.mode) {
        case "direct":
            return runtimeValue;
        case "map":
            return resolveMap(binding, runtimeValue, staticFallback);
        case "threshold":
            return resolveThreshold(binding, runtimeValue, staticFallback);
        default:
            break;
    }
}

function resolveMap(binding, val, fallback) {
    const rules = binding.rules || [];
    const match = rules.find((r) => String(r.from) === String(val));
    return match ? match.set : fallback;
}

function resolveThreshold(binding, val, fallback) {
    const rules = binding.rules || [];
    const numVal = parseFloat(val);
    if (isNaN(numVal)) return fallback;

    const match = rules.find((rule) => {
        const threshold = parseFloat(rule.from);
        switch (rule.type) {
            case "lt":
                return numVal < threshold;
            case "gt":
                return numVal > threshold;
            case "between": {
                const max = parseFloat(rule.to);
                return numVal > threshold && numVal < max;
            }
            default:
                return false;
        }
    });
    return match ? match.set : fallback;
}
