import { z } from "zod";

const datasetSchema = z.object({
    id: z.string(),
    variable: z.string().min(1, "Выберите переменную"),
    alias: z
        .string()
        .trim()
        .max(25, "Максимум 25 символов")
        .optional()
        .default(""),
    color: z.string().min(1, "Выберите цвет"),
});

export const graphFormSchema = z
    .object({
        mode: z.enum(["period", "realTime"]),
        range: z.array(z.any()).max(2).default([]),
        pointLimit: z.coerce.number().min(1),
        datasets: z
            .array(datasetSchema)
            .min(1, "Добавьте хотя бы один датасет"),
    })
    .superRefine((values, ctx) => {
        if (values.mode === "period") {
            const from = values.range?.[0];
            const to = values.range?.[1];

            if (!from || !to) {
                ctx.addIssue({
                    code: "custom",
                    path: ["range"],
                    message: "Укажите период",
                });
                return;
            }

            if (typeof from?.compare === "function" && from.compare(to) > 0) {
                ctx.addIssue({
                    code: "custom",
                    path: ["range"],
                    message: "Дата начала больше даты окончания",
                });
            }
        }
    });
