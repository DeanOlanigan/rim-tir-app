import { z } from "zod";

export const retentionItemNames = [
    "journal.events",
    "journal.telemetry",
    "logs",
];

export const retentionNameSchema = z.enum(retentionItemNames, {
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

        sessionTtlMinutes: z.coerce
            .number()
            .int({ error: "Время сессии должно быть целым числом" })
            .min(1, { error: "Время сессии должно быть не меньше 1 минуты" })
            .max(24 * 60, {
                error: "Время сессии не должно превышать 24 часа",
            }),

        https: z.boolean(),

        // тут лучше хранить путь / id / имя уже загруженного сертификата
        certificate: z.string().trim().nullable().optional(),
    })
    .superRefine((data, ctx) => {
        if (data.https && !data.certificate) {
            ctx.addIssue({
                code: "custom",
                path: ["certificate"],
                message: "Для HTTPS требуется сертификат",
            });
        }
    });

export const settingsSchema = z.object({
    webServer: webServerSchema,
    retention: z
        .array(retentionItemSchema)
        .min(1, { error: "Должна быть хотя бы одна политика хранения" }),
});
