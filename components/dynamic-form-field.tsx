"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Info } from "lucide-react"

interface Question {
  id: string
  label: string
  labelEn?: string
  type: string
  required: boolean
  placeholder?: string
  options?: Array<{ value: string; label: string; labelEn?: string }>
  validation?: {
    min?: number
    max?: number
    pattern?: string
    message?: string
  }
}

interface DynamicFormFieldProps {
  question: Question
  value: any
  onChange: (value: any) => void
  error?: string
}

export function DynamicFormField({ question, value, onChange, error }: DynamicFormFieldProps) {
  const handleCheckboxChange = (optionValue: string, checked: boolean) => {
    const currentValues = Array.isArray(value) ? value : []
    let newValues

    if (checked) {
      newValues = [...currentValues, optionValue]
    } else {
      newValues = currentValues.filter((v: string) => v !== optionValue)
    }

    onChange(newValues)
  }

  const calculateAge = (birthDate: string) => {
    if (!birthDate) return ""

    const birth = new Date(birthDate)
    const today = new Date()
    const ageInMonths = (today.getFullYear() - birth.getFullYear()) * 12 + (today.getMonth() - birth.getMonth())

    if (ageInMonths < 12) {
      return `${ageInMonths} महिना`
    } else {
      const years = Math.floor(ageInMonths / 12)
      const months = ageInMonths % 12
      return months > 0 ? `${years} वर्ष ${months} महिना` : `${years} वर्ष`
    }
  }

  const fieldValue = value || (question.type === "checkbox" ? [] : "")

  return (
    <div className="space-y-2">
      <Label htmlFor={question.id} className={error ? "text-red-600" : ""}>
        {question.label}
        {question.labelEn && <span className="text-gray-500 ml-2">| {question.labelEn}</span>}
        {question.required && <span className="text-red-500 ml-1">*</span>}
      </Label>

      {question.type === "text" && (
        <Input
          id={question.id}
          type="text"
          value={fieldValue}
          onChange={(e) => onChange(e.target.value)}
          placeholder={question.placeholder}
          className={error ? "border-red-500" : ""}
        />
      )}

      {question.type === "number" && (
        <Input
          id={question.id}
          type="number"
          value={fieldValue}
          onChange={(e) => onChange(e.target.value)}
          placeholder={question.placeholder}
          min={question.validation?.min}
          max={question.validation?.max}
          className={error ? "border-red-500" : ""}
        />
      )}

      {question.type === "date" && (
        <div className="space-y-2">
          <Input
            id={question.id}
            type="date"
            value={fieldValue}
            onChange={(e) => onChange(e.target.value)}
            className={error ? "border-red-500" : ""}
          />
          {question.id === "birth_date" && fieldValue && (
            <div className="text-sm text-blue-600 bg-blue-50 p-2 rounded">
              <Info className="h-4 w-4 inline mr-1" />
              उमेर: {calculateAge(fieldValue)} | Age: {calculateAge(fieldValue)}
            </div>
          )}
        </div>
      )}

      {question.type === "textarea" && (
        <Textarea
          id={question.id}
          value={fieldValue}
          onChange={(e) => onChange(e.target.value)}
          placeholder={question.placeholder}
          rows={3}
          className={error ? "border-red-500" : ""}
        />
      )}

      {question.type === "select" && (
        <Select value={fieldValue} onValueChange={onChange}>
          <SelectTrigger className={error ? "border-red-500" : ""}>
            <SelectValue placeholder={`${question.label} छान्नुहोस्`} />
          </SelectTrigger>
          <SelectContent>
            {question.options?.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
                {option.labelEn && <span className="text-gray-500 ml-2">| {option.labelEn}</span>}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {question.type === "radio" && (
        <RadioGroup value={fieldValue} onValueChange={onChange}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {question.options?.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={`${question.id}-${option.value}`} />
                <Label htmlFor={`${question.id}-${option.value}`} className="cursor-pointer">
                  {option.label}
                  {option.labelEn && <span className="text-gray-500 ml-2">| {option.labelEn}</span>}
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>
      )}

      {question.type === "checkbox" && (
        <div className="space-y-2">
          {question.options?.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <Checkbox
                id={`${question.id}-${option.value}`}
                checked={Array.isArray(fieldValue) && fieldValue.includes(option.value)}
                onCheckedChange={(checked) => handleCheckboxChange(option.value, checked as boolean)}
              />
              <Label htmlFor={`${question.id}-${option.value}`} className="cursor-pointer">
                {option.label}
                {option.labelEn && <span className="text-gray-500 ml-2">| {option.labelEn}</span>}
              </Label>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-red-600 text-sm">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      {/* Health condition warnings */}
      {question.id === "health_conditions" && Array.isArray(fieldValue) && fieldValue.includes("fever") && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>चेतावनी:</strong> ज्वरो भएको बेलामा स्वर्णबिन्दु प्राशन दिनु हुँदैन। पहिले ज्वरो निको पारेर मात्र दिनुहोस्।
          </AlertDescription>
        </Alert>
      )}

      {question.id === "health_conditions" &&
        Array.isArray(fieldValue) &&
        (fieldValue.includes("diarrhea") || fieldValue.includes("vomiting")) && (
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>चेतावनी:</strong> झाडापखाला वा वान्ता भएको बेलामा स्वर्णबिन्दु प्राशन दिनु हुँदैन।
            </AlertDescription>
          </Alert>
        )}
    </div>
  )
}
