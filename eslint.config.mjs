/* eslint-disable import/order */
import { fixupPluginRules } from "@eslint/compat";
import tseslint from "typescript-eslint";
import tseslintParser from "@typescript-eslint/parser";
import eslint from "@eslint/js";
import stylisticJs from "@stylistic/eslint-plugin-js";

import pluginImport from "eslint-plugin-import";
import pluginSortExports from "eslint-plugin-sort-exports";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginUnusedImports from "eslint-plugin-unused-imports";
import pluginReact from "eslint-plugin-react";

const config = {
    files: [
        "**/*.{js,jsx,mjs,cjs,ts,tsx}"
    ],
    plugins: {
        "@stylistic/js": stylisticJs,
        "import": fixupPluginRules(pluginImport),
        "react": pluginReact,
        "react-hooks": fixupPluginRules(pluginReactHooks),
        "sort-exports": pluginSortExports,
        "unused-imports": pluginUnusedImports
    },
    languageOptions: {
        parser: tseslintParser,
        parserOptions: {
            ecmaFeatures: {
                jsx: true
            },
            // projectService: {
            //     allowDefaultProject: ["*.js"]
            // },
            tsconfigRootDir: import.meta.dirname
        }
    },
    settings: {
        "import/parsers": {
            "@typescript-eslint/parser": [
                ".ts",
                ".tsx"
            ]
        },
        "import/resolver": {
            typescript: {
                alwaysTryTypes: true
            },
            node: {
                extensions: [
                    ".js",
                    ".jsx",
                    ".ts",
                    ".tsx"
                ],
                moduleDirectory: [
                    "node_modules"
                ]
            }
        },
        react: {
            version: "detect"
        }
    },
    rules: {
        // @stylistic/eslint-plugin-js
        "@stylistic/js/semi": "error",

        // @typescript-eslint
        "@typescript-eslint/explicit-function-return-type": "error",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-inferrable-types": "error",
        "@typescript-eslint/no-non-null-assertion": "error",
        "@typescript-eslint/no-unsafe-assignment": "off",
        "@typescript-eslint/no-unsafe-call": "off",
        "@typescript-eslint/no-unsafe-member-access": "off",
        "@typescript-eslint/no-unsafe-return": "off",
        "@typescript-eslint/no-unused-vars": "off",
        "@typescript-eslint/typedef": ["error", {
            arrayDestructuring: false,
            arrowParameter: false,
            memberVariableDeclaration: true,
            objectDestructuring: false,
            parameter: true,
            propertyDeclaration: true,
            variableDeclaration: false,
            variableDeclarationIgnoreFunction: false
        }],

        // eslint-plugin-import
        "import/no-anonymous-default-export": "off",
        "import/no-named-as-default-member": "off",
        "import/no-unresolved": "error",
        "import/order": ["error", {
            alphabetize: {
                order: "asc",
                caseInsensitive: true
            }
        }],
        "import/prefer-default-export": "error",

        // eslint-plugin-react
        "react/destructuring-assignment": "off",
        "react/display-name": "off",
        "react/jsx-closing-bracket-location": ["error", "tag-aligned"],
        "react/jsx-curly-spacing": "error",
        "react/jsx-equals-spacing": ["error", "never"],
        "react/jsx-first-prop-new-line": ["error", "always"],
        "react/jsx-indent": ["error", "tab"],
        "react/jsx-indent-props": ["error", "tab"],
        "react/jsx-key": "off",
        "react/jsx-max-props-per-line": "error",
        "react/jsx-props-no-spreading": "off",
        "react/jsx-tag-spacing": "error",
        "react/jsx-uses-react": "error",
        "react/jsx-uses-vars": "error",
        "react/react-in-jsx-scope": "off",
        "react/require-default-props": "off",
        "react/jsx-wrap-multilines": ["error", {
            declaration: "parens",
            assignment: "parens",
            return: "parens",
            arrow: "ignore",
            condition: "ignore",
            logical: "ignore",
            prop: "ignore"
        }],

        // eslint
        "comma-dangle": ["error", "never"],
        "max-len": "off",
        "max-nested-callbacks": ["error", 5],
        "no-constant-binary-expression": "off",
        "no-case-declarations": "off",
        "no-console": "warn",
        "no-restricted-imports": "error",
        "no-restricted-syntax": ["error", "FunctionExpression", "WithStatement"],
        "object-curly-newline": ["error", {
            ExportDeclaration: "always",
            ImportDeclaration: "never"
        }],
        "prefer-destructuring": "error",
        "quotes": ["error", "double", {
            avoidEscape: true,
            allowTemplateLiterals: true
        }],
        "require-await": "error",
        "semi": "error",

        // eslint-plugin-sort-exports
        "sort-exports/sort-exports": ["error", {
            sortDir: "asc"
        }],

        // eslint-plugin-unused-imports
        "unused-imports/no-unused-imports": "error"
    }
};

export default tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    config
);
