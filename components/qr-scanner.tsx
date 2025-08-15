"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { X, Camera, AlertCircle } from "lucide-react"

interface QRScannerProps {
  onScanSuccess: (data: any) => void
  onClose: () => void
}

export function QRScanner({ onScanSuccess, onClose }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)

  useEffect(() => {
    startCamera()
    return () => {
      stopCamera()
    }
  }, [])

  const startCamera = async () => {
    try {
      setError(null)
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }, // Use back camera if available
      })

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        setStream(mediaStream)
        setIsScanning(true)
      }
    } catch (err) {
      console.error("Error accessing camera:", err)
      setError(
        "क्यामेरा पहुँच गर्न सकिएन। कृपया क्यामेरा अनुमति दिनुहोस्। | Cannot access camera. Please allow camera permission.",
      )
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
    setIsScanning(false)
  }

  const captureAndScan = async () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext("2d")

    if (!context) return

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    try {
      // Try to import QR code scanner library dynamically
      const QrScanner = (await import("qr-scanner")).default

      const result = await QrScanner.scanImage(canvas, {
        returnDetailedScanResult: true,
      })

      if (result && result.data) {
        try {
          // Try to parse as JSON first
          const qrData = JSON.parse(result.data)
          onScanSuccess(qrData)
        } catch {
          // If not JSON, treat as plain text (maybe serial number)
          onScanSuccess({ serialNo: result.data, id: result.data })
        }
      }
    } catch (scanError) {
      console.error("QR scan error:", scanError)
      setError("QR कोड पढ्न सकिएन। कृपया फेरि प्रयास गर्नुहोस्। | Could not read QR code. Please try again.")
    }
  }

  const handleManualInput = () => {
    const input = prompt("QR कोडको डाटा म्यानुअल रूपमा प्रविष्ट गर्नुहोस् | Enter QR code data manually:")
    if (input) {
      try {
        const qrData = JSON.parse(input)
        onScanSuccess(qrData)
      } catch {
        onScanSuccess({ serialNo: input, id: input })
      }
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            QR कोड स्क्यान गर्नुहोस् | Scan QR Code
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        <div className="relative">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-64 object-cover rounded-lg border-2 border-gray-200"
          />
          <canvas ref={canvasRef} className="hidden" />

          {isScanning && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-48 h-48 border-2 border-blue-500 rounded-lg animate-pulse">
                <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-blue-500"></div>
                <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-blue-500"></div>
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-blue-500"></div>
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-blue-500"></div>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button onClick={captureAndScan} className="flex-1" disabled={!isScanning}>
            <Camera className="h-4 w-4 mr-2" />
            स्क्यान गर्नुहोस् | Scan
          </Button>
          <Button variant="outline" onClick={handleManualInput} className="flex-1 bg-transparent">
            म्यानुअल | Manual
          </Button>
        </div>

        <p className="text-sm text-gray-600 text-center">
          QR कोडलाई क्यामेराको सामु राख्नुहोस् र स्क्यान बटन थिच्नुहोस् | Place QR code in front of camera and press scan button
        </p>
      </CardContent>
    </Card>
  )
}
