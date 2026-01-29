import fs from "fs";
import path from "path";

export function patchReactArborist() {
    try {
        console.log("Patching react-arborist");
        const rootDir = "node_modules/react-arborist";
        const replaceBefore = "e.metaKey";
        const replaceAfter = "(e.metaKey || e.ctrlKey)";

        // Function to recursively find and patch files
        function findAndPatchFiles(directory) {
            const files = fs.readdirSync(directory);

            for (const file of files) {
                const filePath = path.join(directory, file);
                const stats = fs.statSync(filePath);

                if (stats.isDirectory()) {
                    // Recursively search subdirectories
                    findAndPatchFiles(filePath);
                } else if (
                    stats.isFile() &&
                    (file.endsWith(".ts") ||
                        file.endsWith(".tsx") ||
                        file.endsWith(".js") ||
                        file.endsWith(".jsx"))
                ) {
                    // Process TypeScript and JavaScript files
                    const content = fs.readFileSync(filePath, "utf8");

                    if (content.includes(replaceBefore)) {
                        const newContent = content.replace(
                            new RegExp(replaceBefore, "g"),
                            replaceAfter,
                        );
                        fs.writeFileSync(filePath, newContent);
                        console.log(`Patched ${filePath}`);
                    }
                }
            }
        }

        findAndPatchFiles(rootDir);
        console.log("Patched react-arborist");
    } catch (error) {
        console.error("Error patching react-arborist", error);
    }
}

patchReactArborist();
