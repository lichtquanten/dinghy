// pages/IdePage.tsx
import { useState } from "react"
import { Button } from "@workspace/ui/components/button"
import { Play, Code2 } from "lucide-react"
import { useCodeExecution } from "../hooks/useCodeExecution"
import { DEFAULT_CODE, DEFAULT_LANGUAGE_ID } from "../config/consts"
import { LanguageSelector } from "../components/LanguageSelector"
import { CodeEditor } from "../components/CodeEditor"
import { StdinInput } from "../components/StdinInput"
import { CodeOutput } from "../components/CodeOutput"
import { ConnectionStatus } from "../components/ConnectionStatus"
import { AiChat } from "../components/AiChat"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@workspace/ui/components/carousel"
export const IdePage = () => {
    // State management for the IDE
    const [code, setCode] = useState(DEFAULT_CODE) // The actual code being edited
    const [languageId, setLanguageId] = useState(DEFAULT_LANGUAGE_ID) // Selected programming language
    const [stdin, setStdin] = useState("") // Standard input for code execution

    // Custom hook to handle code execution with timeout callback
    const { executeCode, result, isLoading, error, isConnected } =
        useCodeExecution({
            onTimeout: (submissionId) => {
                console.error("Execution timeout for submission:", submissionId)
            },
        })

    // Handler to trigger code execution
    const handleRunCode = () => {
        executeCode(code, languageId, stdin)
    }

    return (
        /**
         * ROOT CONTAINER: Full-page layout structure
         * - min-h-screen: Minimum height of 100vh (full viewport height)
         * - grid: Uses CSS Grid layout
         * - grid-rows-[auto_1fr]: Two rows - header takes natural height, content takes remaining space
         * - bg-background: Background color from your theme (likely a CSS variable)
         */
        <div className="min-h-screen grid grid-rows-[auto_1fr] bg-background">
            {/* ========================================
                HEADER SECTION
                ======================================== */}
            {/**
             * HEADER: Top navigation bar
             * - border-b: Bottom border to separate from content
             */}
            <header className="border-b">
                {/**
                 * HEADER CONTENT WRAPPER: Centers and adds padding
                 * - container: Centers content with max-width (typically 1280px)
                 * - mx-auto: Margin left/right auto (centers the container)
                 * - px-4: Padding left/right of 1rem (16px)
                 * - py-3: Padding top/bottom of 0.75rem (12px)
                 * - md:py-4: On medium screens and up, padding top/bottom becomes 1rem (16px)
                 */}
                <div className="container mx-auto px-4 py-3 md:py-4">
                    {/**
                     * HEADER FLEX CONTAINER: Arranges logo, title, and status
                     * - flex: Flexbox layout
                     * - items-center: Vertically centers items
                     * - justify-between: Pushes items to opposite ends (space-between)
                     * - gap-2: 0.5rem (8px) gap between flex items
                     */}
                    <div className="flex items-center justify-between gap-2">
                        {/**
                         * LEFT GROUP: Logo and title
                         * - flex: Flexbox layout
                         * - items-center: Vertically centers icon and text
                         * - gap-2: 0.5rem (8px) gap
                         * - md:gap-3: On medium screens, gap becomes 0.75rem (12px)
                         */}
                        <div className="flex items-center gap-2 md:gap-3">
                            {/**
                             * LOGO ICON: Code icon from lucide-react
                             * - h-5 w-5: Height/width of 1.25rem (20px)
                             * - md:h-6 md:w-6: On medium screens, becomes 1.5rem (24px)
                             * - shrink-0: Prevents icon from shrinking if space is tight
                             */}
                            <Code2 className="h-5 w-5 md:h-6 md:w-6 shrink-0" />

                            {/**
                             * PAGE TITLE
                             * - text-xl: Font size 1.25rem (20px)
                             * - md:text-2xl: On medium screens, font size becomes 1.5rem (24px)
                             * - font-bold: Bold font weight (700)
                             * - truncate: Adds ellipsis (...) if text overflows
                             */}
                            <h1 className="text-xl md:text-2xl font-bold truncate">
                                Online IDE
                            </h1>
                        </div>

                        {/* Connection status indicator (right side of header) */}
                        <ConnectionStatus isConnected={isConnected} />
                    </div>
                </div>
            </header>

            {/* ========================================
                MAIN CONTENT AREA
                ======================================== */}
            {/**
             * MAIN CONTENT WRAPPER: Contains the IDE interface
             * - container: Centers with max-width
             * - mx-auto: Centers horizontally
             * - px-4: Horizontal padding of 1rem (16px)
             * - py-4: Vertical padding of 1rem (16px)
             * - md:py-6: On medium screens, vertical padding becomes 1.5rem (24px)
             * - overflow-hidden: Hides any content that overflows
             * overflow-hidden
             */}
            <main className="container mx-auto px-4 py-4 md:py-6">
                <Carousel className="w-full max-w-9/10">
                    <CarouselContent>
                        <CarouselItem key="1">
                            {/**
                             * IDE GRID LAYOUT: Complex responsive grid for editor and output
                             *
                             * Mobile (default):
                             * - Single column layout (stacked vertically)
                             * - Toolbar on top, then editor, then stdin/output
                             *
                             * Large screens (lg: breakpoint):
                             * - Two column layout (side-by-side)
                             * - Toolbar spans both columns
                             * - Editor on left, stdin/output on right
                             *
                             * Classes explained:
                             * - grid: CSS Grid layout
                             * - gap-4: 1rem (16px) gap between grid items
                             * - md:gap-6: On medium screens, gap becomes 1.5rem (24px)
                             * - grid-rows-[auto_1fr]: Two rows - toolbar auto-height, work area fills remaining
                             * - [grid-template-columns:minmax(0,1fr)]: Single column on mobile
                             *   - minmax(0, 1fr): Column can shrink to 0 but prefers 1 fraction
                             * - lg:[grid-template-columns:minmax(0,1fr)_minmax(0,1fr)]: Two equal columns on large screens
                             * - h-full: Height 100% (fills parent container)
                             */}
                            <div
                                className="
            grid gap-4 md:gap-6
            grid-rows-[auto_1fr]
            [grid-template-columns:minmax(0,1fr)]
            lg:[grid-template-columns:minmax(0,1fr)_minmax(0,1fr)]
            h-full
          "
                            >
                                {/* ========================================
                        TOOLBAR ROW
                        ======================================== */}
                                {/**
                                 * TOOLBAR: Language selector and Run button
                                 * - col-span-1: Spans 1 column on mobile
                                 * - lg:col-span-2: Spans both columns on large screens
                                 * - sticky top-0: Sticks to top when scrolling
                                 * - bg-background: Background color (prevents see-through)
                                 * - z-10: Stack order 10 (stays above other content)
                                 */}
                                <div className="col-span-1 lg:col-span-2 sticky top-0 bg-background z-10">
                                    {/**
                                     * TOOLBAR FLEX CONTAINER: Arranges controls
                                     * - flex: Flexbox layout
                                     * - flex-col: Stacks vertically on mobile
                                     * - sm:flex-row: Horizontal layout on small screens and up
                                     * - items-stretch: Stretches items on mobile
                                     * - sm:items-center: Centers items vertically on small screens+
                                     * - gap-3: 0.75rem (12px) gap between items
                                     * - sm:justify-between: Space between language selector and run button
                                     */}
                                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:justify-between">
                                        {/**
                                         * LANGUAGE SELECTOR WRAPPER
                                         * - w-full: Full width on mobile
                                         * - sm:w-auto: Auto width on small screens+ (shrinks to content)
                                         */}
                                        <div className="w-full sm:w-auto">
                                            <LanguageSelector
                                                value={languageId}
                                                onChange={setLanguageId}
                                            />
                                        </div>

                                        {/**
                                         * RUN BUTTON CONTAINER
                                         * - flex: Flexbox layout
                                         * - items-center: Centers button vertically
                                         * - gap-3: 0.75rem (12px) gap (room for future buttons)
                                         */}
                                        <div className="flex items-center gap-3">
                                            {/**
                                             * RUN CODE BUTTON
                                             * - gap-2: 0.5rem (8px) gap between icon and text inside button
                                             */}
                                            <Button
                                                onClick={handleRunCode}
                                                disabled={
                                                    isLoading || !isConnected
                                                }
                                                className="gap-2"
                                            >
                                                {isLoading ? (
                                                    <>Running...</>
                                                ) : (
                                                    <>
                                                        <Play className="h-4 w-4" />
                                                        Run Code
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                {/* ========================================
                        LEFT PANE: CODE EDITOR
                        ======================================== */}
                                {/**
                                 * EDITOR SECTION: Contains the code editor
                                 * - min-h-0: Minimum height of 0 (allows shrinking below content size)
                                 *   This is crucial for proper scrolling in flex/grid containers!
                                 * - flex flex-col: Vertical flexbox (prepares for future additions)
                                 */}
                                <section className="min-h-0 flex flex-col">
                                    {/**
                                     * EDITOR CONTAINER
                                     * - min-h-0: Allows container to shrink
                                     * - flex-1: Takes all available space (flex-grow: 1)
                                     * - overflow-auto: Shows scrollbars when content overflows
                                     * - rounded-md: Medium border radius (0.375rem / 6px)
                                     * - border: Adds border (typically 1px solid)
                                     */}
                                    <div className="min-h-0 flex-1 overflow-auto rounded-md border">
                                        <CodeEditor
                                            code={code}
                                            onCodeChange={setCode}
                                        />
                                    </div>
                                </section>

                                {/* ========================================
                        RIGHT PANE: INPUT & OUTPUT
                        ======================================== */}
                                {/**
                                 * INPUT/OUTPUT SECTION: Stdin input and code output
                                 * - min-h-0: Allows section to shrink
                                 * - flex flex-col: Vertical flexbox layout
                                 * - gap-3: 0.75rem (12px) gap between stdin and output
                                 * - md:gap-4: On medium screens, gap becomes 1rem (16px)
                                 */}
                                <section className="min-h-0 flex flex-col gap-3 md:gap-4">
                                    {/* Standard input component (auto-height) */}
                                    <StdinInput
                                        stdin={stdin}
                                        onStdinChange={setStdin}
                                    />

                                    {/**
                                     * OUTPUT CONTAINER: Shows code execution results
                                     * - min-h-0: Allows container to shrink
                                     * - flex-1: Takes remaining space after stdin
                                     * - overflow-auto: Scrollable when output is long
                                     * - rounded-md: Medium border radius
                                     * - border: Border styling
                                     * - aria-busy: Accessibility - indicates loading state
                                     * - role="status": Accessibility - announces status changes
                                     * - aria-live="polite": Accessibility - announces updates politely
                                     */}
                                    <div
                                        className="min-h-0 flex-1 overflow-auto rounded-md border"
                                        aria-busy={isLoading}
                                        role="status"
                                        aria-live="polite"
                                    >
                                        <CodeOutput
                                            result={result}
                                            isLoading={isLoading}
                                            error={error}
                                        />
                                    </div>
                                </section>
                            </div>
                        </CarouselItem>
                        <CarouselItem key="2">
                            <AiChat />
                        </CarouselItem>
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
            </main>
        </div>
    )
}
