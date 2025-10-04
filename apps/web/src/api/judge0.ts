import ky from "ky"
import type { SubmissionRequest, SubmissionAck } from "../types/judge0"
import { SubmissionAckSchema } from "../types/judge0"
import { Base64 } from "js-base64"

const judge0Client = ky.create({
    prefixUrl: "/api/judge0",
})

export async function submitCode(
    code: string,
    languageId: number,
    stdin?: string
): Promise<SubmissionAck> {
    const encodedSource = Base64.encode(code)
    const encodedStdin = stdin ? Base64.encode(stdin) : undefined

    const response = await judge0Client
        .post("submissions?base64_encoded=true", {
            json: {
                source_code: encodedSource,
                language_id: languageId,
                stdin: encodedStdin,
            } as SubmissionRequest,
        })
        .json()
    return SubmissionAckSchema.parse(response)
}
