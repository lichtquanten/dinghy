import type { LanguageSupport } from "@codemirror/language"
import type { CodeLanguageKey } from "./catalog.ts"

export const CODEMIRROR_LOADERS: Record<
    CodeLanguageKey,
    () => Promise<LanguageSupport>
> = {
    javascript: () =>
        import("@codemirror/lang-javascript").then((m) => m.javascript()),

    typescript: () =>
        import("@codemirror/lang-javascript").then((m) =>
            m.javascript({ typescript: true })
        ),

    python: () => import("@codemirror/lang-python").then((m) => m.python()),

    java: () => import("@codemirror/lang-java").then((m) => m.java()),

    cpp: () => import("@codemirror/lang-cpp").then((m) => m.cpp()),

    c: () => import("@codemirror/lang-cpp").then((m) => m.cpp()),

    rust: () => import("@codemirror/lang-rust").then((m) => m.rust()),

    go: () => import("@codemirror/lang-go").then((m) => m.go()),

    php: () => import("@codemirror/lang-php").then((m) => m.php()),

    sql: () => import("@codemirror/lang-sql").then((m) => m.sql()),
}

export function getCodemirrorLoader(
    key: CodeLanguageKey
): () => Promise<LanguageSupport> {
    return CODEMIRROR_LOADERS[key]
}
