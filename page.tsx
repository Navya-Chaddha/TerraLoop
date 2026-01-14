"use client"

import { useApp } from "@/context/app-context"
import LanguageSelection from "@/components/language-selection"
import LoginForm from "@/components/login-form"
import RoleSelection from "@/components/role-selection"
import GrocerDashboard from "@/components/grocer-dashboard"
import BuyerDashboard from "@/components/buyer-dashboard"

export default function Home() {
  const { currentStep, user } = useApp()

  return (
    <main className="min-h-screen bg-background">
      {currentStep === "language" && <LanguageSelection />}
      {currentStep === "login" && <LoginForm />}
      {currentStep === "role" && <RoleSelection />}
      {currentStep === "dashboard" && user?.role === "grocer" && <GrocerDashboard />}
      {currentStep === "dashboard" && user?.role === "buyer" && <BuyerDashboard />}
    </main>
  )
}
