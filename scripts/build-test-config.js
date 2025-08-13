import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const schemaPath = path.join(__dirname, "../config/instance.json");
const outputPath = path.join(
    __dirname,
    "../src/config/generated/generatedConfig.js"
);

function main() {
    const raw = fs.readFileSync(schemaPath, "utf-8");
    const schema = JSON.parse(raw);

    const out = `
/**
 * Сгенерировано build-test-config.js
 * НЕ редактируй вручную!
 */
export const config = ${JSON.stringify(schema, null, 4)};
`.trim();

    fs.writeFileSync(outputPath, out, "utf-8");
    console.log(`Конфигурация сгенерирована, путь: ${outputPath}`);
}

main();
