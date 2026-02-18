import Ajv from "ajv";
import { SCHEMA_VERSION } from "../constants";

const schema = {
    type: "object",
    additionalProperties: false,
    required: [
        "kind",
        "schemaVersion",
        "projectName",
        "activePageId",
        "pages",
        "nodes",
    ],
    properties: {
        kind: { const: "HMIEditorProject" },
        schemaVersion: { const: SCHEMA_VERSION },
        projectName: { type: "string" },
        activePageId: { type: "string" },
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
