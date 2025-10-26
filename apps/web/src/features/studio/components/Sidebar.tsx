import { type ReactNode } from "react"

export interface SidebarItem<TKey extends string = string> {
    key: TKey
    label: string
    icon?: ReactNode
}

interface Props<TKey extends string = string> {
    items: SidebarItem<TKey>[]
    selectedKey: TKey
    onSelect: (key: TKey) => void
    className?: string
}

export default function Sidebar<TKey extends string>({
    items,
    selectedKey,
    onSelect,
}: Props<TKey>) {
    return (
        <div className="w-72 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex flex-col h-full py-8 px-6">
                <nav className="flex-1 flex flex-col justify-center gap-4">
                    {items.map((item) => (
                        <button
                            key={item.key}
                            onClick={() => onSelect(item.key)}
                            className={`
                group relative flex flex-col items-center gap-4 p-8 rounded-2xl
                transition-all duration-200 ease-out
                ${
                    selectedKey === item.key
                        ? "bg-primary text-primary-foreground shadow-lg scale-105"
                        : "bg-muted/50 hover:bg-muted hover:scale-102 text-foreground/70 hover:text-foreground"
                }
              `}
                        >
                            {item.icon && (
                                <div className="w-16 h-16 flex items-center justify-center">
                                    <div className="scale-150">{item.icon}</div>
                                </div>
                            )}
                            <span className="text-xl font-semibold text-center">
                                {item.label}
                            </span>

                            {selectedKey === item.key && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 bg-primary-foreground rounded-r-full" />
                            )}
                        </button>
                    ))}
                </nav>
            </div>
        </div>
    )
}
