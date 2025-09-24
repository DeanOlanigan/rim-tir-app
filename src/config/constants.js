export const TREE_TYPES = {
    variables: "variables",
    send: "send",
    receive: "receive",
    connections: "connections",
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

export const DO_NOT_VALIDATE = new Set([
    NODE_TYPES.root,
    NODE_TYPES.folder,
    NODE_TYPES.dataObject,
]);

export const NODE_UNIQUE_NAMES = new Set([
    NODE_TYPES.interface,
    NODE_TYPES.protocol,
    NODE_TYPES.variable,
    NODE_TYPES.protocolSpecific,
    NODE_TYPES.interfaceSpecific,
]);

export const CONNECTIONS_TREES = new Set([TREE_TYPES.send, TREE_TYPES.receive]);

export const TREE_TYPES_SET = new Set(Object.values(TREE_TYPES));

export const MAX_NAME_LENGTH = 50;
