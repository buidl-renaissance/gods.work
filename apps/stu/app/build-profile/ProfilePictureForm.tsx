import { useState, useCallback } from "react"
import { Label } from "../../components/ui/label"
import { Button } from "../../components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import Cropper from "react-easy-crop"
import type { Point, Area } from "react-easy-crop/types"

interface ProfilePictureFormProps {
  data: {
    profile_picture: string | null
  }
  updateData: (data: Partial<{ profile_picture: string | null }>) => void
}

export default function ProfilePictureForm({ data, updateData }: ProfilePictureFormProps) {
  const [image, setImage] = useState<string | null>(data.profile_picture)
  const [croppedImage, setCroppedImage] = useState<string | null>(data.profile_picture)
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isCropping, setIsCropping] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0]
      setSelectedFile(file)
      
      // Show preview immediately
      const reader = new FileReader()
      reader.addEventListener("load", () => {
        setImage(reader.result as string)
        setIsCropping(true)
      })
      reader.readAsDataURL(file)
    }
  }

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image()
      image.addEventListener("load", () => resolve(image))
      image.addEventListener("error", (error) => reject(error))
      image.setAttribute("crossOrigin", "anonymous")
      image.src = url
    })

  const getCroppedImg = async (imageSrc: string, pixelCrop: Area) => {
    const image = await createImage(imageSrc)
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")

    if (!ctx) {
      return null
    }

    // Set canvas size to 256x256 (desired output size)
    canvas.width = 256
    canvas.height = 256

    // Draw cropped image
    ctx.drawImage(image, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height, 0, 0, 256, 256)

    return new Promise<Blob>((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          console.error("Canvas is empty")
          return
        }
        resolve(blob)
      }, "image/jpeg")
    })
  }

  const handleCropImage = useCallback(async () => {
    if (image && croppedAreaPixels) {
      try {
        setIsLoading(true)
        const croppedBlob = await getCroppedImg(image, croppedAreaPixels)
        if (croppedBlob) {
          // Create a preview URL for display
          const previewUrl = URL.createObjectURL(croppedBlob)
          setCroppedImage(previewUrl)
          
          // Create form data with cropped image blob
          const formData = new FormData()
          formData.append('file', croppedBlob, 'cropped-image.jpg')

          const response = await fetch('/api/upload-profile-picture', {
            method: 'POST',
            body: formData
          })

          if (!response.ok) {
            throw new Error('Failed to upload image')
          }

          const { url } = await response.json()
          updateData({ profile_picture: url })
          setIsCropping(false)
        }
      } catch (e) {
        console.error(e)
      } finally {
        setIsLoading(false)
      }
    }
  }, [image, croppedAreaPixels, updateData])

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center">
        {isCropping && image ? (
          <div className="relative w-64 h-64">
            <Cropper
              image={image}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          </div>
        ) : (
          <Avatar
            className="w-32 h-32 cursor-pointer"
            onClick={() => document.getElementById("profile-picture-input")?.click()}
            aria-label="Upload or change profile picture"
          >
            <AvatarImage src={croppedImage || undefined} alt="Profile picture" />
            <AvatarFallback>Upload</AvatarFallback>
          </Avatar>
        )}
        {croppedImage && <p className="text-sm text-gray-500 mt-2">Click the image to upload a new picture</p>}
        {/* <Label htmlFor="profile-picture-input" className="cursor-pointer">
          <Button
            type="button"
            className="mt-4"
            onClick={() => document.getElementById("profile-picture-input")?.click()}
          >
            {croppedImage ? "Change Image" : "Upload Profile Picture"}
          </Button>
        </Label> */}
        <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="profile-picture-input" />
        {isCropping && (
          <Button onClick={handleCropImage} className="mt-4" disabled={isLoading}>
            {isLoading ? "Processing..." : "Crop Image"}
          </Button>
        )}
      </div>
    </div>
  )
}
