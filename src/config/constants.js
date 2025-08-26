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

export const NODE_UNIQUE_NAMES = [
    NODE_TYPES.interface,
    NODE_TYPES.protocol,
    NODE_TYPES.variable,
    NODE_TYPES.protocolSpecific,
    NODE_TYPES.interfaceSpecific,
];
