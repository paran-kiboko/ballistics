"use client"

import type React from "react"

import { useState, useEffect, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { MobileLayout } from "@/components/fiti/mobile-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/app/hooks/use-toast"
import { PageHeader } from "@/components/fiti/page-header"

interface UserInfo {
  gender: string
  age: string
  height: string
  currentWeight: string
  goalWeight: string
  activityLevel: string
}

export default function EditProfilePage() {
  const [formData, setFormData] = useState<Partial<UserInfo>>({})
  const [initialDataLoaded, setInitialDataLoaded] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const storedInfo = localStorage.getItem("fitiUserInfo")
    if (storedInfo) {
      setFormData(JSON.parse(storedInfo))
    }
    setInitialDataLoaded(true)
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRadioChange = (name: keyof UserInfo, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    // Basic validation
    if (
      !formData.age ||
      !formData.height ||
      !formData.currentWeight ||
      !formData.goalWeight ||
      !formData.activityLevel ||
      !formData.gender
    ) {
      toast({ variant: "destructive", title: "입력 오류", description: "모든 필수 정보를 입력해주세요." })
      return
    }
    localStorage.setItem("fitiUserInfo", JSON.stringify(formData))
    toast({ title: "정보 업데이트 완료", description: "개인 정보가 성공적으로 업데이트되었습니다." })

    // Dispatch storage event to update other components if needed
    window.dispatchEvent(new StorageEvent("storage", { key: "fitiUserInfo" }))
    router.push("/profile")
  }

  if (!initialDataLoaded) {
    return (
      <MobileLayout>
        <PageHeader title="개인 정보 수정" backButtonHref="/profile" />
        <div className="p-4 text-center">정보를 불러오는 중...</div>
      </MobileLayout>
    )
  }

  return (
    <MobileLayout>
      <PageHeader title="개인 정보 수정" backButtonHref="/profile" />
      <form onSubmit={handleSubmit} className="p-4 space-y-6 h-[calc(100%-3.5rem)] overflow-y-auto">
        <Card>
          <CardHeader>
            <CardTitle>기본 정보 수정</CardTitle>
            <CardDescription>나이, 신장, 체중, 활동 수준을 수정할 수 있습니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="gender">성별</Label>
              <RadioGroup
                name="gender"
                value={formData.gender || "male"}
                onValueChange={(val) => handleRadioChange("gender", val)}
                className="flex mt-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="male" />
                  <Label htmlFor="male">남성</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="female" />
                  <Label htmlFor="female">여성</Label>
                </div>
              </RadioGroup>
            </div>
            <div>
              <Label htmlFor="age">나이 (세)</Label>
              <Input
                id="age"
                name="age"
                type="number"
                value={formData.age || ""}
                onChange={handleChange}
                placeholder="예: 30"
              />
            </div>
            <div>
              <Label htmlFor="height">신장 (cm)</Label>
              <Input
                id="height"
                name="height"
                type="number"
                value={formData.height || ""}
                onChange={handleChange}
                placeholder="예: 175"
              />
            </div>
            <div>
              <Label htmlFor="currentWeight">현재 체중 (kg)</Label>
              <Input
                id="currentWeight"
                name="currentWeight"
                type="number"
                value={formData.currentWeight || ""}
                onChange={handleChange}
                placeholder="예: 70"
              />
            </div>
            <div>
              <Label htmlFor="goalWeight">목표 체중 (kg)</Label>
              <Input
                id="goalWeight"
                name="goalWeight"
                type="number"
                value={formData.goalWeight || ""}
                onChange={handleChange}
                placeholder="예: 65"
              />
            </div>
            <div>
              <Label>활동 수준</Label>
              <RadioGroup
                name="activityLevel"
                value={formData.activityLevel || "moderate"}
                onValueChange={(val) => handleRadioChange("activityLevel", val)}
                className="space-y-1 mt-1"
              >
                {[
                  { value: "sedentary", label: "비활동적" },
                  { value: "light", label: "가벼운 활동" },
                  { value: "moderate", label: "보통 활동" },
                  { value: "active", label: "활동적" },
                  { value: "very_active", label: "매우 활동적" },
                ].map((item) => (
                  <Label
                    key={item.value}
                    htmlFor={`activity-${item.value}`}
                    className="flex items-center p-2 border rounded-md hover:bg-accent has-[:checked]:bg-accent cursor-pointer"
                  >
                    <RadioGroupItem value={item.value} id={`activity-${item.value}`} className="mr-2" /> {item.label}
                  </Label>
                ))}
              </RadioGroup>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              저장하기
            </Button>
          </CardFooter>
        </Card>
      </form>
    </MobileLayout>
  )
}
