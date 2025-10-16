import { StudioHeader } from "@/components/studio/StudioHeader"
import { StudioCarousel } from "@/components/studio/StudioCarousel"
import { IdePanel } from "@/components/studio/IdePanel"
import { AiChat } from "@/components/AiChat"

export const StudioPage = () => {
    const panels = [
        {
            id: "ide",
            content: <IdePanel />,
        },
        {
            id: "chat",
            content: <AiChat />,
        },
        // Future:
        // {
        //     id: "survey",
        //     content: <SurveyPanel />
        // }
    ]

    return (
        <div className="min-h-screen grid grid-rows-[auto_1fr] bg-background">
            {/* <StudioHeader /> */}

            <main className="container mx-auto px-4 py-4 md:py-6">
                <StudioCarousel panels={panels} />
            </main>
        </div>
    )
}
