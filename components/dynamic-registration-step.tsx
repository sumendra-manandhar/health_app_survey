"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { QuestionLoader } from "@/lib/question-loader"
import { AlertCircle, Info, CheckCircle } from "lucide-react"

interface DynamicRegistrationStepProps {
  stepId: string
  data: Record<string, any>
  setData: (data: Record<string, any>) => void
  errors: Record<string, string>
}

export function DynamicRegistrationStep({ stepId, data, setData, errors }: DynamicRegistrationStepProps) {
  const questions = QuestionLoader.getStepQuestions(stepId)

  const handleChange = (questionId: string, value: any) => {
    const newData = { ...data, [questionId]: value }

    // Auto-calculate age when birth_date changes
    if (questionId === "birth_date" && value) {
      const birthDate = new Date(value)
      const today = new Date()
      const ageInMonths =
        (today.getFullYear() - birthDate.getFullYear()) * 12 + (today.getMonth() - birthDate.getMonth())

      newData.age = calculateAgeDisplay(value)
      newData.child_age_months = ageInMonths

      // Auto-select dose based on age
      if (ageInMonths >= 6 && ageInMonths < 12) {
        newData.dose_amount = "1"
      } else if (ageInMonths >= 12 && ageInMonths < 24) {
        newData.dose_amount = "2"
      } else if (ageInMonths >= 24 && ageInMonths <= 60) {
        newData.dose_amount = "4"
      }
    }

    setData(newData)
  }

  const calculateAgeDisplay = (birthDate: string) => {
    if (!birthDate) return ""

    const birth = new Date(birthDate)
    const today = new Date()
    const ageInMonths = (today.getFullYear() - birth.getFullYear()) * 12 + (today.getMonth() - birth.getMonth())

    if (ageInMonths < 12) {
      return `${ageInMonths} महिना`
    } else {
      const years = Math.floor(ageInMonths / 12)
      const months = ageInMonths % 12
      if (months > 0) {
        return `${years} वर्ष ${months} महिना`
      } else {
        return `${years} वर्ष`
      }
    }
  }

  const shouldShowQuestion = (question: any) => {
    if (!question.conditional) return true

    const dependentValue = data[question.conditional.dependsOn]
    const targetValue = question.conditional.value
    const operator = question.conditional.operator || "equals"

    switch (operator) {
      case "equals":
        return dependentValue === targetValue
      case "not_equals":
        return dependentValue !== targetValue
      default:
        return true
    }
  }

  const renderQuestion = (question: any) => {
    if (!shouldShowQuestion(question)) return null

    const hasError = errors[question.id]
    const value = data[question.id] || ""

    return (
      <div key={question.id} className="space-y-2">
        <Label htmlFor={question.id} className="text-sm font-medium text-gray-700">
          {question.label}
          {question.required && <span className="text-red-500 ml-1">*</span>}
          {!question.required && <span className="text-gray-400 text-xs ml-1">(वैकल्पिक)</span>}
        </Label>

        {question.type === "text" && (
          <Input
            id={question.id}
            type="text"
            value={value}
            onChange={(e) => handleChange(question.id, e.target.value)}
            placeholder={question.placeholder}
            className={`${hasError ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-blue-500"}`}
          />
        )}

        {question.type === "number" && (
          <Input
            id={question.id}
            type="number"
            value={value}
            onChange={(e) => handleChange(question.id, Number.parseFloat(e.target.value) || "")}
            placeholder={question.placeholder}
            min={question.validation?.min}
            max={question.validation?.max}
            step="0.1"
            className={`${hasError ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-blue-500"}`}
          />
        )}

        {question.type === "date" && (
          <div className="space-y-2">
            <Input
              id={question.id}
              type="date"
              value={value}
              onChange={(e) => handleChange(question.id, e.target.value)}
              className={`${hasError ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-blue-500"}`}
            />
            {question.id === "birth_date" && value && (
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-md border border-blue-200">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium text-blue-700">उमेर: {calculateAgeDisplay(value)}</span>
                </div>
                <Badge
                  variant={data.child_age_months >= 6 && data.child_age_months <= 60 ? "default" : "destructive"}
                  className="text-xs"
                >
                  {data.child_age_months >= 6 && data.child_age_months <= 60 ? "योग्य" : "अयोग्य"}
                </Badge>
              </div>
            )}
          </div>
        )}

        {question.type === "textarea" && (
          <Textarea
            id={question.id}
            value={value}
            onChange={(e) => handleChange(question.id, e.target.value)}
            placeholder={question.placeholder}
            rows={3}
            className={`${hasError ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-blue-500"}`}
          />
        )}

        {question.type === "select" && (
          <Select value={value} onValueChange={(val) => handleChange(question.id, val)}>
            <SelectTrigger className={`${hasError ? "border-red-500" : "border-gray-300"}`}>
              <SelectValue placeholder="छान्नुहोस्..." />
            </SelectTrigger>
            <SelectContent>
              {question.options?.map((option: any) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {question.type === "radio" && (
          <RadioGroup value={value} onValueChange={(val) => handleChange(question.id, val)} className="space-y-2">
            {question.options?.map((option: any) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={`${question.id}-${option.value}`} />
                <Label htmlFor={`${question.id}-${option.value}`} className="text-sm cursor-pointer">
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        )}

        {hasError && (
          <div className="flex items-center gap-1 text-red-600 text-xs">
            <AlertCircle className="h-3 w-3" />
            <span>{errors[question.id]}</span>
          </div>
        )}

        {/* Dose amount indicator */}
        {question.id === "dose_amount" && value && (
          <div className="p-2 bg-green-50 rounded-md border border-green-200">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium text-green-700">{value} थोपा - उमेर अनुसार सिफारिस</span>
            </div>
          </div>
        )}
      </div>
    )
  }

  if (!questions.length) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-500">प्रश्नहरू लोड गर्दै...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Age eligibility alert */}
      {data.birth_date && data.child_age_months && (
        <Alert
          className={`${
            data.child_age_months >= 6 && data.child_age_months <= 60
              ? "border-green-200 bg-green-50"
              : "border-red-200 bg-red-50"
          }`}
        >
          <Info
            className={`h-4 w-4 ${
              data.child_age_months >= 6 && data.child_age_months <= 60 ? "text-green-600" : "text-red-600"
            }`}
          />
          <AlertDescription
            className={`text-sm ${
              data.child_age_months >= 6 && data.child_age_months <= 60 ? "text-green-800" : "text-red-800"
            }`}
          >
            स्वर्णबिन्दु प्राशन ६ महिनादेखि ५ वर्षसम्मका बालबालिकाका लागि मात्र उपयुक्त छ।
          </AlertDescription>
        </Alert>
      )}

      {/* Optional measurements info */}
      {stepId === "step3" && (
        <Alert className="border-blue-200 bg-blue-50">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800 text-sm">
            <strong>सूचना:</strong> तौल/वजन आवश्यक छ। अन्य मापदण्डहरू वैकल्पिक छन्।
          </AlertDescription>
        </Alert>
      )}

      {/* Questions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{questions.map(renderQuestion)}</div>
    </div>
  )
}
