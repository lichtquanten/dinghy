#!/usr/bin/env node
/**
 * env-manager.ts
 *
 * Manage .env files: merge, encrypt, decrypt, generate examples
 */

import {
    readFileSync,
    writeFileSync,
    readdirSync,
    existsSync,
    statSync,
} from "fs"
import path from "path"
import { program } from "commander"
import { execSync } from "child_process"
import dotenvx from "@dotenvx/dotenvx"

program
    .name("env-manager")
    .description("Manage .env files")
    .version("1.0.0")
    .option("--env-dir <path>", "Environment directory", ".env")
    .option("--source-dir <path>", "Source files directory", ".env/source")
    .option("--base-file <n>", "Base file name in source-dir", "base")
    .option("--keys-file <path>", "Path to .env.keys file", ".env/.env.keys")

function getConfig() {
    const opts = program.opts()
    const envDir = opts.envDir
    const sourceDir = opts.sourceDir
    const baseFile = opts.baseFile
    const keysFile = opts.keysFile
    return { envDir, sourceDir, baseFile, keysFile }
}

function isEnvFile(filename: string, dir: string): boolean {
    const fullPath = path.join(dir, filename)
    return (
        statSync(fullPath).isFile() &&
        !filename.endsWith(".encrypted") &&
        !filename.endsWith(".example") &&
        !filename.startsWith(".")
    )
}

function isSourceFile(
    filename: string,
    baseFile: string,
    dir: string
): boolean {
    const fullPath = path.join(dir, filename)
    return (
        statSync(fullPath).isFile() &&
        filename !== baseFile &&
        !filename.endsWith(".example") &&
        !filename.startsWith(".")
    )
}

program
    .command("merge")
    .description(
        "Merge .env/source/base + .env/source/<target> → .env/<target>"
    )
    .argument("[target]", "Target environment (omit to merge all)")
    .action((target?: string) => {
        if (target) {
            mergeOne(target)
        } else {
            mergeAll()
        }
    })

program
    .command("encrypt")
    .description("Encrypt all merged .env files (creates .encrypted versions)")
    .action(() => {
        const { envDir, keysFile } = getConfig()
        const files = readdirSync(envDir).filter((f) => isEnvFile(f, envDir))

        if (files.length === 0) {
            console.log("No files to encrypt")
            return
        }

        console.log(`Encrypting ${files.length} file(s)...\n`)
        console.log(`Using keys file: ${keysFile}\n`)

        let successCount = 0
        let failCount = 0

        for (const file of files) {
            const filePath = path.join(envDir, file)
            const encryptedPath = `${filePath}.encrypted`

            try {
                // Use --stdout to get encrypted content, then write to .encrypted file
                const encrypted = execSync(
                    `dotenvx encrypt --stdout -fk ${keysFile} -f ${filePath}`,
                    {
                        cwd: process.cwd(),
                        encoding: "utf8",
                    }
                )
                writeFileSync(encryptedPath, encrypted, {
                    encoding: "utf8",
                    mode: 0o600,
                })
                console.log(`✓ ${file} → ${file}.encrypted`)
                successCount++
            } catch (error) {
                console.error(`✗ Failed to encrypt ${file}`)
                failCount++
            }
        }

        console.log(`\n${successCount} file(s) encrypted, ${failCount} failed`)
        if (failCount > 0) {
            process.exit(1)
        }
    })

program
    .command("decrypt")
    .description("Decrypt all .encrypted files")
    .action(() => {
        const { envDir, keysFile } = getConfig()
        const files = readdirSync(envDir).filter((f) => {
            const fullPath = path.join(envDir, f)
            return statSync(fullPath).isFile() && f.endsWith(".encrypted")
        })

        if (files.length === 0) {
            console.log("No encrypted files found")
            return
        }

        console.log(`Decrypting ${files.length} file(s)...\n`)
        console.log(`Using keys file: ${keysFile}\n`)

        let successCount = 0
        let failCount = 0

        for (const file of files) {
            const filePath = path.join(envDir, file)
            const outputPath = filePath.replace(/\.encrypted$/, "")

            try {
                execSync(
                    `dotenvx decrypt -fk ${keysFile} -f ${filePath} -o ${outputPath}`,
                    {
                        stdio: "inherit",
                        cwd: process.cwd(),
                    }
                )
                console.log(`✓ ${file} → ${path.basename(outputPath)}`)
                successCount++
            } catch (error) {
                console.error(`✗ Failed to decrypt ${file}`)
                failCount++
            }
        }

        console.log(`\n${successCount} file(s) decrypted, ${failCount} failed`)
        if (failCount > 0) {
            process.exit(1)
        }
    })

program
    .command("examples")
    .description("Generate .example files from actual files")
    .action(() => {
        const { envDir, sourceDir } = getConfig()

        console.log("Generating examples for source files...\n")

        const sourceFiles = readdirSync(sourceDir).filter((f) => {
            const fullPath = path.join(sourceDir, f)
            return (
                statSync(fullPath).isFile() &&
                !f.endsWith(".example") &&
                !f.startsWith(".")
            )
        })

        let successCount = 0
        let failCount = 0

        for (const file of sourceFiles) {
            const filePath = path.join(sourceDir, file)
            const examplePath = `${filePath}.example`
            try {
                execSync(`dotenvx ext genexample -f ${filePath}`, {
                    stdio: "inherit",
                    cwd: process.cwd(),
                })
                // dotenvx creates .env.example in current directory, move it
                const cwdExample = path.join(process.cwd(), ".env.example")
                if (existsSync(cwdExample)) {
                    writeFileSync(examplePath, readFileSync(cwdExample, "utf8"))
                    execSync(`rm ${cwdExample}`, { cwd: process.cwd() })
                }
                console.log(`✓ source/${file}.example`)
                successCount++
            } catch (error) {
                console.error(`✗ Failed: source/${file}`)
                failCount++
            }
        }

        console.log("\nGenerating examples for merged files...\n")

        const mergedFiles = readdirSync(envDir).filter((f) =>
            isEnvFile(f, envDir)
        )

        for (const file of mergedFiles) {
            const filePath = path.join(envDir, file)
            const examplePath = `${filePath}.example`
            try {
                execSync(`dotenvx ext genexample -f ${filePath}`, {
                    stdio: "inherit",
                    cwd: process.cwd(),
                })
                // dotenvx creates .env.example in current directory, move it
                const cwdExample = path.join(process.cwd(), ".env.example")
                if (existsSync(cwdExample)) {
                    writeFileSync(examplePath, readFileSync(cwdExample, "utf8"))
                    execSync(`rm ${cwdExample}`, { cwd: process.cwd() })
                }
                console.log(`✓ ${file}.example`)
                successCount++
            } catch (error) {
                console.error(`✗ Failed: ${file}`)
                failCount++
            }
        }

        console.log(
            `\n${successCount} example(s) generated, ${failCount} failed`
        )
        if (failCount > 0) {
            process.exit(1)
        }
    })

program.parse()

function mergeOne(target: string) {
    const { envDir, sourceDir, baseFile } = getConfig()
    const baseFilePath = path.join(sourceDir, baseFile)
    const targetFile = path.join(sourceDir, target)

    if (!existsSync(baseFilePath)) {
        console.error(`Error: ${baseFilePath} not found`)
        process.exit(1)
    }

    if (!existsSync(targetFile)) {
        console.error(`Error: ${targetFile} not found`)
        process.exit(1)
    }

    const baseContent = readFileSync(baseFilePath, "utf8")
    const targetContent = readFileSync(targetFile, "utf8")

    // Parse to get the key-value pairs
    const baseParsed = dotenvx.parse(baseContent)
    const targetParsed = dotenvx.parse(targetContent)

    // Merge the parsed values
    const merged = { ...baseParsed, ...targetParsed }

    const outputFile = path.join(envDir, target)

    // Read the original lines to preserve formatting
    const baseLines = baseContent.split("\n")
    const targetLines = targetContent.split("\n")

    // Create a map of variables from target file (preserving original format)
    const targetVars = new Map<string, string>()
    for (const line of targetLines) {
        const trimmed = line.trim()
        if (trimmed && !trimmed.startsWith("#")) {
            const match = trimmed.match(/^([^=]+)=(.*)$/)
            if (match) {
                targetVars.set(match[1].trim(), line)
            }
        }
    }

    // Start with base lines
    const outputLines: string[] = []
    const usedKeys = new Set<string>()

    for (const line of baseLines) {
        const trimmed = line.trim()
        if (!trimmed || trimmed.startsWith("#")) {
            outputLines.push(line)
            continue
        }

        const match = trimmed.match(/^([^=]+)=/)
        if (match) {
            const key = match[1].trim()
            usedKeys.add(key)

            // If target has this key, use target's version
            if (targetVars.has(key)) {
                outputLines.push(targetVars.get(key)!)
            } else {
                outputLines.push(line)
            }
        } else {
            outputLines.push(line)
        }
    }

    // Add any target vars that weren't in base
    for (const line of targetLines) {
        const trimmed = line.trim()
        if (trimmed && !trimmed.startsWith("#")) {
            const match = trimmed.match(/^([^=]+)=/)
            if (match) {
                const key = match[1].trim()
                if (!usedKeys.has(key)) {
                    outputLines.push(line)
                }
            }
        }
    }

    writeFileSync(outputFile, outputLines.join("\n"), {
        encoding: "utf8",
        mode: 0o600,
    })
    console.log(`✓ Merged → ${outputFile}`)
}

function mergeAll() {
    const { sourceDir, baseFile } = getConfig()

    if (!existsSync(sourceDir)) {
        console.error(`Error: ${sourceDir} not found`)
        process.exit(1)
    }

    const sourceFiles = readdirSync(sourceDir).filter((f) =>
        isSourceFile(f, baseFile, sourceDir)
    )

    if (sourceFiles.length === 0) {
        console.log("No environment files found in .env/source/")
        return
    }

    console.log(
        `Found ${sourceFiles.length} environment(s): ${sourceFiles.join(", ")}\n`
    )

    for (const target of sourceFiles) {
        try {
            mergeOne(target)
        } catch (error) {
            console.error(`Failed to merge ${target}`)
        }
    }

    console.log("\n✓ All environments merged!")
}
