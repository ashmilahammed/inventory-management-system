import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([

    {
        ignores: [
            "dist",
            "node_modules"
        ]
    },

    {
        files: ["src/**/*.{ts,js}"],

        languageOptions: {

            parser: tseslint.parser,

            parserOptions: {
                project: "./tsconfig.json",
                tsconfigRootDir: import.meta.dirname
            },

            globals: {
                ...globals.node
            }
        },

        plugins: {
            "@typescript-eslint": tseslint.plugin
        },

        extends: [
            js.configs.recommended,
            ...tseslint.configs.recommended
        ],

        rules: {


            "no-unused-vars": "off",

            "@typescript-eslint/no-unused-vars": [
                "warn",
                {
                    argsIgnorePattern: "^_"
                }
            ],


            "@typescript-eslint/no-explicit-any": "warn",
            "@typescript-eslint/no-floating-promises": "error",

            "no-console": "off",

            /* CODE STYLE */
            "prefer-const": "warn",
            "no-var": "error"
        }
    }
]);