import z from "zod"
import type { CodeLanguage } from "@workspace/db/client"
import { env } from "@/config/env.js"

const LANGUAGE_IDS: Record<CodeLanguage, number> = {
    javascript: 63,
    typescript: 74,
    python: 71,
    java: 62,
    cpp: 54,
    c: 50,
    rust: 73,
    go: 60,
    php: 68,
    sql: 82,
}

const Status = {
    Accepted: 3,
    TimeLimitExceeded: 5,
    CompilationError: 6,
    RuntimeErrorSIGSEGV: 7,
    RuntimeErrorSIGXFSZ: 8,
    RuntimeErrorSIGFPE: 9,
    RuntimeErrorSIGABRT: 10,
    RuntimeErrorNZEC: 11,
    RuntimeErrorOther: 12,
    InternalError: 13,
    ExecFormatError: 14,
} as const

export interface Judge0Response {
    stdout: string | null
    stderr: string | null
    compile_output: string | null
    message: string | null
    status: { id: number; description: string }
    time: string | null
    memory: number | null
}

export interface SubmitOptions {
    code: string
    language: CodeLanguage
    stdin?: string
    callbackUrl: string
}

const SubmitResponseSchema = z.object({
    token: z.string(),
})

export async function submit(options: SubmitOptions): Promise<string> {
    const url = new URL("submissions", env.JUDGE0_URL)
    url.searchParams.set("base64_encoded", "true")
    const res = await fetch(url, {
        method: "POST",
        headers: {
            [env.JUDGE0_AUTHENTICATION_HEADER]: env.JUDGE0_AUTHENTICATION_TOKEN,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            source_code: Buffer.from(options.code).toString("base64"),
            language_id: LANGUAGE_IDS[options.language],
            stdin: Buffer.from(options.stdin ?? "").toString("base64"),
            callback_url: options.callbackUrl,
            cpu_time_limit: 5,
            wall_time_limit: 10,
        }),
    })
    if (!res.ok) {
        throw new Error(`Judge0 error: ${res.status}`)
    }
    const data = SubmitResponseSchema.parse(await res.json())
    return data.token
}

export type ExecutionStatus =
    | "success"
    | "timeout"
    | "compilation_error"
    | "runtime_error"
    | "internal_error"

export interface ExecutionResult {
    status: ExecutionStatus
    stdout: string
    stderr: string
    compileOutput: string
    message: string
    timeMs: number
    memoryKb: number
}

function decodeField(value: string | null): string {
    if (!value) return ""
    return Buffer.from(value, "base64").toString("utf8")
}

export function parseResponse(raw: Judge0Response): ExecutionResult {
    const statusId = raw.status.id

    let status: ExecutionStatus
    if (statusId === Status.Accepted) {
        status = "success"
    } else if (statusId === Status.CompilationError) {
        status = "compilation_error"
    } else if (statusId === Status.TimeLimitExceeded) {
        status = "timeout"
    } else if (
        statusId >= Status.RuntimeErrorSIGSEGV &&
        statusId <= Status.RuntimeErrorOther
    ) {
        status = "runtime_error"
    } else {
        status = "internal_error"
    }

    return {
        status,
        stdout: decodeField(raw.stdout),
        stderr: decodeField(raw.stderr),
        compileOutput: decodeField(raw.compile_output),
        message: decodeField(raw.message),
        timeMs: parseFloat(raw.time ?? "0") * 1000,
        memoryKb: raw.memory ?? 0,
    }
}
