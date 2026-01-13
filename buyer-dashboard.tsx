"use client"

import { useState } from "react"
import { useApp, type FruitListing } from "@/context/app-context"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Leaf,
  Search,
  Clock,
  MapPin,
  Phone,
  TrendingDown,
  User,
  ShoppingBag,
  Award,
  X,
  Check,
  Sparkles,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import ProfileSidebar from "./profile-sidebar"
import BadgesPanel from "./badges-panel"

export default function BuyerDashboard() {
  const { t, user, listings, purchaseListing } = useApp()
  const [showProfile, setShowProfile] = useState(false)
  const [showBadges, setShowBadges] = useState(false)
  const [selectedListing, setSelectedListing] = useState<FruitListing | null>(null)
  const [purchaseSuccess, setPurchaseSuccess] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const activeListings = listings.filter((l) => l.status === "active")
  const filteredListings = activeListings.filter(
    (l) =>
      l.fruitName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t(l.fruitNameKey).toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handlePurchase = (listing: FruitListing) => {
    purchaseListing(listing.id)
    setPurchaseSuccess(listing.id)
    setTimeout(() => {
      setPurchaseSuccess(null)
      setSelectedListing(null)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Leaf className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="font-bold text-foreground">TerraLoop</h1>
                <p className="text-xs text-muted-foreground">{t("buyerDashboard")}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowBadges(true)}
                className="w-10 h-10 rounded-full bg-warning/20 flex items-center justify-center hover:bg-warning/30 transition-colors relative"
              >
                <Award className="w-5 h-5 text-warning" />
                {user && user.badges.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-warning text-warning-foreground text-xs rounded-full flex items-center justify-center font-bold">
                    {user.badges.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setShowProfile(true)}
                className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center hover:bg-primary/30 transition-colors"
              >
                <User className="w-5 h-5 text-primary" />
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search fruits..."
              className="w-full h-12 pl-10 pr-4 rounded-xl bg-muted border border-border focus:border-primary outline-none text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>
      </header>

      {/* Stats Strip */}
      <div className="bg-primary/10 py-3">
        <div className="container mx-auto px-4 flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-primary" />
            <span className="text-foreground">
              {user?.itemsBought || 0} {t("itemsBought")}
            </span>
          </div>
          <div className="w-px h-4 bg-border" />
          <div className="flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-accent" />
            <span className="text-foreground">
              {user?.foodSaved || 0} kg {t("foodSaved")}
            </span>
          </div>
          <div className="w-px h-4 bg-border" />
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-warning" />
            <span className="text-foreground">{user?.points || 0} pts</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">{t("availableDeals")}</h2>
          <span className="text-sm text-muted-foreground">{filteredListings.length} deals</span>
        </div>

        {filteredListings.length === 0 ? (
          <Card className="glass p-8 text-center">
            <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">{t("noDeals")}</p>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {filteredListings.map((listing) => (
              <Card
                key={listing.id}
                className={cn(
                  "glass overflow-hidden cursor-pointer transition-all duration-300",
                  "hover:border-primary hover:shadow-lg hover:shadow-primary/10",
                )}
                onClick={() => setSelectedListing(listing)}
              >
                <div className="relative">
                  <Image
                    src={listing.imageUrl || "/placeholder.svg"}
                    alt={listing.fruitName}
                    width={400}
                    height={200}
                    className="w-full h-40 object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 rounded-full bg-destructive text-destructive-foreground text-sm font-bold">
                      {Math.round(((listing.originalPrice - listing.finalPrice) / listing.originalPrice) * 100)}% OFF
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="px-3 py-1 rounded-full glass text-foreground text-xs flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {listing.expiresIn}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-foreground text-lg">{t(listing.fruitNameKey)}</h3>
                      <p className="text-sm text-muted-foreground">{t(listing.conditionKey)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-muted-foreground text-sm line-through">₹{listing.originalPrice}</p>
                      <p className="text-primary font-bold text-xl">₹{listing.finalPrice}</p>
                      <p className="text-xs text-muted-foreground">per {listing.unit}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {listing.bestForKeys.map((key) => (
                      <span key={key} className="px-2 py-1 bg-accent/10 text-accent text-xs rounded-full">
                        {t(key)}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{listing.grocerName}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Listing Detail Modal */}
      {selectedListing && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <Card className="glass w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <Image
                src={selectedListing.imageUrl || "/placeholder.svg"}
                alt={selectedListing.fruitName}
                width={500}
                height={300}
                className="w-full h-56 object-cover"
              />
              <button
                onClick={() => setSelectedListing(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full glass flex items-center justify-center"
              >
                <X className="w-4 h-4 text-foreground" />
              </button>
              <div className="absolute bottom-3 left-3">
                <span className="px-4 py-2 rounded-full bg-destructive text-destructive-foreground font-bold">
                  {Math.round(
                    ((selectedListing.originalPrice - selectedListing.finalPrice) / selectedListing.originalPrice) *
                      100,
                  )}
                  % OFF
                </span>
              </div>
            </div>

            <div className="p-6">
              {purchaseSuccess === selectedListing.id ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
                    <Check className="w-8 h-8 text-primary" />
                  </div>
                  <p className="text-lg font-semibold text-foreground mb-2">{t("thankYou")}</p>
                  <p className="text-sm text-muted-foreground">Contact the grocer to collect your order</p>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-foreground">{t(selectedListing.fruitNameKey)}</h2>
                      <p className="text-muted-foreground">{t(selectedListing.conditionKey)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-muted-foreground line-through">₹{selectedListing.originalPrice}</p>
                      <p className="text-primary font-bold text-2xl">₹{selectedListing.finalPrice}</p>
                      <p className="text-xs text-muted-foreground">per {selectedListing.unit}</p>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">{t("bestFor")}</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedListing.bestForKeys.map((key) => (
                          <span key={key} className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm">
                            {t(key)}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                      <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-warning" />
                        <span className="text-foreground">
                          {t("expiresIn")}: {selectedListing.expiresIn}
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {selectedListing.quantity} {selectedListing.unit}
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-muted/50">
                      <p className="text-sm text-muted-foreground mb-2">Grocer Details</p>
                      <p className="font-medium text-foreground">{selectedListing.grocerName}</p>
                      <div className="flex items-center gap-2 mt-1 text-primary">
                        <Phone className="w-4 h-4" />
                        <span>{selectedListing.grocerPhone}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1 h-12 border-border hover:bg-muted bg-transparent"
                      onClick={() => window.open(`tel:${selectedListing.grocerPhone}`)}
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      {t("contactGrocer")}
                    </Button>
                    <Button
                      className="flex-1 h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                      onClick={() => handlePurchase(selectedListing)}
                    >
                      {t("buyNow")}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Profile Sidebar */}
      {showProfile && <ProfileSidebar onClose={() => setShowProfile(false)} />}

      {/* Badges Panel */}
      {showBadges && <BadgesPanel onClose={() => setShowBadges(false)} />}
    </div>
  )
}
