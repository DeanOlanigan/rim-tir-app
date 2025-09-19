export const SCOPE = {
    SELF: "self", // current node
    PARENT: "parent", // find param in parent recursively
    ROOT: "root", // root node only
    SIBLINGS: "siblings", // all nodes in the same parent
    IGNOREFOLDER: "ignoreFolder", // find param in parent recursively without folders
};

export const VALIDATOR = {
    RANGE: "range",
    REGEX: "regex",
    UNIQUE: "unique",
    REQUIRED: "required",
    UNIQUECOMPOSITE: "uniqueComposite",
    NAME: "name",
    CODE: "code",
    MUSTBE: "mustBe",
};

export const NODE_TYPES = {
    folder: "folder",
    dataObject: "dataObject",
    variable: "variable",
    protocol: "protocol",
    interface: "interface",
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

export const isNeedValidate = (nodeType) => NODE_UNIQUE_NAMES.has(nodeType);
