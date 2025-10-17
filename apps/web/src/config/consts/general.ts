import type { CodeLanguageKey } from "@workspace/code-languages"

export const DEFAULT_CODE_LANGUAGE: CodeLanguageKey = "python"

export const DEFAULT_CODE = `#include <stdio.h>

int main(void) {
    printf("Hello, World!\\n");
    return 0;
}`
