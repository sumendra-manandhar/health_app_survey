import { questionConfig } from "./question-config"

interface ValidationResult {
  isValid: boolean
  errors: Record<string, string>
}

export class QuestionLoader {
  private static questions = questionConfig

  static async loadQuestions(): Promise<void> {
    // Questions are already loaded from config
    return Promise.resolve()
  }

  static getAllSteps() {
    return this.questions.map((step) => ({
      stepId: step.id,
      title: step.title,
      description: step.description,
    }))
  }

  static getStepQuestions(stepId: string) {
    const step = this.questions.find((s) => s.id === stepId)
    return step ? step.questions : []
  }

  static getDefaultValues(stepId: string): Record<string, any> {
    const questions = this.getStepQuestions(stepId)
    const defaults: Record<string, any> = {}

    questions.forEach((question) => {
      if (question.type === "radio" && question.options && question.options.length > 0) {
        // Don't set default for radio buttons
      } else if (question.type === "select" && question.options && question.options.length > 0) {
        // Don't set default for select
      } else {
        defaults[question.id] = ""
      }
    })

    return defaults
  }

  static validateFormData(stepId: string, formData: Record<string, any>): ValidationResult {
    const questions = this.getStepQuestions(stepId)
    const errors: Record<string, string> = {}

    questions.forEach((question) => {
      const value = formData[question.id]

      // Check required fields
      if (question.required && (!value || value.toString().trim() === "")) {
        errors[question.id] = `${question.label} आवश्यक छ`
        return
      }

      // Skip validation if field is empty and not required
      if (!value || value.toString().trim() === "") {
        return
      }

      // Validate based on type and rules
      if (question.validation) {
        const { min, max, pattern, message } = question.validation

        if (question.type === "number") {
          const numValue = Number.parseFloat(value)
          if (isNaN(numValue)) {
            errors[question.id] = "मान्य संख्या प्रविष्ट गर्नुहोस्"
          } else if (min !== undefined && numValue < min) {
            errors[question.id] = `न्यूनतम मान ${min} हुनुपर्छ`
          } else if (max !== undefined && numValue > max) {
            errors[question.id] = `अधिकतम मान ${max} हुनुपर्छ`
          }
        }

        if (pattern && !new RegExp(pattern).test(value.toString())) {
          errors[question.id] = message || "गलत ढाँचा"
        }

        if (question.type === "text" && typeof value === "string") {
          if (min !== undefined && value.length < min) {
            errors[question.id] = `कम्तिमा ${min} अक्षर चाहिन्छ`
          }
          if (max !== undefined && value.length > max) {
            errors[question.id] = `अधिकतम ${max} अक्षर मात्र अनुमति छ`
          }
        }
      }
    })

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    }
  }
}
