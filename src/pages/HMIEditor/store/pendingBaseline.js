let pendingBaseline = null;

export function setPendingBaseline(b) {
    pendingBaseline = b;
}

export function consumePendingBaseline() {
    const b = pendingBaseline;
    pendingBaseline = null;
    return b;
}

export function clearPendingBaseline() {
    pendingBaseline = null;
}
