import type { CodeLanguageKey } from "./catalog.ts"

export const JUDGE0_MAP = {
    javascript: { id: 63, name: "JavaScript (Node.js 12.14.0)" },
    typescript: { id: 74, name: "TypeScript (3.7.4)" },
    python: { id: 71, name: "Python (3.8.1)" },
    java: { id: 62, name: "Java (OpenJDK 13.0.1)" },
    cpp: { id: 54, name: "C++ (GCC 9.2.0)" },
    c: { id: 50, name: "C (GCC 9.2.0)" },
    rust: { id: 73, name: "Rust (1.40.0)" },
    go: { id: 60, name: "Go (1.13.5)" },
    php: { id: 68, name: "PHP (7.4.1)" },
    sql: { id: 82, name: "SQL (SQLite 3.27.2)" },
} as const satisfies Record<CodeLanguageKey, { id: number; name: string }>

export type Judge0Runtime = (typeof JUDGE0_MAP)[CodeLanguageKey]
export type Judge0Id = Judge0Runtime["id"]

export function getJudge0Id(key: CodeLanguageKey): Judge0Id {
    return JUDGE0_MAP[key].id
}

export function getJudge0Runtime(key: CodeLanguageKey): Judge0Runtime {
    return JUDGE0_MAP[key]
}
