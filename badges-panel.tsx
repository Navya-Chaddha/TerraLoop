"use client"

import { useApp, type Badge } from "@/context/app-context"
import { Card } from "@/components/ui/card"
import { X, Award, Lock } from "lucide-react"
import { cn } from "@/lib/utils"

interface BadgesPanelProps {
  onClose: () => void
}

const allBadges: Badge[] = [
  {
    id: "first-sale",
    name: "First Sale",
    nameKey: "badgeFirstSale",
    description: "Sold your first rescue item",
    descriptionKey: "badgeFirstSaleDesc",
    icon: "🌱",
    requirement: 1,
    type: "sold",
  },
  {
    id: "food-hero",
    name: "Food Hero",
    nameKey: "badgeFoodHero",
    description: "Saved 10kg of food from waste",
    descriptionKey: "badgeFoodHeroDesc",
    icon: "🦸",
    requirement: 10,
    type: "saved",
  },
  {
    id: "rescue-champ",
    name: "Rescue Champion",
    nameKey: "badgeRescueChamp",
    description: "Rescued 25 items",
    descriptionKey: "badgeRescueChampDesc",
    icon: "🏆",
    requirement: 25,
    type: "bought",
  },
  {
    id: "eco-warrior",
    name: "Eco Warrior",
    nameKey: "badgeEcoWarrior",
    description: "Saved 50kg of food",
    descriptionKey: "badgeEcoWarriorDesc",
    icon: "🌍",
    requirement: 50,
    type: "saved",
  },
  {
    id: "super-seller",
    name: "Super Seller",
    nameKey: "badgeSuperSeller",
    description: "Sold 50 rescue items",
    descriptionKey: "badgeSuperSellerDesc",
    icon: "⭐",
    requirement: 50,
    type: "sold",
  },
  {
    id: "streak-master",
    name: "Streak Master",
    nameKey: "badgeStreakMaster",
    description: "7-day active streak",
    descriptionKey: "badgeStreakMasterDesc",
    icon: "🔥",
    requirement: 7,
    type: "streak",
  },
]

export default function BadgesPanel({ onClose }: BadgesPanelProps) {
  const { t, user } = useApp()

  const getProgress = (badge: Badge) => {
    if (!user) return 0
    switch (badge.type) {
      case "sold":
        return Math.min((user.itemsSold / badge.requirement) * 100, 100)
      case "bought":
        return Math.min((user.itemsBought / badge.requirement) * 100, 100)
      case "saved":
        return Math.min((user.foodSaved / badge.requirement) * 100, 100)
      default:
        return 0
    }
  }

  const getCurrentValue = (badge: Badge) => {
    if (!user) return 0
    switch (badge.type) {
      case "sold":
        return user.itemsSold
      case "bought":
        return user.itemsBought
      case "saved":
        return user.foodSaved
      default:
        return 0
    }
  }

  const isUnlocked = (badge: Badge) => getProgress(badge) >= 100

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="glass w-full max-w-md max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 glass border-b border-border p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-warning" />
            <h2 className="text-lg font-semibold text-foreground">{t("yourBadges")}</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Badges Grid */}
        <div className="p-4 overflow-y-auto max-h-[60vh]">
          <div className="grid grid-cols-2 gap-4">
            {allBadges.map((badge) => {
              const unlocked = isUnlocked(badge)
              const progress = getProgress(badge)
              const current = getCurrentValue(badge)

              return (
                <Card
                  key={badge.id}
                  className={cn(
                    "p-4 text-center transition-all duration-300",
                    unlocked ? "bg-warning/10 border-warning/30" : "bg-muted/50 border-border opacity-70",
                  )}
                >
                  <div
                    className={cn(
                      "w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 text-3xl",
                      unlocked ? "bg-warning/20 animate-badge-unlock" : "bg-muted",
                    )}
                  >
                    {unlocked ? badge.icon : <Lock className="w-6 h-6 text-muted-foreground" />}
                  </div>
                  <h3 className={cn("font-semibold mb-1", unlocked ? "text-warning" : "text-muted-foreground")}>
                    {t(badge.nameKey)}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-2">{t(badge.descriptionKey)}</p>

                  {!unlocked && (
                    <div className="mt-2">
                      <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {current}/{badge.requirement}
                      </p>
                    </div>
                  )}
                </Card>
              )
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 glass border-t border-border p-4">
          <p className="text-sm text-center text-muted-foreground">
            {allBadges.filter((b) => isUnlocked(b)).length} / {allBadges.length} badges unlocked
          </p>
        </div>
      </Card>
    </div>
  )
}
