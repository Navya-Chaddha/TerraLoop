"use client"

import { useState } from "react"
import { useApp, type Language } from "@/context/app-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Check, Globe, Leaf } from "lucide-react"
import { cn } from "@/lib/utils"

const languages: { code: Language; name: string; nativeName: string }[] = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
  { code: "mr", name: "Marathi", nativeName: "मराठी" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা" },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ" },
]

export default function LanguageSelection() {
  const { language, setLanguage, setCurrentStep, t } = useApp()
  const [selected, setSelected] = useState<Language>(language)

  const handleContinue = () => {
    setLanguage(selected)
    setCurrentStep("login")
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="relative z-10 w-full max-w-lg">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 mb-4 animate-pulse-glow">
            <Leaf className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl font-bold gradient-text mb-2">TerraLoop</h1>
          <p className="text-muted-foreground">{t("tagline")}</p>
        </div>

        {/* Language Selection Card */}
        <Card className="glass p-6">
          <div className="flex items-center gap-2 mb-6">
            <Globe className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">{t("selectLanguage")}</h2>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setSelected(lang.code)}
                className={cn(
                  "relative p-4 rounded-xl border-2 transition-all duration-300 text-left",
                  selected === lang.code
                    ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
                    : "border-border bg-card hover:border-primary/50 hover:bg-muted",
                )}
              >
                {selected === lang.code && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-3 h-3 text-primary-foreground" />
                  </div>
                )}
                <p className="font-medium text-foreground">{lang.nativeName}</p>
                <p className="text-sm text-muted-foreground">{lang.name}</p>
              </button>
            ))}
          </div>

          <Button
            onClick={handleContinue}
            className="w-full h-12 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {t("continue")}
          </Button>
        </Card>

        {/* Impact Stats */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="glass p-4 rounded-xl">
            <p className="text-2xl font-bold text-primary">2.5K+</p>
            <p className="text-xs text-muted-foreground">{t("kgSaved")}</p>
          </div>
          <div className="glass p-4 rounded-xl">
            <p className="text-2xl font-bold text-accent">500+</p>
            <p className="text-xs text-muted-foreground">{t("dealsCompleted")}</p>
          </div>
          <div className="glass p-4 rounded-xl">
            <p className="text-2xl font-bold text-primary">1.2K</p>
            <p className="text-xs text-muted-foreground">{t("happyCustomers")}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
