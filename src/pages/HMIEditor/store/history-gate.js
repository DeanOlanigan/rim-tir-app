let muteDepth = 0;

export function withNodeHistoryMuted(fn) {
    muteDepth += 1;
    try {
        return fn();
    } finally {
        muteDepth -= 1;
    }
}

export function isNodeHistoryMuted() {
    return muteDepth > 0;
}
