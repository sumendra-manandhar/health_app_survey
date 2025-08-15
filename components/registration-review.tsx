"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, CheckCircle } from "lucide-react"

interface RegistrationReviewProps {
  data: any
  onPrevious: () => void
  onSubmit: () => void
  isSubmitting: boolean
}

export function RegistrationReview({ data, onPrevious, onSubmit, isSubmitting }: RegistrationReviewProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>चरण ३: समीक्षा र पुष्टि | Step 3: Review & Confirmation</CardTitle>
        <CardDescription>
          दर्ता जानकारी समीक्षा गर्नुहोस् र पुष्टि गर्नुहोस् | Review registration information and confirm
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Child Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">बालबालिकाको जानकारी | Child Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm text-gray-600">बालबालिकाको नाम | Child Name</p>
              <p className="font-medium">{data.child_name || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">जन्म मिति | Date of Birth</p>
              <p className="font-medium">{formatDate(data.date_of_birth) || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">उमेर | Age</p>
              <p className="font-medium">{data.age || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">लिङ्ग | Gender</p>
              <Badge variant="outline">{data.gender || "N/A"}</Badge>
            </div>
          </div>
        </div>

        <Separator />

        {/* Guardian Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">अभिभावकको जानकारी | Guardian Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm text-gray-600">बुबाको नाम | Father's Name</p>
              <p className="font-medium">{data.father_name || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">आमाको नाम | Mother's Name</p>
              <p className="font-medium">{data.mother_name || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">संरक्षकको नाम | Guardian's Name</p>
              <p className="font-medium">{data.guardian_name || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">सम्पर्क नम्बर | Contact Number</p>
              <p className="font-medium">{data.contact_number || "N/A"}</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Address Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">ठेगाना | Address Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm text-gray-600">जिल्ला | District</p>
              <p className="font-medium">{data.district || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">पालिका | Municipality</p>
              <p className="font-medium">{data.palika || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">वडा नं | Ward No.</p>
              <p className="font-medium">{data.ward || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">टोल | Tole</p>
              <p className="font-medium">{data.tole || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">जात | Caste</p>
              <p className="font-medium">{data.caste || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">धर्म | Religion</p>
              <p className="font-medium">{data.religion || "N/A"}</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Health Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">स्वास्थ्य जानकारी | Health Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm text-gray-600">तौल | Weight</p>
              <p className="font-medium">{data.weight ? `${data.weight} kg` : "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">उचाइ | Height</p>
              <p className="font-medium">{data.height ? `${data.height} cm` : "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">MUAC</p>
              <p className="font-medium">{data.muac ? `${data.muac} cm` : "N/A"}</p>
            </div>
          </div>
          {data.health_issues && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">स्वास्थ्य समस्या | Health Issues</p>
              <p className="font-medium">{data.health_issues}</p>
            </div>
          )}
        </div>

        <Separator />

        {/* Swarnabindu Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">स्वर्णबिन्दु जानकारी | Swarnabindu Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg">
            <div>
              <p className="text-sm text-gray-600">प्रशासन मिति | Administration Date</p>
              <p className="font-medium">{formatDate(data.swarnabindu_date) || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">खुराक | Dose Amount</p>
              <p className="font-medium">{data.dose_amount || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">समय | Time</p>
              <p className="font-medium">{data.dose_time || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">प्रशासक | Administered By</p>
              <p className="font-medium">{data.administered_by || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">बालबालिकाको प्रतिक्रिया | Child Reaction</p>
              <Badge variant={data.child_reaction === "normal" ? "default" : "secondary"}>
                {data.child_reaction || "N/A"}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-gray-600">खुराक संख्या | Number of Doses</p>
              <p className="font-medium">{data.doses_given || "N/A"}</p>
            </div>
          </div>
          {data.notes && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">टिप्पणी | Notes</p>
              <p className="font-medium">{data.notes}</p>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6">
          <Button variant="outline" onClick={onPrevious} disabled={isSubmitting}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            सम्पादन गर्नुहोस् | Edit
          </Button>
          <Button onClick={onSubmit} disabled={isSubmitting} className="min-w-32">
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                दर्ता गर्दै...
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                दर्ता पुष्टि गर्नुहोस् | Confirm Registration
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
