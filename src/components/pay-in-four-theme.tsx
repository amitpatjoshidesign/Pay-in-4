"use client"

import {
  createContext,
  type CSSProperties,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import { createPortal } from "react-dom"
import { Palette, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type ThemeStyle = CSSProperties & Record<`--${string}`, string>

export type PayInFourThemeId = "pine" | "cobalt" | "coral" | "sunrise"
export type PayInFourCardJourney = "new-card" | "saved-card"

type PayInFourTheme = {
  id: PayInFourThemeId
  name: string
  primary: string
  primaryForeground: string
  accent: string
  accentForeground: string
  panel: string
  panelForeground: string
  surface: string
  surfaceBorder: string
  action: string
  progress: string
  progressTrack: string
  badgeBorder: string
  badgeGradient: string
  badgeShadow: string
  buttonShadow: string
}

export const payInFourThemes: PayInFourTheme[] = [
  {
    id: "pine",
    name: "Pine",
    primary: "#005857",
    primaryForeground: "#ffffff",
    accent: "#ddf6e9",
    accentForeground: "#00722f",
    panel: "#015857",
    panelForeground: "#e4faf3",
    surface: "#e4faf3",
    surfaceBorder: "rgb(1 115 115 / 20%)",
    action: "#015857",
    progress: "#017373",
    progressTrack: "rgb(1 115 115 / 18%)",
    badgeBorder: "hsl(179 98% 36% / 0.65)",
    badgeGradient:
      "linear-gradient(135deg, hsl(179 98% 16%) 0%, hsl(179 98% 22%) 52%, hsl(179 98% 30%) 100%)",
    badgeShadow: "0 4px 10px rgb(0 88 87 / 16%)",
    buttonShadow:
      "0 8px 22px rgb(0 88 87 / 22%), inset 0 0 13px rgb(255 255 255 / 24%)",
  },
  {
    id: "cobalt",
    name: "Cobalt",
    primary: "#1456b8",
    primaryForeground: "#ffffff",
    accent: "#e7f0ff",
    accentForeground: "#174ea6",
    panel: "#123f8c",
    panelForeground: "#eaf2ff",
    surface: "#eaf2ff",
    surfaceBorder: "rgb(20 86 184 / 20%)",
    action: "#1456b8",
    progress: "#2b6eea",
    progressTrack: "rgb(43 110 234 / 18%)",
    badgeBorder: "rgb(43 110 234 / 60%)",
    badgeGradient:
      "linear-gradient(135deg, #103b7c 0%, #1456b8 54%, #2b78e8 100%)",
    badgeShadow: "0 4px 10px rgb(20 86 184 / 18%)",
    buttonShadow:
      "0 8px 22px rgb(20 86 184 / 22%), inset 0 0 13px rgb(255 255 255 / 24%)",
  },
  {
    id: "coral",
    name: "Coral",
    primary: "#b8325d",
    primaryForeground: "#ffffff",
    accent: "#ffe6ee",
    accentForeground: "#9f244c",
    panel: "#8f2448",
    panelForeground: "#fff0f5",
    surface: "#fff0f5",
    surfaceBorder: "rgb(184 50 93 / 20%)",
    action: "#b8325d",
    progress: "#d94675",
    progressTrack: "rgb(217 70 117 / 18%)",
    badgeBorder: "rgb(217 70 117 / 60%)",
    badgeGradient:
      "linear-gradient(135deg, #7d1d3f 0%, #b8325d 54%, #e05c83 100%)",
    badgeShadow: "0 4px 10px rgb(184 50 93 / 18%)",
    buttonShadow:
      "0 8px 22px rgb(184 50 93 / 22%), inset 0 0 13px rgb(255 255 255 / 24%)",
  },
  {
    id: "sunrise",
    name: "Sunrise",
    primary: "#9c5418",
    primaryForeground: "#ffffff",
    accent: "#fff0d8",
    accentForeground: "#84450f",
    panel: "#7c4316",
    panelForeground: "#fff4e2",
    surface: "#fff4e2",
    surfaceBorder: "rgb(156 84 24 / 22%)",
    action: "#9c5418",
    progress: "#c96f1f",
    progressTrack: "rgb(201 111 31 / 20%)",
    badgeBorder: "rgb(201 111 31 / 58%)",
    badgeGradient:
      "linear-gradient(135deg, #6f3b12 0%, #9c5418 54%, #d4802b 100%)",
    badgeShadow: "0 4px 10px rgb(156 84 24 / 18%)",
    buttonShadow:
      "0 8px 22px rgb(156 84 24 / 22%), inset 0 0 13px rgb(255 255 255 / 24%)",
  },
]

const defaultThemeId: PayInFourThemeId = "pine"
const defaultCardJourney: PayInFourCardJourney = "new-card"

const cardJourneyOptions: Array<{
  id: PayInFourCardJourney
  name: string
  description: string
}> = [
  {
    id: "new-card",
    name: "New card",
    description: "Collect full card details before payment.",
  },
  {
    id: "saved-card",
    name: "Saved card",
    description: "Use tokenised saved cards without CVV.",
  },
]

function getTheme(themeId: PayInFourThemeId) {
  return (
    payInFourThemes.find((theme) => theme.id === themeId) ??
    payInFourThemes[0]
  )
}

function getThemeStyle(theme: PayInFourTheme): ThemeStyle {
  return {
    "--primary": theme.primary,
    "--primary-foreground": theme.primaryForeground,
    "--ring": theme.primary,
    "--accent": theme.accent,
    "--accent-foreground": theme.accentForeground,
    "--chart-1": theme.primary,
    "--chart-2": theme.progress,
    "--chart-3": theme.accent,
    "--checkout-success": theme.progress,
    "--checkout-success-muted": theme.accent,
    "--checkout-button-shadow": theme.buttonShadow,
    "--pay-in-four-panel": theme.panel,
    "--pay-in-four-panel-foreground": theme.panelForeground,
    "--pay-in-four-surface": theme.surface,
    "--pay-in-four-surface-border": theme.surfaceBorder,
    "--pay-in-four-action": theme.action,
    "--pay-in-four-progress": theme.progress,
    "--pay-in-four-progress-track": theme.progressTrack,
    "--pay-in-four-badge-border": theme.badgeBorder,
    "--pay-in-four-badge-gradient": theme.badgeGradient,
    "--pay-in-four-badge-shadow": theme.badgeShadow,
  }
}

type PayInFourThemeContextValue = {
  themeId: PayInFourThemeId
  setThemeId: (themeId: PayInFourThemeId) => void
  cardJourney: PayInFourCardJourney
  setCardJourney: (cardJourney: PayInFourCardJourney) => void
}

const PayInFourThemeContext =
  createContext<PayInFourThemeContextValue | null>(null)

export function PayInFourThemeProvider({
  children,
}: {
  children: ReactNode
}) {
  const [themeId, setThemeIdState] =
    useState<PayInFourThemeId>(defaultThemeId)
  const [cardJourney, setCardJourneyState] =
    useState<PayInFourCardJourney>(defaultCardJourney)

  const value = useMemo<PayInFourThemeContextValue>(
    () => ({
      themeId,
      setThemeId: setThemeIdState,
      cardJourney,
      setCardJourney: setCardJourneyState,
    }),
    [cardJourney, themeId]
  )

  const themeStyle = useMemo(() => getThemeStyle(getTheme(themeId)), [themeId])

  return (
    <PayInFourThemeContext.Provider value={value}>
      <div
        className="flex min-h-full flex-1 flex-col"
        data-pay-in-four-theme={themeId}
        style={themeStyle}
      >
        {children}
      </div>
    </PayInFourThemeContext.Provider>
  )
}

export function usePayInFourTheme() {
  const context = useContext(PayInFourThemeContext)

  if (!context) {
    throw new Error(
      "usePayInFourTheme must be used within PayInFourThemeProvider"
    )
  }

  return context
}

export function PayInFourThemePopover({ className }: { className?: string }) {
  const { themeId, setThemeId, cardJourney, setCardJourney } =
    usePayInFourTheme()
  const [open, setOpen] = useState(false)
  const [draftThemeId, setDraftThemeId] =
    useState<PayInFourThemeId>(themeId)
  const [draftCardJourney, setDraftCardJourney] =
    useState<PayInFourCardJourney>(cardJourney)
  const selectedTheme = getTheme(themeId)
  const draftTheme = getTheme(draftThemeId)
  const draftThemeStyle = getThemeStyle(draftTheme)

  useEffect(() => {
    if (!open) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false)
      }
    }
    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [open])

  const sheet =
    open && typeof document !== "undefined"
      ? createPortal(
          <>
            <button
              type="button"
              className="fixed inset-0 z-[90] cursor-default bg-black/25 backdrop-blur-[1px]"
              aria-label="Close Pay in 4 - Theme"
              onClick={() => setOpen(false)}
            />
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="pay-in-four-theme-title"
              className="fixed inset-x-0 bottom-0 z-[100] mx-auto flex max-h-[min(82vh,42rem)] w-full max-w-[28rem] flex-col rounded-t-[24px] border border-border bg-background text-foreground shadow-[0_-20px_70px_rgb(15_23_42_/_18%)]"
            >
              <div className="flex justify-center px-4 pt-3">
                <div className="h-1.5 w-10 rounded-full bg-muted-foreground/30" />
              </div>
              <header className="flex items-center justify-between gap-3 border-b px-4 py-3">
                <div className="min-w-0">
                  <h2
                    id="pay-in-four-theme-title"
                    className="text-base font-semibold leading-6"
                  >
                    Pay in 4 - Theme
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Choose a color and card journey, then implement them.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="shrink-0 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
                  aria-label="Close Pay in 4 - Theme"
                  onClick={() => setOpen(false)}
                >
                  <X aria-hidden="true" />
                </Button>
              </header>

              <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4">
                <div
                  className="grid gap-3"
                  role="list"
                  aria-label="Pay in 4 - Theme colors"
                >
                  {payInFourThemes.map((theme) => {
                    const selected = theme.id === draftThemeId

                    return (
                      <button
                        key={theme.id}
                        type="button"
                        aria-pressed={selected}
                        className={cn(
                          "flex cursor-pointer items-center gap-3 rounded-[var(--radius)] border p-3 text-left transition-colors",
                          !selected &&
                            "border-border bg-background text-foreground hover:bg-muted/50"
                        )}
                        style={
                          selected
                            ? {
                                borderColor: theme.primary,
                                backgroundColor: theme.accent,
                                color: theme.accentForeground,
                              }
                            : undefined
                        }
                        onClick={() => {
                          setDraftThemeId(theme.id)
                        }}
                      >
                        <span
                          className="size-8 shrink-0 rounded-full ring-1 ring-foreground/10"
                          style={{ backgroundColor: theme.primary }}
                          aria-hidden="true"
                        />
                        <span className="min-w-0 text-sm font-semibold">
                          {theme.name}
                        </span>
                      </button>
                    )
                  })}
                </div>

                <div className="flex flex-col gap-3">
                  <div>
                    <h3 className="text-sm font-semibold leading-5">Journey</h3>
                    <p className="text-xs leading-5 text-muted-foreground">
                      Configure what customers see on the card input page.
                    </p>
                  </div>
                  <div className="grid gap-2">
                    {cardJourneyOptions.map((option) => {
                      const selected = option.id === draftCardJourney

                      return (
                        <button
                          key={option.id}
                          type="button"
                          aria-pressed={selected}
                          className={cn(
                            "flex cursor-pointer flex-col gap-1 rounded-[var(--radius)] border p-3 text-left transition-colors",
                            !selected &&
                              "border-border bg-background text-foreground hover:bg-muted/50"
                          )}
                          style={
                            selected
                              ? {
                                  borderColor: draftTheme.primary,
                                  backgroundColor: draftTheme.accent,
                                  color: draftTheme.accentForeground,
                                }
                              : undefined
                          }
                          onClick={() => setDraftCardJourney(option.id)}
                        >
                          <span className="text-sm font-semibold">
                            {option.name}
                          </span>
                          <span
                            className={cn(
                              "text-xs leading-5",
                              selected ? "opacity-70" : "text-muted-foreground"
                            )}
                          >
                            {option.description}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div
                  className="rounded-[var(--radius)] bg-[var(--pay-in-four-panel)] p-1"
                  style={draftThemeStyle}
                >
                  <div className="flex items-center justify-between gap-3 p-2">
                    <p className="text-sm font-bold italic leading-[18px] text-[var(--pay-in-four-panel-foreground)]">
                      Pay in 4
                    </p>
                  </div>
                  <div className="rounded-[calc(var(--radius)*0.9)] bg-[var(--pay-in-four-surface)] p-3 text-sm font-medium">
                    Pay Rs 22,500 now then Rs 22,500 for 3 m
                  </div>
                </div>
              </div>

              <footer className="border-t px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-4">
                <Button
                  type="button"
                  className="h-11 w-full rounded-full"
                  style={{
                    backgroundColor: draftTheme.primary,
                    color: draftTheme.primaryForeground,
                    boxShadow: draftTheme.buttonShadow,
                  }}
                  onClick={() => {
                    setThemeId(draftThemeId)
                    setCardJourney(draftCardJourney)
                    setOpen(false)
                  }}
                >
                  Implement
                </Button>
              </footer>
            </div>
          </>,
          document.body
        )
      : null

  return (
    <div className={cn("relative inline-flex", className)}>
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="relative shrink-0"
        aria-label="Pay in 4 - Theme"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => {
          setDraftThemeId(themeId)
          setDraftCardJourney(cardJourney)
          setOpen(true)
        }}
      >
        <Palette aria-hidden="true" />
        <span
          className="absolute bottom-1.5 right-1.5 size-2.5 rounded-full ring-2 ring-background"
          style={{ backgroundColor: selectedTheme.primary }}
          aria-hidden="true"
        />
      </Button>

      {sheet}
    </div>
  )
}
