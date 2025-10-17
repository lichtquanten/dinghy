export const CODE_LANGUAGES = [
    { key: "javascript", label: "JavaScript", version: "ES2023" },
    { key: "typescript", label: "TypeScript", version: "5.x" },
    { key: "python", label: "Python", version: "3.x" },
    { key: "java", label: "Java", version: "17" },
    { key: "cpp", label: "C++", version: "17" },
    { key: "c", label: "C", version: "17" },
    { key: "rust", label: "Rust", version: "1.40" },
    { key: "go", label: "Go", version: "1.13" },
    { key: "php", label: "PHP", version: "7.4" },
    { key: "sql", label: "SQL", version: "SQLite 3.27" },
] as const

export type CodeLanguage = (typeof CODE_LANGUAGES)[number]
export type CodeLanguageKey = CodeLanguage["key"]
