"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Award, Download, Printer, Calendar, Shield } from "lucide-react"

interface CertificateData {
  childName: string
  fatherName: string
  motherName: string
  dateOfBirth: string
  totalDoses: number
  startDate: string
  completionDate: string
  certificateNumber: string
  issuedDate: string
  issuedBy: string
  healthCenter: string
}

interface CertificateGeneratorProps {
  data: CertificateData
  onClose?: () => void
}

export function CertificateGenerator({ data, onClose }: CertificateGeneratorProps) {
  const [generating, setGenerating] = useState(false)

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob)
    const today = new Date()
    const ageInMonths = (today.getFullYear() - birthDate.getFullYear()) * 12 + (today.getMonth() - birthDate.getMonth())

    if (ageInMonths < 12) {
      return `${ageInMonths} महिना`
    } else {
      const years = Math.floor(ageInMonths / 12)
      const months = ageInMonths % 12
      return months > 0 ? `${years} वर्ष ${months} महिना` : `${years} वर्ष`
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = async () => {
    setGenerating(true)
    try {
      // Generate PDF using browser's print to PDF functionality
      const printWindow = window.open("", "_blank")
      if (!printWindow) return

      const certificateHTML = generateCertificateHTML()
      printWindow.document.write(certificateHTML)
      printWindow.document.close()
      printWindow.print()
    } catch (error) {
      console.error("Error generating certificate:", error)
    } finally {
      setGenerating(false)
    }
  }

  const generateCertificateHTML = () => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>स्वर्णबिन्दु प्राशन प्रमाणपत्र</title>
          <meta charset="UTF-8">
          <style>
            @page { size: A4; margin: 20mm; }
            body { 
              font-family: 'Noto Sans Devanagari', Arial, sans-serif; 
              margin: 0; 
              padding: 20px;
              background: linear-gradient(135deg, #f6f9fc 0%, #e9f4f8 100%);
            }
            .certificate {
              max-width: 800px;
              margin: 0 auto;
              background: white;
              border: 8px solid #2563eb;
              border-radius: 20px;
              padding: 40px;
              box-shadow: 0 20px 40px rgba(0,0,0,0.1);
              position: relative;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 3px solid #f59e0b;
              padding-bottom: 20px;
            }
            .logo {
              width: 80px;
              height: 80px;
              background: #2563eb;
              border-radius: 50%;
              margin: 0 auto 20px;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-size: 24px;
              font-weight: bold;
            }
            .title {
              font-size: 28px;
              font-weight: bold;
              color: #1e40af;
              margin-bottom: 10px;
            }
            .subtitle {
              font-size: 20px;
              color: #374151;
              margin-bottom: 5px;
            }
            .department {
              font-size: 14px;
              color: #6b7280;
            }
            .content {
              margin: 30px 0;
              line-height: 1.8;
            }
            .certificate-text {
              font-size: 18px;
              text-align: center;
              margin-bottom: 30px;
              color: #374151;
            }
            .details {
              background: #f8fafc;
              padding: 20px;
              border-radius: 10px;
              margin: 20px 0;
            }
            .detail-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 10px;
              padding: 5px 0;
              border-bottom: 1px dotted #d1d5db;
            }
            .detail-label {
              font-weight: bold;
              color: #374151;
            }
            .detail-value {
              color: #1f2937;
            }
            .footer {
              margin-top: 40px;
              display: flex;
              justify-content: space-between;
              align-items: end;
            }
            .signature {
              text-align: center;
              border-top: 2px solid #374151;
              padding-top: 10px;
              min-width: 200px;
            }
            .seal {
              width: 100px;
              height: 100px;
              border: 3px solid #dc2626;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              color: #dc2626;
              font-weight: bold;
              font-size: 12px;
              text-align: center;
            }
            .certificate-number {
              position: absolute;
              top: 20px;
              right: 20px;
              background: #fef3c7;
              padding: 5px 10px;
              border-radius: 5px;
              font-size: 12px;
              font-weight: bold;
            }
            @media print {
              body { background: white; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="certificate">
            <div class="certificate-number">प्रमाणपत्र नं: ${data.certificateNumber}</div>
            
            <div class="header">
              <div class="logo">स्व</div>
              <div class="title">स्वर्णबिन्दु प्राशन प्रमाणपत्र</div>
              <div class="subtitle">SWARNABINDU PRASHAN CERTIFICATE</div>
              <div class="department">आयुर्वेद तथा वैकल्पिक चिकित्सा विभाग<br>Department of Ayurveda and Alternative Medicine</div>
            </div>

            <div class="content">
              <div class="certificate-text">
                यो प्रमाणित गर्दछ कि<br>
                <strong>This is to certify that</strong>
              </div>

              <div class="details">
                <div class="detail-row">
                  <span class="detail-label">बालक/बालिकाको नाम | Child's Name:</span>
                  <span class="detail-value">${data.childName}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">बुबाको नाम | Father's Name:</span>
                  <span class="detail-value">${data.fatherName}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">आमाको नाम | Mother's Name:</span>
                  <span class="detail-value">${data.motherName}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">जन्म मिति | Date of Birth:</span>
                  <span class="detail-value">${new Date(data.dateOfBirth).toLocaleDateString("ne-NP")}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">उमेर | Age:</span>
                  <span class="detail-value">${calculateAge(data.dateOfBirth)}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">कुल खुराक | Total Doses:</span>
                  <span class="detail-value">${data.totalDoses}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">सुरुवात मिति | Start Date:</span>
                  <span class="detail-value">${new Date(data.startDate).toLocaleDateString("ne-NP")}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">समाप्ति मिति | Completion Date:</span>
                  <span class="detail-value">${new Date(data.completionDate).toLocaleDateString("ne-NP")}</span>
                </div>
              </div>

              <div class="certificate-text">
                ले स्वर्णबिन्दु प्राशन कार्यक्रम सफलतापूर्वक सम्पन्न गरेको छ।<br>
                <strong>has successfully completed the Swarnabindu Prashan Program.</strong>
              </div>

              <div class="certificate-text">
                यो प्रमाणपत्र बालकको रोग प्रतिरोधात्मक क्षमता वृद्धि र समग्र स्वास्थ्य सुधारको लागि दिइएको हो।<br>
                <strong>This certificate is awarded for enhanced immunity and overall health improvement.</strong>
              </div>
            </div>

            <div class="footer">
              <div class="signature">
                <div>${data.issuedBy}</div>
                <div style="font-size: 12px; margin-top: 5px;">आयुर्वेद चिकित्सक</div>
                <div style="font-size: 12px;">Ayurveda Physician</div>
              </div>
              
              <div style="text-align: center;">
                <div style="font-size: 14px; margin-bottom: 10px;">
                  जारी मिति: ${new Date(data.issuedDate).toLocaleDateString("ne-NP")}<br>
                  Issue Date: ${new Date(data.issuedDate).toLocaleDateString()}
                </div>
                <div style="font-size: 12px; color: #6b7280;">
                  ${data.healthCenter}
                </div>
              </div>

              <div class="seal">
                आधिकारिक<br>छाप<br>OFFICIAL<br>SEAL
              </div>
            </div>
          </div>
        </body>
      </html>
    `
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="no-print">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-600" />
              स्वर्णबिन्दु प्राशन प्रमाणपत्र | Swarnabindu Prashan Certificate
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handlePrint}>
                <Printer className="h-4 w-4 mr-2" />
                प्रिन्ट | Print
              </Button>
              <Button variant="outline" onClick={handleDownload} disabled={generating}>
                <Download className="h-4 w-4 mr-2" />
                डाउनलोड | Download
              </Button>
              {onClose && (
                <Button variant="outline" onClick={onClose}>
                  बन्द गर्नुहोस् | Close
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Certificate Preview */}
          <div className="bg-gradient-to-br from-blue-50 to-yellow-50 p-8 rounded-lg border-4 border-blue-600">
            {/* Certificate Number */}
            <div className="flex justify-end mb-4">
              <Badge variant="outline" className="bg-yellow-100 text-yellow-800 px-3 py-1">
                प्रमाणपत्र नं: {data.certificateNumber}
              </Badge>
            </div>

            {/* Header */}
            <div className="text-center mb-8 border-b-2 border-yellow-500 pb-6">
              <div className="w-20 h-20 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">स्व</span>
              </div>
              <h1 className="text-3xl font-bold text-blue-800 mb-2">स्वर्णबिन्दु प्राशन प्रमाणपत्र</h1>
              <h2 className="text-xl text-gray-700 mb-2">SWARNABINDU PRASHAN CERTIFICATE</h2>
              <p className="text-sm text-gray-600">
                आयुर्वेद तथा वैकल्पिक चिकित्सा विभाग
                <br />
                Department of Ayurveda and Alternative Medicine
              </p>
            </div>

            {/* Certificate Text */}
            <div className="text-center mb-6">
              <p className="text-lg text-gray-700 mb-2">
                यो प्रमाणित गर्दछ कि
                <br />
                <strong>This is to certify that</strong>
              </p>
            </div>

            {/* Details */}
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex justify-between border-b border-dotted border-gray-300 pb-2">
                  <span className="font-semibold">बालक/बालिकाको नाम:</span>
                  <span>{data.childName}</span>
                </div>
                <div className="flex justify-between border-b border-dotted border-gray-300 pb-2">
                  <span className="font-semibold">बुबाको नाम:</span>
                  <span>{data.fatherName}</span>
                </div>
                <div className="flex justify-between border-b border-dotted border-gray-300 pb-2">
                  <span className="font-semibold">आमाको नाम:</span>
                  <span>{data.motherName}</span>
                </div>
                <div className="flex justify-between border-b border-dotted border-gray-300 pb-2">
                  <span className="font-semibold">जन्म मिति:</span>
                  <span>{new Date(data.dateOfBirth).toLocaleDateString("ne-NP")}</span>
                </div>
                <div className="flex justify-between border-b border-dotted border-gray-300 pb-2">
                  <span className="font-semibold">उमेर:</span>
                  <span>{calculateAge(data.dateOfBirth)}</span>
                </div>
                <div className="flex justify-between border-b border-dotted border-gray-300 pb-2">
                  <span className="font-semibold">कुल खुराक:</span>
                  <span>{data.totalDoses}</span>
                </div>
                <div className="flex justify-between border-b border-dotted border-gray-300 pb-2">
                  <span className="font-semibold">सुरुवात मिति:</span>
                  <span>{new Date(data.startDate).toLocaleDateString("ne-NP")}</span>
                </div>
                <div className="flex justify-between border-b border-dotted border-gray-300 pb-2">
                  <span className="font-semibold">समाप्ति मिति:</span>
                  <span>{new Date(data.completionDate).toLocaleDateString("ne-NP")}</span>
                </div>
              </div>
            </div>

            {/* Achievement Text */}
            <div className="text-center mb-8">
              <p className="text-lg text-gray-700 mb-4">
                ले स्वर्णबिन्दु प्राशन कार्यक्रम सफलतापूर्वक सम्पन्न गरेको छ।
                <br />
                <strong>has successfully completed the Swarnabindu Prashan Program.</strong>
              </p>
              <p className="text-base text-gray-600">
                यो प्रमाणपत्र बालकको रोग प्रतिरोधात्मक क्षमता वृद्धि र समग्र स्वास्थ्य सुधारको लागि दिइएको हो।
                <br />
                <strong>This certificate is awarded for enhanced immunity and overall health improvement.</strong>
              </p>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-end">
              <div className="text-center">
                <div className="border-t-2 border-gray-800 pt-2 min-w-[200px]">
                  <div className="font-semibold">{data.issuedBy}</div>
                  <div className="text-sm text-gray-600">आयुर्वेद चिकित्सक</div>
                  <div className="text-sm text-gray-600">Ayurveda Physician</div>
                </div>
              </div>

              <div className="text-center">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-gray-600" />
                  <span className="text-sm">जारी मिति: {new Date(data.issuedDate).toLocaleDateString("ne-NP")}</span>
                </div>
                <div className="text-xs text-gray-500">{data.healthCenter}</div>
              </div>

              <div className="w-24 h-24 border-4 border-red-600 rounded-full flex items-center justify-center">
                <div className="text-center text-red-600 font-bold text-xs">
                  <div>आधिकारिक</div>
                  <div>छाप</div>
                  <div>OFFICIAL</div>
                  <div>SEAL</div>
                </div>
              </div>
            </div>
          </div>

          {/* Certificate Benefits */}
          <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
            <h3 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
              <Shield className="h-4 w-4" />
              स्वर्णबिन्दु प्राशनका फाइदाहरू | Benefits of Swarnabindu Prashan
            </h3>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• रोग प्रतिरोधात्मक क्षमता वृद्धि | Enhanced immunity</li>
              <li>• शारीरिक र मानसिक विकास | Physical and mental development</li>
              <li>• पाचन शक्ति सुधार | Improved digestion</li>
              <li>• बुद्धि र स्मरण शक्ति वृद्धि | Enhanced intelligence and memory</li>
              <li>• संक्रामक रोगहरूबाट सुरक्षा | Protection from infectious diseases</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Certificate data generator utility
export function generateCertificateData(patientData: any, screenings: any[]): CertificateData {
  const sortedScreenings = screenings.sort(
    (a, b) => new Date(a.swarnabinduDate).getTime() - new Date(b.swarnabinduDate).getTime(),
  )
  const firstScreening = sortedScreenings[0]
  const lastScreening = sortedScreenings[sortedScreenings.length - 1]

  return {
    childName: patientData.childName || patientData.child_name,
    fatherName: patientData.fatherName || patientData.father_name || "N/A",
    motherName: patientData.motherName || patientData.mother_name || "N/A",
    dateOfBirth: patientData.dateOfBirth || patientData.birth_date,
    totalDoses: screenings.length,
    startDate: firstScreening?.swarnabinduDate || new Date().toISOString(),
    completionDate: lastScreening?.swarnabinduDate || new Date().toISOString(),
    certificateNumber: `SP-${Date.now().toString().slice(-6)}`,
    issuedDate: new Date().toISOString(),
    issuedBy: "डा. राम प्रसाद शर्मा",
    healthCenter: "स्वर्णबिन्दु प्राशन केन्द्र, काठमाडौं",
  }
}
