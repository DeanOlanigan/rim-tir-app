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
    CUSTOM: "custom",
    REQUIRED: "required",
};
