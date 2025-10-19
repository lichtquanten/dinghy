import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@workspace/ui/components/carousel.tsx"

interface Panel {
    id: string
    content: React.ReactNode
}

interface StudioCarouselProps {
    panels: Panel[]
}

export const StudioCarousel = ({ panels }: StudioCarouselProps) => {
    return (
        <Carousel className="w-full max-w-9/10">
            <CarouselContent>
                {panels.map((panel) => (
                    <CarouselItem key={panel.id}>{panel.content}</CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    )
}
