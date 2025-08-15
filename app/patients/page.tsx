"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ExportUtils } from "@/lib/export-utils"
import { OfflineStorage } from "@/lib/offline-storage"
import { DatabaseService } from "@/lib/supabase"
import { Search, Filter, Download, FileText, Users, ArrowLeft, Eye, Edit, Plus } from "lucide-react"
import Link from "next/link"
import { Database } from "lucide-react" // Import Database icon

interface Patient {
  id: string
  serial_no: string
  child_name: string
  birth_date: string
  age: string
  gender: string
  father_name?: string
  mother_name?: string
  guardian_name?: string
  contact_number: string
  district: string
  palika: string
  ward: string
  date: string
  created_at: string
  localId?: string
  synced?: boolean
}

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [districtFilter, setDistrictFilter] = useState("all")
  const [genderFilter, setGenderFilter] = useState("all")
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    setIsOnline(navigator.onLine)
    loadPatients()

    const handleOnline = () => {
      setIsOnline(true)
      loadPatients()
    }
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  useEffect(() => {
    filterPatients()
  }, [patients, searchTerm, districtFilter, genderFilter])

  const loadPatients = async () => {
    setLoading(true)
    try {
      let allPatients: Patient[] = []

      // Always load offline data first
      const offlineRegistrations = OfflineStorage.getAllLocalRegistrations()
      const offlinePatients = offlineRegistrations.map((reg) => ({
        id: reg.localId || reg.id,
        serial_no: reg.serial_no || "",
        child_name: reg.child_name || "",
        birth_date: reg.birth_date || "",
        age: reg.age || "",
        gender: reg.gender || "",
        father_name: reg.father_name || "",
        mother_name: reg.mother_name || "",
        guardian_name: reg.guardian_name || "",
        contact_number: reg.contact_number || "",
        district: reg.district || "",
        palika: reg.palika || "",
        ward: reg.ward || "",
        date: reg.date || reg.created_at,
        created_at: reg.created_at,
        localId: reg.localId || reg.id,
        synced: reg.synced || false,
      }))

      allPatients = [...offlinePatients]

      // Try to load from Supabase if online
      if (isOnline) {
        try {
          const { data: onlineData, error } = await DatabaseService.getRegistrations()
          if (onlineData && !error) {
            const onlinePatients = onlineData.map((reg: any) => ({
              id: reg.id,
              serial_no: reg.serial_no || "",
              child_name: reg.child_name || "",
              birth_date: reg.birth_date || "",
              age: reg.age || "",
              gender: reg.gender || "",
              father_name: reg.father_name || "",
              mother_name: reg.mother_name || "",
              guardian_name: reg.guardian_name || "",
              contact_number: reg.contact_number || "",
              district: reg.district || "",
              palika: reg.palika || "",
              ward: reg.ward || "",
              date: reg.date || reg.created_at,
              created_at: reg.created_at,
              synced: true,
            }))

            // Merge online and offline data, avoiding duplicates
            const mergedPatients = [...allPatients]
            onlinePatients.forEach((onlinePatient) => {
              const existsOffline = allPatients.some(
                (offlinePatient) =>
                  offlinePatient.serial_no === onlinePatient.serial_no ||
                  (offlinePatient.child_name === onlinePatient.child_name &&
                    offlinePatient.contact_number === onlinePatient.contact_number),
              )
              if (!existsOffline) {
                mergedPatients.push(onlinePatient)
              }
            })
            allPatients = mergedPatients
          }
        } catch (error) {
          console.error("Error loading online patients:", error)
        }
      }

      setPatients(allPatients)
    } catch (error) {
      console.error("Error loading patients:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterPatients = () => {
    let filtered = patients

    if (searchTerm) {
      filtered = filtered.filter(
        (patient) =>
          patient.child_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.contact_number?.includes(searchTerm) ||
          patient.serial_no?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.guardian_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.father_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.mother_name?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (districtFilter !== "all") {
      filtered = filtered.filter((patient) => patient.district === districtFilter)
    }

    if (genderFilter !== "all") {
      filtered = filtered.filter((patient) => patient.gender === genderFilter)
    }

    setFilteredPatients(filtered)
  }

  const handleExportCSV = () => {
    const exportData = ExportUtils.formatDataForExport(filteredPatients, "registration")
    ExportUtils.exportToCSV(exportData, "patients_report")
  }

  const handleExportExcel = () => {
    const exportData = ExportUtils.formatDataForExport(filteredPatients, "registration")
    ExportUtils.exportToExcel(exportData, "patients_report")
  }

  const handleExportPDF = () => {
    const exportData = ExportUtils.formatDataForExport(filteredPatients, "registration")
    ExportUtils.generatePDFReport(exportData, "Patients Report")
  }

  const getUniqueDistricts = () => {
    const districts = patients.map((p) => p.district).filter(Boolean)
    return [...new Set(districts)].sort()
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    return new Date(dateString).toLocaleDateString()
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Loading patients...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">बिरामी व्यवस्थापन | Patient Management</h1>
            <p className="text-muted-foreground">View and manage registered patients</p>
          </div>
        </div>
        <Link href="/register">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add New Patient
          </Button>
        </Link>
      </div>

      {/* Connection Status */}
      {!isOnline && (
        <Alert>
          <AlertDescription>
            You're working offline. Showing locally stored patient data.
            {OfflineStorage.getPendingSyncCount() > 0 && (
              <span className="ml-2">{OfflineStorage.getPendingSyncCount()} items pending sync.</span>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{patients.length}</div>
            <p className="text-xs text-muted-foreground">Registered children</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Filtered Results</CardTitle>
            <Filter className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredPatients.length}</div>
            <p className="text-xs text-muted-foreground">Matching criteria</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Districts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getUniqueDistricts().length}</div>
            <p className="text-xs text-muted-foreground">Coverage areas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Sync</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" /> {/* Use Database icon */}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{OfflineStorage.getPendingSyncCount()}</div>
            <p className="text-xs text-muted-foreground">Items to sync</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Search and Filter</CardTitle>
          <CardDescription>Find specific patients using filters</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, contact, or serial..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={districtFilter} onValueChange={setDistrictFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by district" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Districts</SelectItem>
                {getUniqueDistricts().map((district) => (
                  <SelectItem key={district} value={district}>
                    {district}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={genderFilter} onValueChange={setGenderFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genders</SelectItem>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("")
                setDistrictFilter("all")
                setGenderFilter("all")
              }}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle>Export Data</CardTitle>
          <CardDescription>Download patient data in various formats</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExportCSV}>
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
            <Button variant="outline" onClick={handleExportExcel}>
              <Download className="mr-2 h-4 w-4" />
              Export Excel
            </Button>
            <Button variant="outline" onClick={handleExportPDF}>
              <FileText className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Patients Table */}
      <Card>
        <CardHeader>
          <CardTitle>Patient List ({filteredPatients.length})</CardTitle>
          <CardDescription>Registered patients and their information</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredPatients.length === 0 ? (
            <Alert>
              <AlertDescription>No patients found matching your criteria. Try adjusting your filters.</AlertDescription>
            </Alert>
          ) : (
            <ScrollArea className="h-[600px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Serial No</TableHead>
                    <TableHead>Child Name</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead>Gender</TableHead>
                    <TableHead>Guardian</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>District</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Registration Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPatients.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell className="font-medium">{patient.serial_no}</TableCell>
                      <TableCell>{patient.child_name}</TableCell>
                      <TableCell>{patient.age}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{patient.gender}</Badge>
                      </TableCell>
                      <TableCell>{patient.guardian_name || patient.father_name || patient.mother_name}</TableCell>
                      <TableCell>{patient.contact_number}</TableCell>
                      <TableCell>{patient.district}</TableCell>
                      <TableCell>
                        <Badge variant={patient.synced ? "default" : "secondary"}>
                          {patient.synced ? "Synced" : "Local"}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(patient.date)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Link href={`/screening/new?patientId=${patient.id}`}>
                            <Button variant="outline" size="sm">
                              <Plus className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
