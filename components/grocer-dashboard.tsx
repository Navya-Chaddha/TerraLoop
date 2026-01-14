"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useApp, type FruitListing } from "@/context/app-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Camera, Leaf, TrendingDown, Check, Loader2, Plus, Package, Sparkles, X, User, Award } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import ProfileSidebar from "./profile-sidebar"

interface DetectedFruit {
  name: string
  nameKey: string
  condition: string
  conditionKey: string
  recommendedPrice: number
  originalPrice: number
  bestFor: string[]
  bestForKeys: string[]
  confidence: number
}

// Simulated AI detection results
const fruitDetectionResults: Record<string, DetectedFruit> = {
  mango: {
    name: "Mango",
    nameKey: "mango",
    condition: "Perfect for Shakes",
    conditionKey: "perfectForShakes",
    recommendedPrice: 40,
    originalPrice: 80,
    bestFor: ["Shakes", "Smoothies", "Aamras"],
    bestForKeys: ["shakes", "smoothies"],
    confidence: 94,
  },
  banana: {
    name: "Banana",
    nameKey: "banana",
    condition: "Very Ripe",
    conditionKey: "veryRipe",
    recommendedPrice: 25,
    originalPrice: 50,
    bestFor: ["Smoothies", "Cooking", "Desserts"],
    bestForKeys: ["smoothies", "cooking", "desserts"],
    confidence: 92,
  },
  apple: {
    name: "Apple",
    nameKey: "apple",
    condition: "Slightly Overripe",
    conditionKey: "slightlyOverripe",
    recommendedPrice: 60,
    originalPrice: 120,
    bestFor: ["Juice", "Cooking", "Jam"],
    bestForKeys: ["juice", "cooking", "jam"],
    confidence: 89,
  },
  papaya: {
    name: "Papaya",
    nameKey: "papaya",
    condition: "Ripe & Sweet",
    conditionKey: "ripe",
    recommendedPrice: 30,
    originalPrice: 60,
    bestFor: ["Fresh Eating", "Juice", "Salad"],
    bestForKeys: ["eating", "juice"],
    confidence: 91,
  },
  orange: {
    name: "Orange",
    nameKey: "orange",
    condition: "Ripe & Sweet",
    conditionKey: "ripe",
    recommendedPrice: 35,
    originalPrice: 70,
    bestFor: ["Fresh Juice", "Eating"],
    bestForKeys: ["juice", "eating"],
    confidence: 93,
  },
}

export default function GrocerDashboard() {
  const { t, user, addListing, listings } = useApp()
  const [showAddDeal, setShowAddDeal] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [detectedFruit, setDetectedFruit] = useState<DetectedFruit | null>(null)
  const [adjustedPrice, setAdjustedPrice] = useState(0)
  const [quantity, setQuantity] = useState("1")
  const [isPublishing, setIsPublishing] = useState(false)
  const [publishSuccess, setPublishSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const myListings = listings.filter((l) => l.grocerId === user?.id)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
        simulateAIAnalysis()
      }
      reader.readAsDataURL(file)
    }
  }

  const simulateAIAnalysis = () => {
    setIsAnalyzing(true)
    setDetectedFruit(null)

    // Simulate AI processing time
    setTimeout(() => {
      const orangeFruit = fruitDetectionResults.orange
      setDetectedFruit(orangeFruit)
      setAdjustedPrice(orangeFruit.recommendedPrice)
      setIsAnalyzing(false)
    }, 2500)
  }

  const handlePublish = () => {
    if (!detectedFruit || !user) return

    setIsPublishing(true)

    setTimeout(() => {
      const newListing: FruitListing = {
        id: `listing-${Date.now()}`,
        grocerId: user.id,
        grocerName: user.name,
        grocerPhone: user.phone,
        fruitName: detectedFruit.name,
        fruitNameKey: detectedFruit.nameKey,
        condition: detectedFruit.condition,
        conditionKey: detectedFruit.conditionKey,
        recommendedPrice: detectedFruit.recommendedPrice,
        finalPrice: adjustedPrice,
        originalPrice: detectedFruit.originalPrice,
        quantity,
        unit: "kg",
        imageUrl: imagePreview || `/placeholder.svg?height=300&width=300&query=${detectedFruit.name} fruit`,
        bestFor: detectedFruit.bestFor,
        bestForKeys: detectedFruit.bestForKeys,
        expiresIn: "Today",
        createdAt: new Date(),
        status: "active",
      }

      addListing(newListing)
      setIsPublishing(false)
      setPublishSuccess(true)

      setTimeout(() => {
        setShowAddDeal(false)
        setImagePreview(null)
        setDetectedFruit(null)
        setPublishSuccess(false)
      }, 2000)
    }, 1500)
  }

  const discountPercent = detectedFruit
    ? Math.round(((detectedFruit.originalPrice - adjustedPrice) / detectedFruit.originalPrice) * 100)
    : 0

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Leaf className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-bold text-foreground">TerraLoop</h1>
              <p className="text-xs text-muted-foreground">{t("grocerDashboard")}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">{user?.name}</p>
              <p className="text-xs text-primary">{user?.points} pts</p>
            </div>
            <button
              onClick={() => setShowProfile(true)}
              className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center hover:bg-primary/30 transition-colors"
            >
              <User className="w-5 h-5 text-primary" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Card className="glass p-4 text-center">
            <Package className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{user?.itemsSold || 0}</p>
            <p className="text-xs text-muted-foreground">{t("itemsSold")}</p>
          </Card>
          <Card className="glass p-4 text-center">
            <TrendingDown className="w-6 h-6 text-accent mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{user?.foodSaved || 0} kg</p>
            <p className="text-xs text-muted-foreground">{t("foodSaved")}</p>
          </Card>
          <Card className="glass p-4 text-center">
            <Award className="w-6 h-6 text-warning mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{user?.badges.length || 0}</p>
            <p className="text-xs text-muted-foreground">{t("yourBadges")}</p>
          </Card>
        </div>

        {/* Add New Deal Button */}
        {!showAddDeal && (
          <Button
            onClick={() => setShowAddDeal(true)}
            className="w-full h-14 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground mb-6"
          >
            <Plus className="w-5 h-5 mr-2" />
            {t("addNewDeal")}
          </Button>
        )}

        {/* Add Deal Form */}
        {showAddDeal && (
          <Card className="glass p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">{t("addNewDeal")}</h2>
              <button
                onClick={() => {
                  setShowAddDeal(false)
                  setImagePreview(null)
                  setDetectedFruit(null)
                }}
                className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {/* Upload Section */}
            {!imagePreview && (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
              >
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                  <Camera className="w-8 h-8 text-primary" />
                </div>
                <p className="font-medium text-foreground mb-2">{t("takePhoto")}</p>
                <p className="text-sm text-muted-foreground">Tap to capture or upload fruit image</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            )}

            {/* Image Preview & Analysis */}
            {imagePreview && (
              <div className="space-y-4">
                <div className="relative rounded-xl overflow-hidden">
                  <Image
                    src={imagePreview || "/placeholder.svg"}
                    alt="Fruit preview"
                    width={400}
                    height={300}
                    className="w-full h-48 object-cover"
                  />
                  {isAnalyzing && (
                    <div className="absolute inset-0 bg-background/80 flex flex-col items-center justify-center">
                      <Loader2 className="w-10 h-10 text-primary animate-spin mb-3" />
                      <p className="text-foreground font-medium">{t("analyzing")}</p>
                    </div>
                  )}
                </div>

                {/* AI Detection Results */}
                {detectedFruit && !publishSuccess && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/10">
                      <Sparkles className="w-5 h-5 text-primary" />
                      <span className="font-medium text-foreground">{t("fruitDetected")}:</span>
                      <span className="text-primary font-bold">{t(detectedFruit.nameKey)}</span>
                      <span className="ml-auto text-xs text-muted-foreground">{detectedFruit.confidence}% match</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">{t("condition")}</p>
                        <p className="font-medium text-foreground">{t(detectedFruit.conditionKey)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">{t("bestFor")}</p>
                        <div className="flex flex-wrap gap-1">
                          {detectedFruit.bestForKeys.slice(0, 2).map((key) => (
                            <span key={key} className="px-2 py-0.5 bg-accent/10 text-accent text-xs rounded-full">
                              {t(key)}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Pricing Section */}
                    <div className="p-4 rounded-xl bg-muted/50 space-y-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-xs text-muted-foreground">{t("originalPrice")}</p>
                          <p className="text-lg text-muted-foreground line-through">
                            ₹{detectedFruit.originalPrice}/kg
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">{t("recommendedPrice")}</p>
                          <p className="text-lg text-primary font-bold">₹{detectedFruit.recommendedPrice}/kg</p>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-foreground">
                            {t("yourPrice")}: ₹{adjustedPrice}/kg
                          </span>
                          <span className="text-sm text-accent font-medium">{discountPercent}% off</span>
                        </div>
                        <Slider
                          value={[adjustedPrice]}
                          onValueChange={([val]) => setAdjustedPrice(val)}
                          min={Math.round(detectedFruit.recommendedPrice * 0.5)}
                          max={detectedFruit.recommendedPrice}
                          step={5}
                          className="w-full"
                        />
                      </div>

                      <div>
                        <label className="text-sm text-foreground mb-2 block">{t("quantity")} (kg)</label>
                        <Input
                          type="number"
                          value={quantity}
                          onChange={(e) => setQuantity(e.target.value)}
                          min="0.5"
                          step="0.5"
                          className="bg-input border-border"
                        />
                      </div>
                    </div>

                    <Button
                      onClick={handlePublish}
                      disabled={isPublishing}
                      className="w-full h-12 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      {isPublishing ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Publishing...
                        </>
                      ) : (
                        <>
                          <Check className="w-5 h-5 mr-2" />
                          {t("publishDeal")}
                        </>
                      )}
                    </Button>
                  </div>
                )}

                {/* Success Message */}
                {publishSuccess && (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
                      <Check className="w-8 h-8 text-primary" />
                    </div>
                    <p className="text-lg font-semibold text-foreground mb-2">{t("dealPublished")}</p>
                    <p className="text-sm text-muted-foreground">{t("thankYou")}</p>
                  </div>
                )}
              </div>
            )}
          </Card>
        )}

        {/* My Listings */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">{t("myListings")}</h2>
          {myListings.length === 0 ? (
            <Card className="glass p-8 text-center">
              <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No listings yet. Add your first rescue deal!</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {myListings.map((listing) => (
                <Card key={listing.id} className="glass p-4">
                  <div className="flex gap-4">
                    <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={listing.imageUrl || "/placeholder.svg"}
                        alt={listing.fruitName}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-foreground">{t(listing.fruitNameKey)}</h3>
                          <p className="text-xs text-muted-foreground">{t(listing.conditionKey)}</p>
                        </div>
                        <span
                          className={cn(
                            "px-2 py-1 rounded-full text-xs font-medium",
                            listing.status === "active"
                              ? "bg-primary/10 text-primary"
                              : "bg-muted text-muted-foreground",
                          )}
                        >
                          {listing.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-2">
                        <div>
                          <span className="text-muted-foreground text-sm line-through">₹{listing.originalPrice}</span>
                          <span className="text-primary font-bold ml-2">₹{listing.finalPrice}/kg</span>
                        </div>
                        <span className="text-xs text-muted-foreground">{listing.quantity} kg</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Profile Sidebar */}
      {showProfile && <ProfileSidebar onClose={() => setShowProfile(false)} />}
    </div>
  )
}
