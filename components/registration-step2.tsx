"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MapPin, Heart, AlertCircle, ArrowLeft, Zap } from "lucide-react"

interface RegistrationStep2Props {
  data: any
  onUpdate: (data: any) => void
  onNext: () => void
  onPrev: () => void
}

export function RegistrationStep2({ data, onUpdate, onNext, onPrev }: RegistrationStep2Props) {
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Quick fill data for common locations
  const districts = ["काठमाडौं", "ललितपुर", "भक्तपुर", "चितवन", "पोखरा", "धनगढी", "बुटवल", "विराटनगर"]
  const palikas = ["काठमाडौं महानगरपालिका", "ललितपुर महानगरपालिका", "भक्तपुर नगरपालिका", "पोखरा महानगरपालिका"]

  // Common health conditions
  const commonHealthConditions = [
    { id: "fever", label: "ज्वरो | Fever" },
    { id: "cold", label: "रुघाखोकी | Cold/Cough" },
    { id: "diarrhea", label: "झाडापखाला | Diarrhea" },
    { id: "vomiting", label: "वान्ता | Vomiting" },
    { id: "skin_issues", label: "छालाको समस्या | Skin Issues" },
    { id: "breathing", label: "सास फेर्न समस्या | Breathing Issues" },
  ]

  const validateStep = () => {
    const newErrors: Record<string, string> = {}

    if (!data.district.trim()) newErrors.district = "जिल्ला आवश्यक छ"
    if (!data.palika.trim()) newErrors.palika = "पालिका आवश्यक छ"
    if (!data.ward.trim()) newErrors.ward = "वडा नम्बर आवश्यक छ"

    // Check for contraindications
    const contraindications = ["fever", "diarrhea", "vomiting"]
    const hasContraindications = data.healthConditions?.some((condition: string) =>
      contraindications.includes(condition),
    )

    if (hasContraindications) {
      newErrors.healthConditions = "स्वास्थ्य अवस्थाका कारण अहिले स्वर्णबिन्दु दिन मिल्दैन"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep()) {
      onNext()
    }
  }

  const handleHealthConditionChange = (conditionId: string, checked: boolean) => {
    const currentConditions = data.healthConditions || []
    let newConditions

    if (checked) {
      newConditions = [...currentConditions, conditionId]
    } else {
      newConditions = currentConditions.filter((id: string) => id !== conditionId)
    }

    onUpdate({ healthConditions: newConditions })
  }

  const quickFillLocation = (district: string, palika: string) => {
    onUpdate({ district, palika })
  }

  const hasContraindications = data.healthConditions?.some((condition: string) =>
    ["fever", "diarrhea", "vomiting"].includes(condition),
  )

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          ठेगाना र स्वास्थ्य जानकारी | Address & Health Information
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Quick Stats */}
        <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
          <Zap className="h-4 w-4 text-green-600" />
          <span className="text-sm font-medium text-green-800">द्रुत भर्ने | Quick Fill</span>
          <Badge variant="secondary" className="ml-auto">
            Step 2/3
          </Badge>
        </div>

        {/* Quick Location Fill */}
        <div className="space-y-2">
          <Label>सामान्य स्थानहरू | Common Locations</Label>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" onClick={() => quickFillLocation("काठमाडौं", "काठमाडौं महानगरपालिका")}>
              काठमाडौं
            </Button>
            <Button variant="outline" size="sm" onClick={() => quickFillLocation("ललितपुर", "ललितपुर महानगरपालिका")}>
              ललितपुर
            </Button>
            <Button variant="outline" size="sm" onClick={() => quickFillLocation("भक्तपुर", "भक्तपुर नगरपालिका")}>
              भक्तपुर
            </Button>
            <Button variant="outline" size="sm" onClick={() => quickFillLocation("चितवन", "भरतपुर महानगरपालिका")}>
              चितवन
            </Button>
          </div>
        </div>

        {/* Address Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="district">जिल्ला *</Label>
            <Select value={data.district} onValueChange={(value) => onUpdate({ district: value })}>
              <SelectTrigger className={errors.district ? "border-red-500" : ""}>
                <SelectValue placeholder="जिल्ला छान्नुहोस्" />
              </SelectTrigger>
              <SelectContent>
                {districts.map((district) => (
                  <SelectItem key={district} value={district}>
                    {district}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.district && (
              <p className="text-red-500 text-sm flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.district}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="palika">पालिका *</Label>
            <Input
              id="palika"
              value={data.palika}
              onChange={(e) => onUpdate({ palika: e.target.value })}
              placeholder="पालिकाको नाम"
              className={errors.palika ? "border-red-500" : ""}
            />
            {errors.palika && (
              <p className="text-red-500 text-sm flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.palika}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="ward">वडा नम्बर *</Label>
            <Select value={data.ward} onValueChange={(value) => onUpdate({ ward: value })}>
              <SelectTrigger className={errors.ward ? "border-red-500" : ""}>
                <SelectValue placeholder="वडा छान्नुहोस्" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 35 }, (_, i) => i + 1).map((ward) => (
                  <SelectItem key={ward} value={ward.toString()}>
                    वडा नम्बर {ward}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.ward && (
              <p className="text-red-500 text-sm flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.ward}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="tole">टोल</Label>
            <Input
              id="tole"
              value={data.tole}
              onChange={(e) => onUpdate({ tole: e.target.value })}
              placeholder="टोलको नाम"
            />
          </div>
        </div>

        {/* Social Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="caste">जात</Label>
            <Input
              id="caste"
              value={data.caste}
              onChange={(e) => onUpdate({ caste: e.target.value })}
              placeholder="जात"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="religion">धर्म</Label>
            <Select value={data.religion} onValueChange={(value) => onUpdate({ religion: value })}>
              <SelectTrigger>
                <SelectValue placeholder="धर्म छान्नुहोस्" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hindu">हिन्दू</SelectItem>
                <SelectItem value="buddhist">बौद्ध</SelectItem>
                <SelectItem value="christian">ईसाई</SelectItem>
                <SelectItem value="muslim">मुस्लिम</SelectItem>
                <SelectItem value="other">अन्य</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Physical Measurements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="weight">तौल (कि.ग्रा.)</Label>
            <Input
              id="weight"
              type="number"
              step="0.1"
              value={data.weight}
              onChange={(e) => onUpdate({ weight: e.target.value })}
              placeholder="0.0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="height">उचाई (से.मि.)</Label>
            <Input
              id="height"
              type="number"
              step="0.1"
              value={data.height}
              onChange={(e) => onUpdate({ height: e.target.value })}
              placeholder="0.0"
            />
          </div>
        </div>

        {/* Health Conditions */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            हालको स्वास्थ्य अवस्था | Current Health Conditions
          </Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {commonHealthConditions.map((condition) => (
              <div key={condition.id} className="flex items-center space-x-2">
                <Checkbox
                  id={condition.id}
                  checked={data.healthConditions?.includes(condition.id) || false}
                  onCheckedChange={(checked) => handleHealthConditionChange(condition.id, checked as boolean)}
                />
                <Label htmlFor={condition.id} className="cursor-pointer text-sm">
                  {condition.label}
                </Label>
              </div>
            ))}
          </div>
          {errors.healthConditions && (
            <p className="text-red-500 text-sm flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.healthConditions}
            </p>
          )}
        </div>

        {/* Contraindication Warning */}
        {hasContraindications && (
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>चेतावनी:</strong> ज्वरो, झाडापखाला वा वान्ता भएको बेलामा स्वर्णबिन्दु प्राशन दिनु हुँदैन। पहिले यी समस्याहरू निको
              पारेर मात्र दिनुहोस्।
            </AlertDescription>
          </Alert>
        )}

        {/* Allergies */}
        <div className="space-y-2">
          <Label htmlFor="allergies">एलर्जी (यदि छ भने)</Label>
          <Textarea
            id="allergies"
            value={data.allergies}
            onChange={(e) => onUpdate({ allergies: e.target.value })}
            placeholder="कुनै एलर्जी छ भने लेख्नुहोस्..."
            rows={2}
          />
        </div>

        {/* Vaccination Status */}
        <div className="space-y-2">
          <Label htmlFor="vaccinationStatus">खोप स्थिति</Label>
          <Select value={data.vaccinationStatus} onValueChange={(value) => onUpdate({ vaccinationStatus: value })}>
            <SelectTrigger>
              <SelectValue placeholder="खोप स्थिति छान्नुहोस्" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="complete">पूर्ण</SelectItem>
              <SelectItem value="partial">आंशिक</SelectItem>
              <SelectItem value="none">छैन</SelectItem>
              <SelectItem value="unknown">थाहा छैन</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onPrev}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            पछाडि
          </Button>
          <Button onClick={handleNext} disabled={hasContraindications}>
            अर्को चरण | Next Step
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
