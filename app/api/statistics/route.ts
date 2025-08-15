import { type NextRequest, NextResponse } from "next/server"
import { DatabaseService } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const { data, error } = await DatabaseService.getStatistics()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json(
        {
          success: false,
          message: "Failed to fetch statistics",
          error: error.message,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      data,
    })
  } catch (error) {
    console.error("Statistics API error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
