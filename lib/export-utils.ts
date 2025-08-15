// Export utilities for generating CSV, Excel, and PDF reports
export class ExportUtils {
  // Export data to CSV format
  static exportToCSV(data: any[], filename: string, headers?: string[]) {
    if (!data || data.length === 0) {
      alert("No data to export")
      return
    }

    // Generate headers from first object if not provided
    const csvHeaders = headers || Object.keys(data[0])

    // Create CSV content
    const csvContent = [
      csvHeaders.join(","), // Header row
      ...data.map((row) =>
        csvHeaders
          .map((header) => {
            const value = row[header] || ""
            // Escape commas and quotes in values
            return typeof value === "string" && (value.includes(",") || value.includes('"'))
              ? `"${value.replace(/"/g, '""')}"`
              : value
          })
          .join(","),
      ),
    ].join("\n")

    // Create and download file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute("href", url)
      link.setAttribute("download", `${filename}.csv`)
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  // Export data to Excel format (using CSV with .xlsx extension for simplicity)
  static exportToExcel(data: any[], filename: string, headers?: string[]) {
    if (!data || data.length === 0) {
      alert("No data to export")
      return
    }

    // For now, we'll use CSV format with Excel extension
    // In a real application, you might want to use a library like xlsx
    const csvHeaders = headers || Object.keys(data[0])

    const csvContent = [
      csvHeaders.join("\t"), // Use tabs for better Excel compatibility
      ...data.map((row) =>
        csvHeaders
          .map((header) => {
            const value = row[header] || ""
            return typeof value === "string" && value.includes("\t") ? `"${value}"` : value
          })
          .join("\t"),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "application/vnd.ms-excel;charset=utf-8;" })
    const link = document.createElement("a")

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute("href", url)
      link.setAttribute("download", `${filename}.xlsx`)
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  // Generate PDF report (basic HTML to PDF conversion)
  static generatePDFReport(data: any[], title: string) {
    if (!data || data.length === 0) {
      alert("No data to export")
      return
    }

    // Create a new window with the report content
    const printWindow = window.open("", "_blank")
    if (!printWindow) {
      alert("Please allow popups to generate PDF report")
      return
    }

    const headers = Object.keys(data[0])

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #333; text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; font-weight: bold; }
            tr:nth-child(even) { background-color: #f9f9f9; }
            .report-info { margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <h1>${title}</h1>
          <div class="report-info">
            <p><strong>Generated on:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>Total Records:</strong> ${data.length}</p>
          </div>
          <table>
            <thead>
              <tr>
                ${headers.map((header) => `<th>${header}</th>`).join("")}
              </tr>
            </thead>
            <tbody>
              ${data
                .map(
                  (row) => `
                <tr>
                  ${headers.map((header) => `<td>${row[header] || ""}</td>`).join("")}
                </tr>
              `,
                )
                .join("")}
            </tbody>
          </table>
        </body>
      </html>
    `

    printWindow.document.write(htmlContent)
    printWindow.document.close()

    // Wait for content to load, then print
    setTimeout(() => {
      printWindow.print()
    }, 500)
  }

  // Format data for export (clean up and standardize)
  static formatDataForExport(data: any[], type: "registration" | "screening" | "dose_log" = "registration") {
    if (!data || data.length === 0) return []

    return data.map((item) => {
      switch (type) {
        case "registration":
          return {
            "Serial No": item.serial_no || "",
            "Child Name": item.child_name || "",
            "Date of Birth": item.date_of_birth || "",
            Age: item.age || "",
            Gender: item.gender || "",
            "Father Name": item.father_name || "",
            "Mother Name": item.mother_name || "",
            Contact: item.contact_number || "",
            District: item.district || "",
            Palika: item.palika || "",
            Ward: item.ward || "",
            "Registration Date": item.registration_date || "",
            "Created At": item.created_at ? new Date(item.created_at).toLocaleString() : "",
          }

        case "screening":
          return {
            "Screening Date": item.screening_date || "",
            "Screening Type": item.screening_type || "",
            Weight: item.weight || "",
            Height: item.height || "",
            "Health Issues": item.health_issues || "",
            "Referral Status": item.referral_status || "",
            "Created At": item.created_at ? new Date(item.created_at).toLocaleString() : "",
          }

        case "dose_log":
          return {
            "Dose Date": item.dose_date || "",
            "Dose Amount": item.dose_amount || "",
            "Dose Time": item.dose_time || "",
            "Administered By": item.administered_by || "",
            "Child Reaction": item.child_reaction || "",
            "Next Dose Date": item.next_dose_date || "",
            "Created At": item.created_at ? new Date(item.created_at).toLocaleString() : "",
          }

        default:
          return item
      }
    })
  }
}
