const SCOPE = {
    SELF: "self", // current node
    PARENT: "parent", // find param in parent recursively
    ROOT: "root", // root node only
    SIBLINGS: "siblings", // all nodes in the same parent
    IGNOREFOLDER: "ignoreFolder", // find param in parent recursively without folders
};

const VALIDATOR = {
    RANGE: "range",
    REGEX: "regex",
    UNIQUE: "unique",
    REQUIRED: "required",
    UNIQUECOMPOSITE: "uniqueComposite",
    NAME: "name",
    CODE: "code",
    MUSTBE: "mustBe",
};

const NODE_TYPES = {
    folder: "folder",
    dataObject: "dataObject",
    variable: "variable",
    protocol: "protocol",
    interface: "interface",
};

const DO_NOT_VALIDATE = new Set([
    NODE_TYPES.root,
    NODE_TYPES.folder,
    NODE_TYPES.dataObject,
]);

const NODE_UNIQUE_NAMES = new Set([
    NODE_TYPES.interface,
    NODE_TYPES.protocol,
    NODE_TYPES.variable,
    NODE_TYPES.protocolSpecific,
    NODE_TYPES.interfaceSpecific,
]);

const isNeedValidate = (nodeType) => NODE_UNIQUE_NAMES.has(nodeType);

export {
    SCOPE,
    VALIDATOR,
    NODE_TYPES,
    DO_NOT_VALIDATE,
    NODE_UNIQUE_NAMES,
    isNeedValidate,
};
