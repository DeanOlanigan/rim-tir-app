"use client";

import {
    ChakraProvider,
    createSystem,
    defaultConfig,
    defineAnimationStyles,
    defineConfig,
    defineKeyframes,
} from "@chakra-ui/react";
import { ColorModeProvider } from "./color-mode";

const emergencyKeyframes = defineKeyframes({
    "0%, 100%": {
        backgroundColor: "var(--chakra-colors-red-600)",
        color: "white",
        boxShadow: "0 0 10px 5px var(--chakra-colors-red-500)",
        outline: "2px solid var(--chakra-colors-red-400)",
    },
    "50%": {
        backgroundColor: "var(--chakra-colors-red-100)",
        color: "var(--chakra-colors-red-900)",
        boxShadow: "0 0 0px 0px transparent",
        outline: "2px solid transparent",
    },
});

const animationStyles = defineAnimationStyles({
    emergencyBlink: {
        value: {
            animationName: "emergencyBlink",
            animationDuration: "0.6s",
            animationIterationCount: "infinite",
            animationTimingFunction: "linear",
        },
    },
});

const config = defineConfig({
    theme: {
        animationStyles: animationStyles,
        keyframes: {
            emergencyBlink: emergencyKeyframes,
        },
        semanticTokens: {
            colors: {
                bg: {
                    DEFAULT: {
                        value: {
                            _light: "{colors.gray.100}",
                            _dark: "#000000",
                        },
                    },
                },
            },
        },
    },
    globalCss: {
        html: {
            colorPalette: "purple",
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
