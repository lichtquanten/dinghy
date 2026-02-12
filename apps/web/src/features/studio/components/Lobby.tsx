import type { ReactNode } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@workspace/ui/components/button.js"
import { Spinner } from "@workspace/ui/components/spinner.js"
import { useAssignment } from "../hooks/assignment"
import { usePartner } from "../hooks/pairing"
import { usePartnerPresence } from "../hooks/usePartnerPresence"

export function Lobby({ children }: { children: ReactNode }) {
    const { isOnline } = usePartnerPresence()
    const partner = usePartner()
    const assignment = useAssignment()
    const navigate = useNavigate()

    if (isOnline) {
        return <>{children}</>
    }

    const partnerFirstInitial = partner.firstName[0]?.toUpperCase() || "?"
    const partnerLastInitial = partner.lastInitial || ""

    return (
        <div className="flex flex-col items-center justify-center h-screen gap-8">
            <div className="text-center space-y-6">
                <h1 className="text-4xl font-bold">{assignment.title}</h1>

                <div className="flex flex-col items-center gap-4">
                    <div className="flex items-center justify-center w-24 h-24 rounded-full bg-muted text-4xl font-semibold">
                        {partnerFirstInitial}
                    </div>

                    <div className="flex items-center justify-center gap-2">
                        <p className="text-xl text-muted-foreground">
                            Waiting for {partner.firstName} {partnerLastInitial}
                            .
                        </p>
                        <Spinner className="size-4 text-primary" />
                    </div>
                </div>
            </div>

            <Button variant="outline" onClick={() => navigate("/hub")}>
                Leave
            </Button>
        </div>
    )
}
