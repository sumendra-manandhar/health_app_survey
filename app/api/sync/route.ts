import { type NextRequest, NextResponse } from "next/server"
import { DatabaseService } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { registrations = [], screenings = [], doseLogs = [] } = body

    const results = {
      registrations: { success: 0, failed: 0, errors: [] as any[] },
      screenings: { success: 0, failed: 0, errors: [] as any[] },
      doseLogs: { success: 0, failed: 0, errors: [] as any[] },
    }

    // Sync registrations
    for (const registration of registrations) {
      try {
        const { error } = await DatabaseService.createRegistration(registration)
        if (error) {
          results.registrations.failed++
          results.registrations.errors.push({ id: registration.id, error: error.message })
        } else {
          results.registrations.success++
        }
      } catch (error) {
        results.registrations.failed++
        results.registrations.errors.push({
          id: registration.id,
          error: error instanceof Error ? error.message : "Unknown error",
        })
      }
    }

    // Sync screenings
    for (const screening of screenings) {
      try {
        const { error } = await DatabaseService.createScreening(screening)
        if (error) {
          results.screenings.failed++
          results.screenings.errors.push({ id: screening.id, error: error.message })
        } else {
          results.screenings.success++
        }
      } catch (error) {
        results.screenings.failed++
        results.screenings.errors.push({
          id: screening.id,
          error: error instanceof Error ? error.message : "Unknown error",
        })
      }
    }

    // Sync dose logs
    for (const doseLog of doseLogs) {
      try {
        const { error } = await DatabaseService.createDoseLog(doseLog)
        if (error) {
          results.doseLogs.failed++
          results.doseLogs.errors.push({ id: doseLog.id, error: error.message })
        } else {
          results.doseLogs.success++
        }
      } catch (error) {
        results.doseLogs.failed++
        results.doseLogs.errors.push({
          id: doseLog.id,
          error: error instanceof Error ? error.message : "Unknown error",
        })
      }
    }

    return NextResponse.json({
      success: true,
      message: "Sync completed",
      results,
    })
  } catch (error) {
    console.error("Sync API error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Sync failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const lastSync = searchParams.get("last_sync")

    // Get all data modified since last sync
    const query = DatabaseService.getRegistrations()

    if (lastSync) {
      // Filter by last sync timestamp if provided
      // This would require additional filtering logic
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to fetch sync data",
          error: error.message,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        registrations: data || [],
        lastSync: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Sync GET API error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch sync data",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
