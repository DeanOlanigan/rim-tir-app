import Ajv from "ajv";
import { SCHEMA_VERSION } from "../constants";

const sha256Hex = {
    type: "string",
    pattern: "^[a-fA-F0-9]{64}$",
};

const assetMetaSchema = {
    type: "object",
    additionalProperties: true, // на старте лучше true, чтобы не падать от лишних полей
    required: ["id", "mimeType", "byteSize", "hash", "storageKey"],
    properties: {
        id: { type: "string" },
        kind: { type: "string", nullable: true }, // "image"
        mimeType: { type: "string" },
        ext: { type: "string", nullable: true },
        fileName: { type: "string", nullable: true },
        byteSize: { type: "number" },

        width: { type: "number", nullable: true },
        height: { type: "number", nullable: true },

        hash: sha256Hex,

        createdAt: { type: "number", nullable: true },
        firstUsedAt: { type: "number", nullable: true },
        lastUsedAt: { type: "number", nullable: true },

        storageKey: { type: "string" }, // "assets/<id>.png"
        source: { type: "string", nullable: true },
    },
};

const schema = {
    type: "object",
    additionalProperties: false,
    required: [
        "kind",
        "schemaVersion",
        "projectId",
        "projectName",
        "activePageId",
        "pageIdWithThumb",
        "pages",
        "nodes",
    ],
    properties: {
        kind: { const: "HMIEditorProject" },
        schemaVersion: { const: SCHEMA_VERSION },
        projectId: { type: "string" },
        projectName: { type: "string" },
        activePageId: { type: "string" },
        pageIdWithThumb: { type: "string" },
        pages: {
            type: "object",
            additionalProperties: {
                type: "object",
                required: ["id", "name", "rootIds"],
                additionalProperties: true,
                properties: {
                    id: { type: "string" },
                    name: { type: "string" },
                    rootIds: {
                        type: "array",
                        items: { type: "string" },
                    },
                    type: {
                        type: "string",
                        enum: ["SCREEN", "LIBRARY"],
                        nullable: true,
                    },
                    backgroundColor: { type: "string", nullable: true },
                },
            },
        },
        nodes: {
            type: "object",
            additionalProperties: {
                type: "object",
                additionalProperties: true,
                required: ["id", "type", "name", "parentId"],
                properties: {
                    id: { type: "string" },
                    parentId: { type: "string", nullable: true },
                    type: { type: "string" },
                    name: { type: "string" },
                    x: { type: "number", nullable: true },
                    y: { type: "number", nullable: true },
                    rotation: { type: "number", nullable: true },
                    childrenIds: {
                        type: "array",
                        items: { type: "string" },
                        nullable: true,
                    },
                    points: {
                        type: "array",
                        items: { type: "number" },
                        nullable: true,
                    },
                },
            },
        },
        assets: {
            type: "object",
            nullable: true,
            additionalProperties: assetMetaSchema,
        },
        assetHashIndex: {
            type: "object",
            nullable: true,
        },
    },
};

const ajv = new Ajv({ allErrors: true, strict: false });

const validateCompiled = ajv.compile(schema);

export function validateProjectStructure(data) {
    if (validateCompiled(data)) return { ok: true, value: data };
    const errors = validateCompiled.errors.map((err) => {
        const path = err.instancePath ? ` at ${err.instancePath}` : "";
        const msg = `${err.message || "Validation error"}`;
        return `${msg}${path}`;
    }) ?? ["Unknown validation error"];
    return { ok: false, errors };
}
