import { Children, type ReactNode } from "react"
import {
    Carousel as BaseCarousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@workspace/ui/components/carousel.tsx"
import { cn } from "@workspace/ui/lib/utils.ts"

interface Props {
    children: ReactNode
    className?: string
}

export default function Carousel({ children, className }: Props) {
    const items = Children.toArray(children)

    return (
        <BaseCarousel className={cn("w-full max-w-[90%]", className)}>
            <CarouselContent>
                {items.map((child, index) => (
                    <CarouselItem key={index}>{child}</CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </BaseCarousel>
    )
}
