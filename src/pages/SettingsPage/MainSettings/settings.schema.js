import { z } from "zod";

export const RETENTION_KEYS = ["journalEvents", "journalTelemetry", "logs"];

export const RETENTION_META = {
    journalEvents: {
        label: "Журнал событий",
        right: "settings.journal.edit",
    },
    journalTelemetry: {
        label: "Журнал телеметрии",
        right: "settings.journal.edit",
    },
    logs: {
        label: "Лог-файлы",
        right: "settings.logs.edit",
    },
};

const retentionPolicySchema = z.object({
    size: z.coerce
        .number()
        .min(0.5, { error: "Размер не должен быть меньше 0.5 MB" }),
    files: z.coerce
        .number()
        .int({ error: "Количество файлов должно быть целым" })
        .min(1, { error: "Количество файлов должно быть не меньше 1" }),
    archive: z.boolean(),
});

const fileSchema = z.custom((value) => {
    if (value == null) return true;
    return typeof File !== "undefined" && value instanceof File;
}, "Некорректный файл сертификата");

export const retentionNameSchema = z.enum(RETENTION_KEYS, {
    error: "Неизвестный тип политики хранения",
});

export const retentionItemSchema = z.object({
    name: retentionNameSchema,
    size: z.coerce
        .number()
        .min(0.5, { error: "Размер не должен быть меньше 0.5 MB" }),
    files: z.coerce
        .number()
        .int({ error: "Количество файлов должно быть целым" })
        .min(1, { error: "Количество файлов должно быть не меньше 1" }),
    archive: z.boolean(),
});

export const webServerSchema = z
    .object({
        port: z.coerce
            .number()
            .int({ error: "Порт должен быть целым числом" })
            .min(1024, { error: "Порт должен быть не меньше 1024" })
            .max(65535, { error: "Порт должен быть не больше 65535" }),

        sessionTtlHours: z.coerce
            .number()
            .int({ error: "Время сессии должно быть целым числом" })
            .min(1, { error: "Время сессии должно быть не меньше 1 часа" })
            .max(24, {
                error: "Время сессии не должно превышать 24 часа",
            }),

        https: z.boolean(),

        certificateId: z.string().trim().nullable(),

        certificateFile: fileSchema.nullable().optional(),
    })
    .superRefine((data, ctx) => {
        const hasCertificate = !!data.certificateId || !!data.certificateFile;

        if (data.https && !hasCertificate) {
            ctx.addIssue({
                code: "custom",
                path: ["certificateFile"],
                message: "Для HTTPS требуется сертификат",
            });
        }
    });

export const settingsSchema = z.object({
    webServer: webServerSchema,
    retention: z.object({
        journalEvents: retentionPolicySchema,
        journalTelemetry: retentionPolicySchema,
        logs: retentionPolicySchema,
    }),
});

export function createDefaultSettings() {
    return {
        webServer: {
            port: 8080,
            sessionTtlHours: 8,
            https: false,
            certificateId: null,
            certificateFile: null,
        },
        retention: {
            journalEvents: {
                size: 0.5,
                files: 1,
                archive: true,
            },
            journalTelemetry: {
                size: 0.5,
                files: 1,
                archive: true,
            },
            logs: {
                size: 0.5,
                files: 1,
                archive: false,
            },
        },
    };
}
