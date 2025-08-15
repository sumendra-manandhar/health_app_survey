"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { QRCodeSVG } from "qrcode.react"
import { Download, PrinterIcon as Print, Share2, User, Calendar, Phone, MapPin, Activity, Droplets } from "lucide-react"
import type { RegistrationData } from "@/app/register/page"

interface PatientCardProps {
  data: RegistrationData
  registrationId: string
}

export function PatientCard({ data, registrationId }: PatientCardProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("ne-NP")
  }

  const getGenderDisplay = (gender: string) => {
    switch (gender) {
      case "male":
        return "पुरुष"
      case "female":
        return "महिला"
      default:
        return gender
    }
  }

  const getReactionDisplay = (reaction: string) => {
    switch (reaction) {
      case "normal":
        return "सामान्य"
      case "adverse":
        return "प्रतिक्रिया"
      default:
        return reaction
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    // Create a downloadable version
    const element = document.createElement("a")
    const file = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    element.href = URL.createObjectURL(file)
    element.download = `swarnabindu-${data.serial_no}.json`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const qrData = JSON.stringify({
    id: registrationId,
    serial: data.serial_no,
    name: data.child_name,
    date: data.date,
  })

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Main Patient Card */}
      <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">स्वर्णबिन्दु प्राशन कार्ड</CardTitle>
              <p className="text-blue-100">Swarnabindu Prashan Card</p>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold">{data.serial_no}</div>
              <div className="text-sm text-blue-100">सिरियल नम्बर</div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Patient Information */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <User className="h-5 w-5" />
                  बालकको जानकारी
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-600">नाम:</span>
                    <p className="text-lg font-semibold text-gray-900">{data.child_name}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">जन्म मिति:</span>
                    <p className="text-lg text-gray-900">{formatDate(data.birth_date)}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">उमेर:</span>
                    <p className="text-lg text-gray-900">{data.age}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">लिङ्ग:</span>
                    <Badge variant="outline" className="text-sm">
                      {getGenderDisplay(data.gender)}
                    </Badge>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Guardian Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  अभिभावकको जानकारी
                </h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium text-gray-600">नाम:</span>
                    <p className="text-lg text-gray-900">{data.guardian_name}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">ठेगाना:</span>
                    <p className="text-gray-900">{data.guardian_address}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">सम्पर्क:</span>
                    <p className="text-gray-900 flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      {data.contact_number}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Dose Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Droplets className="h-5 w-5" />
                  स्वर्णप्राशन विवरण
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-600">मात्रा:</span>
                    <p className="text-lg font-semibold text-blue-600">{data.dose_amount} थोपा</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">समय:</span>
                    <p className="text-gray-900">{data.dose_time}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">सेवन गराउने:</span>
                    <p className="text-gray-900">{data.administered_by}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">प्रतिक्रिया:</span>
                    <Badge variant={data.child_reaction === "normal" ? "default" : "destructive"}>
                      {getReactionDisplay(data.child_reaction)}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Physical Measurements */}
              {data.weight && (
                <>
                  <Separator />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      शारीरिक मापदण्ड
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <span className="text-sm font-medium text-gray-600">तौल:</span>
                        <p className="text-lg font-semibold text-gray-900">{data.weight} कि.ग्रा.</p>
                      </div>
                      {data.height > 0 && (
                        <div>
                          <span className="text-sm font-medium text-gray-600">उचाई:</span>
                          <p className="text-gray-900">{data.height} से.मि.</p>
                        </div>
                      )}
                      {data.muac > 0 && (
                        <div>
                          <span className="text-sm font-medium text-gray-600">MUAC:</span>
                          <p className="text-gray-900">{data.muac} से.मि.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* QR Code and Actions */}
            <div className="space-y-6">
              <div className="text-center">
                <div className="bg-white p-4 rounded-lg border-2 border-gray-200 inline-block">
                  <QRCodeSVG value={qrData} size={150} />
                </div>
                <p className="text-sm text-gray-600 mt-2">QR कोड स्क्यान गर्नुहोस्</p>
              </div>

              <div className="space-y-3">
                <Button onClick={handlePrint} className="w-full bg-transparent" variant="outline">
                  <Print className="h-4 w-4 mr-2" />
                  प्रिन्ट गर्नुहोस्
                </Button>
                <Button onClick={handleDownload} className="w-full bg-transparent" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  डाउनलोड गर्नुहोस्
                </Button>
                <Button className="w-full bg-transparent" variant="outline">
                  <Share2 className="h-4 w-4 mr-2" />
                  साझा गर्नुहोस्
                </Button>
              </div>

              <div className="text-center text-sm text-gray-500">
                <div className="flex items-center gap-2 justify-center">
                  <Calendar className="h-4 w-4" />
                  दर्ता मिति: {formatDate(data.date || "")}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Important Notes */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="p-6">
          <h3 className="font-semibold text-yellow-800 mb-3">महत्वपूर्ण सूचनाहरू:</h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• यो कार्ड सधैं सुरक्षित राख्नुहोस्</li>
            <li>• अर्को मात्रा पुष्य नक्षत्रमा मात्र दिनुहोस्</li>
            <li>• कुनै समस्या भएमा तुरुन्त चिकित्सकसँग सम्पर्क गर्नुहोस्</li>
            <li>• नियमित स्वास्थ्य जाँच गराउनुहोस्</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
