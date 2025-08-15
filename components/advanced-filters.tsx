"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { X, Filter, RotateCcw } from "lucide-react"

interface FilterOptions {
  ageRange: { min: number; max: number }
  gender: string[]
  districts: string[]
  healthStatus: string[]
  screeningStatus: string[]
  dateRange: { from: string; to: string }
}

interface AdvancedFiltersProps {
  isOpen: boolean
  onClose: () => void
  onApplyFilters: (filters: FilterOptions) => void
  onClearFilters: () => void
}

export function AdvancedFilters({ isOpen, onClose, onApplyFilters, onClearFilters }: AdvancedFiltersProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    ageRange: { min: 0, max: 18 },
    gender: [],
    districts: [],
    healthStatus: [],
    screeningStatus: [],
    dateRange: { from: "", to: "" },
  })

  const [activeFiltersCount, setActiveFiltersCount] = useState(0)

  const districts = ["काठमाडौं", "काभ्रेपलाञ्चोक", "कास्की", "सिरहा", "सोलुखुम्बु", "चितवन", "मोरङ", "सुनसरी", "धनुषा", "पर्सा"]

  const healthStatuses = [
    { value: "normal", label: "सामान्य | Normal" },
    { value: "referred", label: "रेफर गरिएको | Referred" },
    { value: "pending", label: "स्क्रिनिङ बाँकी | Pending" },
  ]

  const screeningStatuses = [
    { value: "completed", label: "सम्पन्न | Completed" },
    { value: "pending", label: "बाँकी | Pending" },
    { value: "overdue", label: "ढिलो | Overdue" },
  ]

  const handleGenderChange = (gender: string, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      gender: checked ? [...prev.gender, gender] : prev.gender.filter((g) => g !== gender),
    }))
  }

  const handleDistrictChange = (district: string, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      districts: checked ? [...prev.districts, district] : prev.districts.filter((d) => d !== district),
    }))
  }

  const handleHealthStatusChange = (status: string, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      healthStatus: checked ? [...prev.healthStatus, status] : prev.healthStatus.filter((s) => s !== status),
    }))
  }

  const handleScreeningStatusChange = (status: string, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      screeningStatus: checked ? [...prev.screeningStatus, status] : prev.screeningStatus.filter((s) => s !== status),
    }))
  }

  const handleApplyFilters = () => {
    // Count active filters
    let count = 0
    if (filters.gender.length > 0) count++
    if (filters.districts.length > 0) count++
    if (filters.healthStatus.length > 0) count++
    if (filters.screeningStatus.length > 0) count++
    if (filters.dateRange.from || filters.dateRange.to) count++
    if (filters.ageRange.min > 0 || filters.ageRange.max < 18) count++

    setActiveFiltersCount(count)
    onApplyFilters(filters)
    onClose()
  }

  const handleClearFilters = () => {
    const clearedFilters = {
      ageRange: { min: 0, max: 18 },
      gender: [],
      districts: [],
      healthStatus: [],
      screeningStatus: [],
      dateRange: { from: "", to: "" },
    }
    setFilters(clearedFilters)
    setActiveFiltersCount(0)
    onClearFilters()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto m-4">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              उन्नत फिल्टर | Advanced Filters
              {activeFiltersCount > 0 && <Badge variant="secondary">{activeFiltersCount} सक्रिय</Badge>}
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Age Range */}
          <div className="space-y-3">
            <Label className="text-base font-medium">उमेर दायरा | Age Range</Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="minAge">न्यूनतम उमेर | Min Age</Label>
                <Input
                  id="minAge"
                  type="number"
                  min="0"
                  max="18"
                  value={filters.ageRange.min}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      ageRange: { ...prev.ageRange, min: Number.parseInt(e.target.value) || 0 },
                    }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="maxAge">अधिकतम उमेर | Max Age</Label>
                <Input
                  id="maxAge"
                  type="number"
                  min="0"
                  max="18"
                  value={filters.ageRange.max}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      ageRange: { ...prev.ageRange, max: Number.parseInt(e.target.value) || 18 },
                    }))
                  }
                />
              </div>
            </div>
          </div>

          {/* Gender */}
          <div className="space-y-3">
            <Label className="text-base font-medium">लिङ्ग | Gender</Label>
            <div className="flex gap-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="male"
                  checked={filters.gender.includes("male")}
                  onCheckedChange={(checked) => handleGenderChange("male", checked as boolean)}
                />
                <Label htmlFor="male">पुरुष | Male</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="female"
                  checked={filters.gender.includes("female")}
                  onCheckedChange={(checked) => handleGenderChange("female", checked as boolean)}
                />
                <Label htmlFor="female">महिला | Female</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="other"
                  checked={filters.gender.includes("other")}
                  onCheckedChange={(checked) => handleGenderChange("other", checked as boolean)}
                />
                <Label htmlFor="other">अन्य | Other</Label>
              </div>
            </div>
          </div>

          {/* Districts */}
          <div className="space-y-3">
            <Label className="text-base font-medium">जिल्लाहरू | Districts</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {districts.map((district) => (
                <div key={district} className="flex items-center space-x-2">
                  <Checkbox
                    id={district}
                    checked={filters.districts.includes(district)}
                    onCheckedChange={(checked) => handleDistrictChange(district, checked as boolean)}
                  />
                  <Label htmlFor={district} className="text-sm">
                    {district}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Health Status */}
          <div className="space-y-3">
            <Label className="text-base font-medium">स्वास्थ्य स्थिति | Health Status</Label>
            <div className="space-y-2">
              {healthStatuses.map((status) => (
                <div key={status.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={status.value}
                    checked={filters.healthStatus.includes(status.value)}
                    onCheckedChange={(checked) => handleHealthStatusChange(status.value, checked as boolean)}
                  />
                  <Label htmlFor={status.value}>{status.label}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div className="space-y-3">
            <Label className="text-base font-medium">दर्ता मिति दायरा | Registration Date Range</Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fromDate">देखि | From</Label>
                <Input
                  id="fromDate"
                  type="date"
                  value={filters.dateRange.from}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      dateRange: { ...prev.dateRange, from: e.target.value },
                    }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="toDate">सम्म | To</Label>
                <Input
                  id="toDate"
                  type="date"
                  value={filters.dateRange.to}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      dateRange: { ...prev.dateRange, to: e.target.value },
                    }))
                  }
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6 border-t">
            <Button onClick={handleClearFilters} variant="outline" className="flex-1 bg-transparent">
              <RotateCcw className="h-4 w-4 mr-2" />
              सफा गर्नुहोस् | Clear All
            </Button>
            <Button onClick={handleApplyFilters} className="flex-1">
              <Filter className="h-4 w-4 mr-2" />
              फिल्टर लागू गर्नुहोस् | Apply Filters
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
