import { type NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import { questionConfig } from "@/lib/question-config"

const QUESTIONS_FILE = path.join(process.cwd(), "data", "questions.json")

async function ensureDataDirectory() {
  const dataDir = path.join(process.cwd(), "data")
  try {
    await fs.access(dataDir)
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
  }
}

async function readQuestions() {
  try {
    await ensureDataDirectory()
    const data = await fs.readFile(QUESTIONS_FILE, "utf8")
    return JSON.parse(data)
  } catch {
    // Return default questions if file doesn't exist
    return {
      steps: questionConfig,
      metadata: {
        version: "1.0.0",
        lastUpdated: new Date().toISOString(),
        description: { nepali: "स्वर्णबिन्दु प्राशन दर्ता फारम", english: "Swarnabindu Prashan Registration Form" },
      },
    }
  }
}

async function writeQuestions(questions: any) {
  await ensureDataDirectory()
  await fs.writeFile(QUESTIONS_FILE, JSON.stringify(questions, null, 2))
}

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: {
        steps: questionConfig,
      },
    })
  } catch (error) {
    console.error("Error fetching questions:", error)
    return NextResponse.json({ success: false, message: "Failed to fetch questions" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // In a real application, you would save this to a database
    console.log("Saving question configuration:", data)

    return NextResponse.json({
      success: true,
      message: "Questions saved successfully",
    })
  } catch (error) {
    console.error("Error saving questions:", error)
    return NextResponse.json({ success: false, message: "Failed to save questions" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { stepId, questions: stepQuestions } = await request.json()

    const currentQuestions = await readQuestions()
    const stepIndex = currentQuestions.steps.findIndex((step: any) => step.id === stepId)

    if (stepIndex === -1) {
      return NextResponse.json({ success: false, message: "Step not found" }, { status: 404 })
    }

    currentQuestions.steps[stepIndex].questions = stepQuestions
    currentQuestions.metadata.lastUpdated = new Date().toISOString()

    await writeQuestions(currentQuestions)

    return NextResponse.json({
      success: true,
      message: "Step questions updated successfully",
      data: currentQuestions,
    })
  } catch (error) {
    console.error("Error updating step questions:", error)
    return NextResponse.json({ success: false, message: "Failed to update step questions" }, { status: 500 })
  }
}
