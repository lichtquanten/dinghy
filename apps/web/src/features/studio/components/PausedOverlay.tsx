import { useMutation } from "@tanstack/react-query"
import { useEffect, useRef } from "react"
import { Spinner } from "@workspace/ui/components/spinner.js"
import { trpc } from "@/lib/trpc"
import { useAssignment } from "../hooks/assignment"
import { usePairingId, usePartner } from "../hooks/pairing"
import { useIsPartnerOnline } from "../hooks/useIsPartnerOnline"

export function PausedOverlay() {
    const pairingId = usePairingId()
    const partner = usePartner()
    const assignment = useAssignment()
    const isPartnerOnline = useIsPartnerOnline()
    const hasFired = useRef(false)

    const { mutate: resumePhase } = useMutation(
        trpc.pairing.resumePhase.mutationOptions()
    )

    useEffect(() => {
        if (isPartnerOnline && !hasFired.current) {
            hasFired.current = true
            resumePhase({ pairingId })
        }
    }, [isPartnerOnline, pairingId, resumePhase])

    const deadline =
        assignment.pairing?.startedAt && assignment.timeLimitSecs
            ? new Date(
                  new Date(assignment.pairing.startedAt).getTime() +
                      assignment.timeLimitSecs * 1000
              )
            : null

    return (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center">
            <div className="flex flex-col items-center gap-4 max-w-sm text-center">
                <h2 className="text-2xl font-bold">Partner disconnected</h2>

                <p className="text-muted-foreground">
                    {isPartnerOnline
                        ? `${partner.firstName} is back, resuming now.`
                        : `${partner.firstName} lost their connection. Waiting for your partner to return....`}
                </p>

                {deadline && (
                    <p className="text-sm text-muted-foreground/70">
                        Complete by{" "}
                        {deadline.toLocaleTimeString([], {
                            hour: "numeric",
                            minute: "2-digit",
                        })}
                    </p>
                )}
                <Spinner className="size-6 text-primary" />
            </div>
        </div>
    )
}
