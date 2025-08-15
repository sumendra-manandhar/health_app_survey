"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User, MapPin, Phone, Activity, FileText, QrCode, Printer, Download } from "lucide-react"
import { useState, useRef, useEffect } from "react"

interface PatientDetailsModalProps {
  patient: any
  isOpen: boolean
  onClose: () => void
}

export function PatientDetailsModal({ patient, isOpen, onClose }: PatientDetailsModalProps) {
  const [showQRCode, setShowQRCode] = useState(false)
  const qrCodeRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (showQRCode && patient) {
      generateQRCode()
    }
  }, [showQRCode, patient])

  const generateQRCode = async () => {
    if (!qrCodeRef.current || !patient) return

    try {
      const QRCode = (await import("qrcode")).default

      const qrData = JSON.stringify({
        id: patient.id,
        name: patient.childName,
        dob: patient.dateOfBirth,
        contact: patient.contactNumber,
        serialNo: patient.serialNo,
        type: "swarnabindu_patient",
      })

      await QRCode.toCanvas(qrCodeRef.current, qrData, {
        width: 200,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      })
    } catch (error) {
      console.error("Error generating QR code:", error)
    }
  }

  const handlePrintReport = () => {
    if (!patient) return

    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Patient Report - ${patient.childName}</title>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
            .section { margin: 20px 0; page-break-inside: avoid; }
            .section-title { font-size: 18px; font-weight: bold; color: #2563eb; margin-bottom: 10px; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
            .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin: 15px 0; }
            .info-item { margin: 8px 0; }
            .label { font-weight: bold; color: #666; }
            .value { margin-top: 3px; }
            .screening-record { border: 1px solid #ddd; padding: 15px; margin: 10px 0; border-radius: 5px; background: #f9f9f9; }
            .badge { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; }
            .badge-normal { background: #dcfce7; color: #166534; }
            .badge-referred { background: #fecaca; color: #991b1b; }
            .badge-pending { background: #fef3c7; color: #92400e; }
            .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #ddd; padding-top: 20px; }
            @media print { body { margin: 0; } .no-print { display: none; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>स्वर्णबिन्दु प्राशन कार्यक्रम</h1>
            <h2>Swarnabindu Prashan Program</h2>
            <h3>बिरामीको विस्तृत रिपोर्ट | Patient Detailed Report</h3>
            <p>मिति: ${new Date().toLocaleDateString("ne-NP")} | Date: ${new Date().toLocaleDateString()}</p>
          </div>

          <div class="section">
            <div class="section-title">आधारभूत जानकारी | Basic Information</div>
            <div class="info-grid">
              <div class="info-item">
                <div class="label">पूरा नाम | Full Name:</div>
                <div class="value">${patient.childName}</div>
              </div>
              <div class="info-item">
                <div class="label">लिङ्ग | Gender:</div>
                <div class="value">${patient.gender === "male" ? "पुरुष | Male" : patient.gender === "female" ? "महिला | Female" : "अन्य | Other"}</div>
              </div>
              <div class="info-item">
                <div class="label">जन्म मिति | Date of Birth:</div>
                <div class="value">${formatDate(patient.dateOfBirth)}</div>
              </div>
              <div class="info-item">
                <div class="label">उमेर | Age:</div>
                <div class="value">${calculateAge(patient.dateOfBirth)} वर्ष</div>
              </div>
              <div class="info-item">
                <div class="label">दर्ता नम्बर | Registration No:</div>
                <div class="value">#${patient.serialNo}</div>
              </div>
              <div class="info-item">
                <div class="label">दर्ता मिति | Registration Date:</div>
                <div class="value">${formatDate(patient.registrationDate)}</div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">पारिवारिक जानकारी | Family Information</div>
            <div class="info-grid">
              <div class="info-item">
                <div class="label">बुबाको नाम | Father's Name:</div>
                <div class="value">${patient.fatherName || "उल्लेख छैन"}</div>
              </div>
              <div class="info-item">
                <div class="label">आमाको नाम | Mother's Name:</div>
                <div class="value">${patient.motherName || "उल्लेख छैन"}</div>
              </div>
              <div class="info-item">
                <div class="label">संरक्षकको नाम | Guardian's Name:</div>
                <div class="value">${patient.guardianName || "उल्लेख छैन"}</div>
              </div>
              <div class="info-item">
                <div class="label">सम्पर्क नम्बर | Contact Number:</div>
                <div class="value">${patient.contactNumber}</div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">ठेगाना र सामाजिक जानकारी | Address & Social Information</div>
            <div class="info-grid">
              <div class="info-item">
                <div class="label">जिल्ला | District:</div>
                <div class="value">${patient.district}</div>
              </div>
              <div class="info-item">
                <div class="label">पालिका | Municipality:</div>
                <div class="value">${patient.palika}</div>
              </div>
              <div class="info-item">
                <div class="label">वडा नं | Ward No:</div>
                <div class="value">${patient.ward}</div>
              </div>
              <div class="info-item">
                <div class="label">टोल | Tole:</div>
                <div class="value">${patient.tole || "उल्लेख छैन"}</div>
              </div>
              <div class="info-item">
                <div class="label">जात | Caste:</div>
                <div class="value">${patient.caste || "उल्लेख छैन"}</div>
              </div>
              <div class="info-item">
                <div class="label">धर्म | Religion:</div>
                <div class="value">${patient.religion || "उल्लेख छैन"}</div>
              </div>
              <div class="info-item">
                <div class="label">जातीयता | Ethnicity:</div>
                <div class="value">${patient.ethnicity || "उल्लेख छैन"}</div>
              </div>
              <div class="info-item">
                <div class="label">भाषा | Language:</div>
                <div class="value">${patient.language || "उल्लेख छैन"}</div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">स्वास्थ्य रेकर्ड | Health Records</div>
            ${
              patient.screenings && patient.screenings.length > 0
                ? patient.screenings
                    .map(
                      (screening: any, index: number) => `
                <div class="screening-record">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <span class="badge ${screening.referralStatus === "referred" ? "badge-referred" : screening.referralStatus === "not-required" ? "badge-normal" : "badge-pending"}">
                      ${screening.screeningType === "first-time" ? "पहिलो पटक" : screening.screeningType === "follow-up" ? "फलोअप" : "नियमित"}
                    </span>
                    <span>${formatDate(screening.screeningDate)}</span>
                  </div>
                  <div class="info-grid">
                    <div class="info-item">
                      <div class="label">खुराक संख्या | Doses Given:</div>
                      <div class="value">${screening.dosesGiven}</div>
                    </div>
                    <div class="info-item">
                      <div class="label">स्वर्णबिन्दु मिति | Swarnabindu Date:</div>
                      <div class="value">${formatDate(screening.swarnabinduDate)}</div>
                    </div>
                    <div class="info-item">
                      <div class="label">रेफरल स्थिति | Referral Status:</div>
                      <div class="value">${screening.referralStatus === "not-required" ? "आवश्यक छैन" : screening.referralStatus === "referred" ? "रेफर गरिएको" : screening.referralStatus === "pending" ? "पेन्डिङ" : "सम्पन्न"}</div>
                    </div>
                  </div>
                  ${
                    screening.healthIssues
                      ? `
                    <div class="info-item" style="margin-top: 10px;">
                      <div class="label">स्वास्थ्य समस्याहरू | Health Issues:</div>
                      <div class="value">${screening.healthIssues}</div>
                    </div>
                  `
                      : ""
                  }
                  ${
                    screening.nextSteps
                      ? `
                    <div class="info-item">
                      <div class="label">अर्को चरणहरू | Next Steps:</div>
                      <div class="value">${screening.nextSteps}</div>
                    </div>
                  `
                      : ""
                  }
                </div>
              `,
                    )
                    .join("")
                : "<p>कुनै स्क्रिनिङ रेकर्ड छैन | No screening records found</p>"
            }
          </div>

          <div class="footer">
            <p>यो रिपोर्ट स्वर्णबिन्दु प्राशन कार्यक्रम व्यवस्थापन प्रणालीबाट उत्पन्न गरिएको हो।</p>
            <p>This report was generated by Swarnabindu Prashan Program Management System.</p>
          </div>
        </body>
      </html>
    `

    printWindow.document.write(htmlContent)
    printWindow.document.close()
    printWindow.print()
  }

  const handleDownloadQR = () => {
    if (!qrCodeRef.current) return

    const canvas = qrCodeRef.current
    const link = document.createElement("a")
    link.download = `patient-qr-${patient.childName.replace(/\s+/g, "-")}.png`
    link.href = canvas.toDataURL()
    link.click()
  }

  const handleNewScreening = () => {
    // Navigate to screening page with patient pre-selected
    window.location.href = `/screening?patientId=${patient.id}`
  }

  if (!patient) return null

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob)
    const today = new Date()
    const age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1
    }
    return age
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("ne-NP")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            बिरामीको विस्तृत जानकारी | Patient Details
          </DialogTitle>
          <DialogDescription>
            {patient.childName} को सम्पूर्ण स्वास्थ्य रेकर्ड | Complete health record of {patient.childName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-4 w-4" />
                आधारभूत जानकारी | Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">पूरा नाम:</span>
                  <p className="font-semibold text-lg">{patient.childName}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">लिङ्ग:</span>
                  <Badge variant="secondary" className="mt-1">
                    {patient.gender === "male"
                      ? "पुरुष | Male"
                      : patient.gender === "female"
                        ? "महिला | Female"
                        : "अन्य | Other"}
                  </Badge>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">जन्म मिति:</span>
                  <p className="font-medium">{formatDate(patient.dateOfBirth)}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">उमेर:</span>
                  <p className="font-medium">{calculateAge(patient.dateOfBirth)} वर्ष</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">दर्ता नम्बर:</span>
                  <Badge variant="outline">#{patient.serialNo}</Badge>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">दर्ता मिति:</span>
                  <p className="font-medium">{formatDate(patient.registrationDate)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Family Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                पारिवारिक जानकारी | Family Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">बुबाको नाम:</span>
                  <p className="font-medium">{patient.fatherName || "उल्लेख छैन"}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">आमाको नाम:</span>
                  <p className="font-medium">{patient.motherName || "उल्लेख छैन"}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">संरक्षकको नाम:</span>
                  <p className="font-medium">{patient.guardianName || "उल्लेख छैन"}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">सम्पर्क नम्बर:</span>
                  <p className="font-medium text-blue-600">{patient.contactNumber}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Address & Social Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                ठेगाना र सामाजिक जानकारी | Address & Social Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">जिल्ला:</span>
                  <p className="font-medium">{patient.district}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">पालिका:</span>
                  <p className="font-medium">{patient.palika}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">वडा नं:</span>
                  <p className="font-medium">{patient.ward}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">टोल:</span>
                  <p className="font-medium">{patient.tole || "उल्लेख छैन"}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">जात:</span>
                  <p className="font-medium">{patient.caste || "उल्लेख छैन"}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">धर्म:</span>
                  <p className="font-medium">{patient.religion || "उल्लेख छैन"}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">जातीयता:</span>
                  <p className="font-medium">{patient.ethnicity || "उल्लेख छैन"}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">भाषा:</span>
                  <p className="font-medium">{patient.language || "उल्लेख छैन"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Health Records */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                स्वास्थ्य रेकर्ड | Health Records
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {patient.screenings && patient.screenings.length > 0 ? (
                  patient.screenings.map((screening: any, index: number) => (
                    <div key={index} className="p-4 border rounded-lg bg-gray-50">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline">
                          {screening.screeningType === "first-time"
                            ? "पहिलो पटक"
                            : screening.screeningType === "follow-up"
                              ? "फलोअप"
                              : "नियमित"}
                        </Badge>
                        <span className="text-sm text-gray-600">{formatDate(screening.screeningDate)}</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium">खुराक संख्या:</span>
                          <p>{screening.dosesGiven}</p>
                        </div>
                        <div>
                          <span className="font-medium">रेफरल स्थिति:</span>
                          <Badge
                            variant={screening.referralStatus === "referred" ? "destructive" : "secondary"}
                            className="ml-1"
                          >
                            {screening.referralStatus === "not-required"
                              ? "आवश्यक छैन"
                              : screening.referralStatus === "referred"
                                ? "रेफर गरिएको"
                                : screening.referralStatus === "pending"
                                  ? "पेन्डिङ"
                                  : "सम्पन्न"}
                          </Badge>
                        </div>
                        <div>
                          <span className="font-medium">स्वर्णबिन्दु मिति:</span>
                          <p>{formatDate(screening.swarnabinduDate)}</p>
                        </div>
                      </div>
                      {screening.healthIssues && (
                        <div className="mt-2">
                          <span className="font-medium text-sm">स्वास्थ्य समस्याहरू:</span>
                          <p className="text-sm text-gray-700 mt-1">{screening.healthIssues}</p>
                        </div>
                      )}
                      {screening.nextSteps && (
                        <div className="mt-2">
                          <span className="font-medium text-sm">अर्को चरणहरू:</span>
                          <p className="text-sm text-gray-700 mt-1">{screening.nextSteps}</p>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                    <p>कुनै स्क्रिनिङ रेकर्ड छैन | No screening records found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* QR Code Section */}
          {showQRCode && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <QrCode className="h-4 w-4" />
                  QR कोड | QR Code
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <canvas ref={qrCodeRef} className="mx-auto border rounded" />
                <div className="mt-4">
                  <Button onClick={handleDownloadQR} variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    QR डाउनलोड | Download QR
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <Button onClick={handleNewScreening} className="flex-1 bg-green-600 hover:bg-green-700">
              <Activity className="h-4 w-4 mr-2" />
              नयाँ स्क्रिनिङ | New Screening
            </Button>
            <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setShowQRCode(!showQRCode)}>
              <QrCode className="h-4 w-4 mr-2" />
              {showQRCode ? "QR लुकाउनुहोस्" : "QR कोड देखाउनुहोस्"} | {showQRCode ? "Hide QR" : "Show QR Code"}
            </Button>
            <Button variant="outline" className="flex-1 bg-transparent" onClick={handlePrintReport}>
              <Printer className="h-4 w-4 mr-2" />
              रिपोर्ट प्रिन्ट | Print Report
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
