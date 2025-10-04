// src/lib/ky.ts
import ky from "ky"

export const api = ky.create({
    prefixUrl: "/api",
    timeout: 5000,
})
