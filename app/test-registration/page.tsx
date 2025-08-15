"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Play, CheckCircle, AlertCircle, User, FileText, Award, ArrowRight, Home, X } from "lucide-react"
import Link from "next/link"
import { PatientCard } from "@/components/patient-card"
import { CertificateGenerator, generateCertificateData } from "@/components/certificate-generator"

interface TestStep {
  id: string
  title: string
  description: string
  status: "pending" | "running" | "completed" | "error"
  result?: any
  error?: string
}

export default function TestRegistrationPage() {
  const [testSteps, setTestSteps] = useState<TestStep[]>([
    {
      id: "step1",
      title: "बालकको जानकारी भर्नुहोस् | Fill Child Information",
      description: "नाम, जन्म मिति, लिङ्ग र अभिभावकको जानकारी",
      status: "pending",
    },
    {
      id: "step2",
      title: "सम्पर्क र ठेगाना | Contact & Address",
      description: "फोन नम्बर, ठेगाना र सामाजिक जानकारी",
      status: "pending",
    },
    {
      id: "step3",
      title: "स्वास्थ्य जानकारी | Health Information",
      description: "खोप स्थिति, एलर्जी र स्वास्थ्य इतिहास",
      status: "pending",
    },
    {
      id: "validation",
      title: "डाटा प्रमाणीकरण | Data Validation",
      description: "सबै जानकारी जाँच र प्रमाणीकरण",
      status: "pending",
    },
    {
      id: "registration",
      title: "दर्ता सम्पन्न | Complete Registration",
      description: "डाटाबेसमा सुरक्षित र QR कोड उत्पादन",
      status: "pending",
    },
    {
      id: "screening",
      title: "स्वर्णबिन्दु प्राशन | Swarnabindu Prashan",
      description: "पहिलो खुराक र स्क्रिनिङ रेकर्ड",
      status: "pending",
    },
    {
      id: "certificate",
      title: "प्रमाणपत्र उत्पादन | Certificate Generation",
      description: "आधिकारिक प्रमाणपत्र तयार गर्नुहोस्",
      status: "pending",
    },
  ])

  const [currentStep, setCurrentStep] = useState(0)
  const [testData, setTestData] = useState<any>({})
  const [showPatientCard, setShowPatientCard] = useState(false)
  const [showCertificate, setShowCertificate] = useState(false)
  const [isRunning, setIsRunning] = useState(false)

  // Sample test data
  const sampleData = {
    serial_no: "TEST001",
    child_name: "परीक्षण बालक",
    gender: "male",
    birth_date: "2023-06-15", // 8 months old
    father_name: "परीक्षण बुबा",
    mother_name: "परीक्षण आमा",
    contact_number: "9800000000",
    district: "काठमाडौं",
    municipality: "काठमाडौं महानगरपालिका",
    ward_no: "1",
    tole: "परीक्षण टोल",
    caste: "परीक्षण",
    religion: "hindu",
    vaccination_status: "complete",
    allergies: "छैन",
    health_history: "सामान्य स्वास्थ्य अवस्था",
    current_medication: "छैन",
    health_conditions: ["none"],
  }

  const updateStepStatus = (stepId: string, status: TestStep["status"], result?: any, error?: string) => {
    setTestSteps((prev) => prev.map((step) => (step.id === stepId ? { ...step, status, result, error } : step)))
  }

  const runTest = async () => {
    setIsRunning(true)
    setCurrentStep(0)

    try {
      // Step 1: Fill child information
      updateStepStatus("step1", "running")
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const step1Data = {
        serial_no: sampleData.serial_no,
        child_name: sampleData.child_name,
        gender: sampleData.gender,
        birth_date: sampleData.birth_date,
        father_name: sampleData.father_name,
        mother_name: sampleData.mother_name,
      }

      setTestData((prev) => ({ ...prev, ...step1Data }))
      updateStepStatus("step1", "completed", step1Data)
      setCurrentStep(1)

      // Step 2: Contact & Address
      updateStepStatus("step2", "running")
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const step2Data = {
        contact_number: sampleData.contact_number,
        district: sampleData.district,
        municipality: sampleData.municipality,
        ward_no: sampleData.ward_no,
        tole: sampleData.tole,
        caste: sampleData.caste,
        religion: sampleData.religion,
      }

      setTestData((prev) => ({ ...prev, ...step2Data }))
      updateStepStatus("step2", "completed", step2Data)
      setCurrentStep(2)

      // Step 3: Health Information
      updateStepStatus("step3", "running")
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const step3Data = {
        vaccination_status: sampleData.vaccination_status,
        allergies: sampleData.allergies,
        health_history: sampleData.health_history,
        current_medication: sampleData.current_medication,
        health_conditions: sampleData.health_conditions,
      }

      setTestData((prev) => ({ ...prev, ...step3Data }))
      updateStepStatus("step3", "completed", step3Data)
      setCurrentStep(3)

      // Step 4: Validation
      updateStepStatus("validation", "running")
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const fullData = { ...testData, ...step1Data, ...step2Data, ...step3Data }

      // Check age eligibility
      const birthDate = new Date(fullData.birth_date)
      const today = new Date()
      const ageInMonths =
        (today.getFullYear() - birthDate.getFullYear()) * 12 + (today.getMonth() - birthDate.getMonth())

      if (ageInMonths < 6 || ageInMonths > 60) {
        updateStepStatus("validation", "error", null, "उमेर योग्यता पूरा भएन")
        setIsRunning(false)
        return
      }

      updateStepStatus("validation", "completed", { ageInMonths, eligible: true })
      setCurrentStep(4)

      // Step 5: Registration
      updateStepStatus("registration", "running")
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const registrationId = `test_${Date.now()}`
      const registrationResult = {
        id: registrationId,
        qrCode: `QR_${registrationId}`,
        timestamp: new Date().toISOString(),
      }

      setTestData((prev) => ({ ...prev, registrationId }))
      updateStepStatus("registration", "completed", registrationResult)
      setCurrentStep(5)

      // Step 6: Screening
      updateStepStatus("screening", "running")
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const screeningData = {
        screening_date: new Date().toISOString().split("T")[0],
        screening_type: "first-time",
        swarnabindu_date: new Date().toISOString().split("T")[0],
        doses_given: 1,
        dose_amount: "1 थोपा", // For 8 months old
        health_issues: "",
        referral_status: "not-required",
        next_steps: "एक महिना पछि दोस्रो खुराक",
        batch_number: `SB001-${new Date().toISOString().split("T")[0].replace(/-/g, "")}`,
        administered_by: "डा. परीक्षण चिकित्सक",
      }

      setTestData((prev) => ({ ...prev, screening: screeningData }))
      updateStepStatus("screening", "completed", screeningData)
      setCurrentStep(6)

      // Step 7: Certificate
      updateStepStatus("certificate", "running")
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const certificateData = generateCertificateData(fullData, [screeningData])

      updateStepStatus("certificate", "completed", certificateData)
      setCurrentStep(7)
    } catch (error) {
      console.error("Test error:", error)
      updateStepStatus(testSteps[currentStep]?.id || "unknown", "error", null, "परीक्षणमा त्रुटि भयो")
    } finally {
      setIsRunning(false)
    }
  }

  const getStatusIcon = (status: TestStep["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "running":
        return <div className="h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-600" />
      default:
        return <div className="h-5 w-5 border-2 border-gray-300 rounded-full" />
    }
  }

  const getStatusColor = (status: TestStep["status"]) => {
    switch (status) {
      case "completed":
        return "border-green-200 bg-green-50"
      case "running":
        return "border-blue-200 bg-blue-50"
      case "error":
        return "border-red-200 bg-red-50"
      default:
        return "border-gray-200 bg-gray-50"
    }
  }

  const completedSteps = testSteps.filter((step) => step.status === "completed").length
  const totalSteps = testSteps.length
  const progress = (completedSteps / totalSteps) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">दर्ता प्रक्रिया परीक्षण | Registration Process Test</h1>
            <p className="text-gray-600">सम्पूर्ण दर्ता प्रक्रियादेखि प्रमाणपत्र उत्पादनसम्मको परीक्षण</p>
          </div>
          <Link href="/">
            <Button variant="outline">
              <Home className="h-4 w-4 mr-2" />
              होम पेज
            </Button>
          </Link>
        </div>

        {/* Progress */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium">
                प्रगति: {completedSteps} / {totalSteps} चरणहरू सम्पन्न
              </span>
              <span className="text-sm text-gray-600">{Math.round(progress)}% पूर्ण</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Test Steps */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">परीक्षण चरणहरू | Test Steps</h2>
              <Button onClick={runTest} disabled={isRunning} className="bg-green-600 hover:bg-green-700">
                <Play className="h-4 w-4 mr-2" />
                {isRunning ? "परीक्षण चलिरहेको छ..." : "परीक्षण सुरु गर्नुहोस्"}
              </Button>
            </div>

            {testSteps.map((step, index) => (
              <Card key={step.id} className={`border-2 ${getStatusColor(step.status)}`}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">{getStatusIcon(step.status)}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline">चरण {index + 1}</Badge>
                        <h3 className="font-semibold">{step.title}</h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{step.description}</p>

                      {step.status === "completed" && step.result && (
                        <div className="text-xs bg-white p-2 rounded border">
                          <strong>परिणाम:</strong> {JSON.stringify(step.result, null, 2)}
                        </div>
                      )}

                      {step.status === "error" && step.error && (
                        <Alert className="mt-2">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>{step.error}</AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Results Panel */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">परीक्षण परिणाम | Test Results</h2>

            {/* Test Data Summary */}
            {Object.keys(testData).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    डाटा सारांश | Data Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    {testData.child_name && (
                      <div className="flex justify-between">
                        <span className="font-medium">बालकको नाम:</span>
                        <span>{testData.child_name}</span>
                      </div>
                    )}
                    {testData.birth_date && (
                      <div className="flex justify-between">
                        <span className="font-medium">जन्म मिति:</span>
                        <span>{new Date(testData.birth_date).toLocaleDateString("ne-NP")}</span>
                      </div>
                    )}
                    {testData.contact_number && (
                      <div className="flex justify-between">
                        <span className="font-medium">सम्पर्क:</span>
                        <span>{testData.contact_number}</span>
                      </div>
                    )}
                    {testData.registrationId && (
                      <div className="flex justify-between">
                        <span className="font-medium">दर्ता ID:</span>
                        <span className="font-mono text-xs">{testData.registrationId}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            {testSteps.find((s) => s.id === "registration")?.status === "completed" && (
              <div className="space-y-4">
                <Button onClick={() => setShowPatientCard(true)} className="w-full" variant="outline">
                  <User className="h-4 w-4 mr-2" />
                  बिरामी कार्ड हेर्नुहोस् | View Patient Card
                </Button>

                {testSteps.find((s) => s.id === "certificate")?.status === "completed" && (
                  <Button onClick={() => setShowCertificate(true)} className="w-full bg-yellow-600 hover:bg-yellow-700">
                    <Award className="h-4 w-4 mr-2" />
                    प्रमाणपत्र हेर्नुहोस् | View Certificate
                  </Button>
                )}
              </div>
            )}

            {/* Test Summary */}
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-800">परीक्षण सारांश | Test Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {testSteps.filter((s) => s.status === "completed").length}
                    </div>
                    <div className="text-sm text-green-700">सफल</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-red-600">
                      {testSteps.filter((s) => s.status === "error").length}
                    </div>
                    <div className="text-sm text-red-700">असफल</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-600">
                      {testSteps.filter((s) => s.status === "pending").length}
                    </div>
                    <div className="text-sm text-gray-700">बाँकी</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Next Steps */}
            {completedSteps === totalSteps && (
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-green-800 mb-2">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-semibold">परीक्षण सफल!</span>
                  </div>
                  <p className="text-sm text-green-700 mb-4">
                    सम्पूर्ण दर्ता प्रक्रिया सफलतापूर्वक सम्पन्न भयो। अब तपाईं वास्तविक दर्ता सुरु गर्न सक्नुहुन्छ।
                  </p>
                  <Link href="/register">
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      वास्तविक दर्ता सुरु गर्नुहोस्
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Patient Card Modal */}
      {showPatientCard && testData.registrationId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold">बिरामी कार्ड | Patient Card</h3>
              <Button variant="ghost" onClick={() => setShowPatientCard(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-4">
              <PatientCard data={testData} registrationId={testData.registrationId} />
            </div>
          </div>
        </div>
      )}

      {/* Certificate Modal */}
      {showCertificate && testSteps.find((s) => s.id === "certificate")?.result && (
        <CertificateGenerator
          data={testSteps.find((s) => s.id === "certificate")?.result}
          onClose={() => setShowCertificate(false)}
        />
      )}
    </div>
  )
}
