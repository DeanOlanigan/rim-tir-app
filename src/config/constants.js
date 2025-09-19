export const TREE_TYPES = {
    variables: "variables",
    send: "send",
    receive: "receive",
};

export const NODE_TYPES = {
    interface: "interface",
    protocol: "protocol",
    protocolSpecific: "protocolSpecific",
    interfaceSpecific: "interfaceSpecific",
    dataObject: "dataObject",
    variable: "variable",
    folder: "folder",
    root: "root",
};

export const CONNECTIONS_TREES = new Set([TREE_TYPES.send, TREE_TYPES.receive]);

export const MAX_NAME_LENGTH = 50;
