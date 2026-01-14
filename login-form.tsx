"use client"

import type React from "react"

import { useState } from "react"
import { useApp } from "@/context/app-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Leaf, Phone, User } from "lucide-react"

export default function LoginForm() {
  const { t, setCurrentStep, setUser, language } = useApp()
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({})

  const validateForm = () => {
    const newErrors: { name?: string; phone?: string } = {}
    if (!name.trim()) newErrors.name = "Name is required"
    if (!phone.trim()) newErrors.phone = "Phone is required"
    else if (!/^\d{10}$/.test(phone)) newErrors.phone = "Enter valid 10-digit number"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setUser({
      id: `user-${Date.now()}`,
      name,
      phone,
      role: null,
      language,
      badges: [],
      points: 0,
      itemsSold: 0,
      itemsBought: 0,
      foodSaved: 0,
      createdAt: new Date(),
    })
    setCurrentStep("role")
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

      <div className="relative z-10 w-full max-w-md">
        {/* Back Button */}
        <button
          onClick={() => setCurrentStep("language")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("back")}
        </button>

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-4">
            <Leaf className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold gradient-text mb-2">{t("loginTitle")}</h1>
          <p className="text-muted-foreground">{t("loginSubtitle")}</p>
        </div>

        {/* Login Form */}
        <Card className="glass p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">{t("enterName")}</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t("namePlaceholder")}
                  className="pl-10 h-12 bg-input border-border focus:border-primary"
                />
              </div>
              {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">{t("enterPhone")}</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  placeholder={t("phonePlaceholder")}
                  className="pl-10 h-12 bg-input border-border focus:border-primary"
                />
              </div>
              {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {t("continue")}
            </Button>
          </form>
        </Card>

        {/* Eco Message */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">🌱 Every rescue deal saves food and reduces CO₂ emissions</p>
        </div>
      </div>
    </div>
  )
}
