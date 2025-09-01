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
