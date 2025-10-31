"use client";

import {
    ChakraProvider,
    createSystem,
    defaultConfig,
    defineConfig,
} from "@chakra-ui/react";
import { ColorModeProvider } from "./color-mode";

const config = defineConfig({
    globalCss: {
        html: {
            colorPalette: "orange",
        },
    },
});

const system = createSystem(defaultConfig, config);

export function Provider(props) {
    return (
        <ChakraProvider value={system}>
            <ColorModeProvider {...props} />
        </ChakraProvider>
    );
}
