"use client"

import { useApp } from "@/context/app-context"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, User, Phone, Award, Leaf, LogOut, ShoppingBag, Package, TrendingDown, Globe } from "lucide-react"

interface ProfileSidebarProps {
  onClose: () => void
}

export default function ProfileSidebar({ onClose }: ProfileSidebarProps) {
  const { t, user, setCurrentStep, setUser, language } = useApp()

  const handleLogout = () => {
    setUser(null)
    setCurrentStep("language")
    onClose()
  }

  const getLevel = (points: number) => {
    if (points < 100) return { level: 1, title: "Seedling", next: 100 }
    if (points < 300) return { level: 2, title: "Sprout", next: 300 }
    if (points < 600) return { level: 3, title: "Sapling", next: 600 }
    if (points < 1000) return { level: 4, title: "Tree", next: 1000 }
    return { level: 5, title: "Forest Guardian", next: points }
  }

  const levelInfo = getLevel(user?.points || 0)
  const progress = ((user?.points || 0) / levelInfo.next) * 100

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-card border-l border-border overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 glass border-b border-border p-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">{t("profile")}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        <div className="p-4 space-y-6">
          {/* User Info */}
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
              <User className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-foreground">{user?.name}</h3>
            <div className="flex items-center justify-center gap-2 mt-1 text-muted-foreground">
              <Phone className="w-4 h-4" />
              <span>{user?.phone}</span>
            </div>
            <div className="flex items-center justify-center gap-2 mt-1">
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium capitalize">
                {user?.role}
              </span>
            </div>
          </div>

          {/* Level Progress */}
          <Card className="glass p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-warning" />
                <span className="font-semibold text-foreground">
                  {t("level")} {levelInfo.level}
                </span>
              </div>
              <span className="text-sm text-primary">{levelInfo.title}</span>
            </div>
            <div className="w-full h-3 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              {user?.points || 0} / {levelInfo.next} pts to next level
            </p>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <Card className="glass p-4 text-center">
              {user?.role === "grocer" ? (
                <>
                  <Package className="w-6 h-6 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-foreground">{user?.itemsSold || 0}</p>
                  <p className="text-xs text-muted-foreground">{t("itemsSold")}</p>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-6 h-6 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-foreground">{user?.itemsBought || 0}</p>
                  <p className="text-xs text-muted-foreground">{t("itemsBought")}</p>
                </>
              )}
            </Card>
            <Card className="glass p-4 text-center">
              <TrendingDown className="w-6 h-6 text-accent mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{user?.foodSaved || 0}</p>
              <p className="text-xs text-muted-foreground">kg {t("foodSaved")}</p>
            </Card>
          </div>

          {/* Badges Preview */}
          <Card className="glass p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-warning" />
                <span className="font-semibold text-foreground">{t("yourBadges")}</span>
              </div>
              <span className="text-sm text-primary">{user?.badges.length || 0}</span>
            </div>
            {user?.badges && user.badges.length > 0 ? (
              <div className="flex gap-2 flex-wrap">
                {user.badges.map((badge) => (
                  <div
                    key={badge.id}
                    className="w-12 h-12 rounded-full bg-warning/20 flex items-center justify-center text-2xl"
                    title={badge.name}
                  >
                    {badge.icon}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Complete actions to earn badges!</p>
            )}
          </Card>

          {/* Environmental Impact */}
          <Card className="glass p-4 bg-primary/5">
            <div className="flex items-center gap-2 mb-3">
              <Leaf className="w-5 h-5 text-primary" />
              <span className="font-semibold text-foreground">Environmental Impact</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-primary">{((user?.foodSaved || 0) * 2.5).toFixed(1)}</p>
                <p className="text-xs text-muted-foreground">kg CO₂ saved</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-accent">{((user?.foodSaved || 0) * 1000).toFixed(0)}</p>
                <p className="text-xs text-muted-foreground">liters water saved</p>
              </div>
            </div>
          </Card>

          {/* Actions */}
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start border-border hover:bg-muted bg-transparent"
              onClick={() => setCurrentStep("language")}
            >
              <Globe className="w-4 h-4 mr-3" />
              Change Language
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start border-destructive text-destructive hover:bg-destructive/10 bg-transparent"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-3" />
              {t("logout")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
