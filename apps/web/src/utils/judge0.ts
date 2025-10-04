import { StatusId } from "../config/consts/judge0"
import type { Status } from "../types/judge0"

export const isRuntimeError = (status: Status) => {
    if (!status.id) return false
    return (
        status.id >= StatusId.RUNTIME_ERROR_SIGSEGV &&
        status.id <= StatusId.RUNTIME_ERROR_OTHER
    )
}

export const isCompilationError = (status: Status) => {
    return status.id === StatusId.COMPILATION_ERROR
}

export const isError = (status: Status) => {
    if (!status.id) return false
    return (
        status.id >= StatusId.WRONG_ANSWER &&
        status.id <= StatusId.EXEC_FORMAT_ERROR
    )
}

export const isProcessing = (status: Status) => {
    return status.id === StatusId.IN_QUEUE || status.id === StatusId.PROCESSING
}

export const isSuccess = (status: Status) => {
    return status.id === StatusId.ACCEPTED
}
