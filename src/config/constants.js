const TREE_TYPES = {
    variables: "variables",
    send: "send",
    receive: "receive",
    connections: "connections",
};

const NODE_TYPES = {
    interface: "interface",
    protocol: "protocol",
    protocolSpecific: "protocolSpecific",
    interfaceSpecific: "interfaceSpecific",
    dataObject: "dataObject",
    variable: "variable",
    folder: "folder",
    root: "root",
};

const CONNECTIONS_TREES = new Set([TREE_TYPES.send, TREE_TYPES.receive]);

const TREE_TYPES_SET = new Set(Object.values(TREE_TYPES));

const MAX_NAME_LENGTH = 50;

const HOSTKEYS = {
    copy: "Ctrl+C",
    cut: "Ctrl+X",
    paste: "Ctrl+V",
    ignore: "Ctrl+I",
    delete: "Backspace",
    rename: "Enter",
    edit: "Enter",
};

const LOG_LEVELS = {
    debug: "debug",
    info: "info",
    warn: "warn",
    error: "error",
    status: "status",
};

const CONN_STATUS = {
    DISCONNECTED: "disconnected",
    STALED: "staled",
    LIVE: "live",
};

export {
    TREE_TYPES,
    NODE_TYPES,
    CONNECTIONS_TREES,
    TREE_TYPES_SET,
    MAX_NAME_LENGTH,
    HOSTKEYS,
    LOG_LEVELS,
    CONN_STATUS,
};
