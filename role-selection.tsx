"use client"

import { useApp } from "@/context/app-context"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Leaf, ShoppingBag, Store, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

export default function RoleSelection() {
  const { t, setCurrentStep, user, setUser } = useApp()

  const handleRoleSelect = (role: "grocer" | "buyer") => {
    if (user) {
      setUser({ ...user, role })
      setCurrentStep("dashboard")
    }
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
        {/* Back Button */}
        <button
          onClick={() => setCurrentStep("login")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("back")}
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-4">
            <Leaf className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {t("welcomeMessage")}, {user?.name}! 👋
          </h1>
          <p className="text-muted-foreground">{t("selectRole")}</p>
        </div>

        {/* Role Cards */}
        <div className="space-y-4">
          {/* Grocer Card */}
          <Card
            onClick={() => handleRoleSelect("grocer")}
            className={cn(
              "glass p-6 cursor-pointer transition-all duration-300",
              "hover:border-primary hover:shadow-lg hover:shadow-primary/20",
              "group",
            )}
          >
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                <Store className="w-7 h-7 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-1">{t("iAmGrocer")}</h3>
                <p className="text-sm text-muted-foreground">{t("grocerDesc")}</p>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <div className="mt-4 flex gap-2">
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs">📸 {t("takePhoto")}</span>
              <span className="px-3 py-1 rounded-full bg-accent/10 text-accent text-xs">🤖 AI Pricing</span>
            </div>
          </Card>

          {/* Buyer Card */}
          <Card
            onClick={() => handleRoleSelect("buyer")}
            className={cn(
              "glass p-6 cursor-pointer transition-all duration-300",
              "hover:border-primary hover:shadow-lg hover:shadow-primary/20",
              "group",
            )}
          >
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-accent/20 flex items-center justify-center group-hover:bg-accent/30 transition-colors">
                <ShoppingBag className="w-7 h-7 text-accent" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-1">{t("iAmBuyer")}</h3>
                <p className="text-sm text-muted-foreground">{t("buyerDesc")}</p>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <div className="mt-4 flex gap-2">
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs">💰 {t("discount")}</span>
              <span className="px-3 py-1 rounded-full bg-accent/10 text-accent text-xs">🏆 {t("yourBadges")}</span>
            </div>
          </Card>
        </div>

        {/* Bottom Stats */}
        <div className="mt-8 p-4 glass rounded-xl">
          <p className="text-center text-sm text-muted-foreground">
            Join <span className="text-primary font-semibold">2,500+</span> users who have already saved{" "}
            <span className="text-accent font-semibold">5,000 kg</span> of food from waste!
          </p>
        </div>
      </div>
    </div>
  )
}
