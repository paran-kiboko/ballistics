"use client"

import { useState, useEffect } from "react"
import { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Bell, Trash2, Info, ShieldAlert, Clock, Calendar } from "lucide-react"
import { useToast } from "@/app/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const initialSettings = {
  mealReminders: {
    breakfast: { enabled: true, time: "08:00" },
    lunch: { enabled: true, time: "12:00" },
    dinner: { enabled: true, time: "19:00" },
  },
  weightReminder: {
    enabled: false,
    days: ["mon", "wed", "fri"],
    time: "09:00",
  },
}

const weekDays = [
  { id: "sun", label: "일" },
  { id: "mon", label: "월" },
  { id: "tue", label: "화" },
  { id: "wed", label: "수" },
  { id: "thu", label: "목" },
  { id: "fri", label: "금" },
  { id: "sat", label: "토" },
]

type MealType = "breakfast" | "lunch" | "dinner"

export default function AccountSettingsPage() {
  const [settings, setSettings] = useState(initialSettings)
  const { toast } = useToast()

  useEffect(() => {
    const storedSettings = localStorage.getItem("fitiNotificationSettings")
    if (storedSettings) {
      // Merge stored settings with initial settings to ensure new fields are present
      const parsedSettings = JSON.parse(storedSettings)
      setSettings((prev) => ({
        mealReminders: {
          ...prev.mealReminders,
          ...parsedSettings.mealReminders,
        },
        weightReminder: {
          ...prev.weightReminder,
          ...parsedSettings.weightReminder,
        },
      }))
    }
  }, [])

  const updateSettings = (newSettings: any) => {
    setSettings(newSettings)
    localStorage.setItem("fitiNotificationSettings", JSON.stringify(newSettings))
    toast({ title: "설정 저장됨", description: "알림 설정이 업데이트되었습니다." })
  }

  const handleMealReminderChange = (meal: MealType, key: "enabled" | "time", value: boolean | string) => {
    const newSettings = {
      ...settings,
      mealReminders: {
        ...settings.mealReminders,
        [meal]: {
          ...settings.mealReminders[meal],
          [key]: value,
        },
      },
    }
    updateSettings(newSettings)
  }

  const handleWeightReminderChange = (key: string, value: any) => {
    const newSettings = { ...settings, weightReminder: { ...settings.weightReminder, [key]: value } }
    updateSettings(newSettings)
  }

  const handleWeightDayChange = (dayId: string, checked: boolean) => {
    let newDays = [...settings.weightReminder.days]
    if (checked) {
      if (!newDays.includes(dayId)) newDays.push(dayId)
    } else {
      newDays = newDays.filter((d) => d !== dayId)
    }
    handleWeightReminderChange("days", newDays)
  }

  const handleDataReset = () => {
    localStorage.removeItem("fitiUserInfo")
    localStorage.removeItem("fitiUserGoals")
    localStorage.removeItem("fitiDailyIntake")
    localStorage.removeItem("fitiWeightHistory")
    localStorage.removeItem("fitiNotificationSettings") // 알림 설정도 초기화
    // 스트릭 데이터 초기화 로직 제거됨
    // Dispatch storage events to update other components if they are listening
    window.dispatchEvent(new StorageEvent("storage", { key: "fitiUserInfo" }))
    // ... (dispatch for other keys)
    toast({
      title: "데이터 초기화 완료",
      description: "모든 사용자 데이터가 삭제되었습니다. 앱을 다시 시작하려면 온보딩을 진행해주세요.",
    })
    // Optionally redirect to onboarding: router.push('/onboarding')
  }

  return (
    <div className="mobile-layout">
      <div className="page-header mb-4">
        <h1 className="text-2xl font-bold">알림 및 계정 설정</h1>
      </div>
      <div className="p-4 space-y-6 h-[calc(100%-3.5rem)] overflow-y-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Bell className="w-5 h-5 mr-2 text-primary" /> 알림 설정
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-semibold mb-3 text-sm">식사 기록 알림</h4>
              {(["breakfast", "lunch", "dinner"] as MealType[]).map((meal) => {
                const mealLabel = meal === "breakfast" ? "아침" : meal === "lunch" ? "점심" : "저녁"
                return (
                  <div key={meal} className="space-y-2 mb-4 p-3 border rounded-md">
                    <div className="flex items-center justify-between">
                      <Label htmlFor={`${meal}-reminder-enabled`}>{mealLabel} 알림</Label>
                      <Switch
                        id={`${meal}-reminder-enabled`}
                        checked={settings.mealReminders[meal].enabled}
                        onCheckedChange={(checked) => handleMealReminderChange(meal, "enabled", checked)}
                      />
                    </div>
                    {settings.mealReminders[meal].enabled && (
                      <div className="pl-2">
                        <Label htmlFor={`${meal}-reminder-time`} className="text-xs">
                          알림 시간
                        </Label>
                        <Input
                          id={`${meal}-reminder-time`}
                          type="time"
                          value={settings.mealReminders[meal].time}
                          onChange={(e) => handleMealReminderChange(meal, "time", e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
            <div className="border-t pt-6">
              <h4 className="font-semibold mb-2 text-sm">체중 기록 알림</h4>
              <div className="flex items-center justify-between mb-4">
                <Label htmlFor="weight-reminder-enabled">알림 활성화</Label>
                <Switch
                  id="weight-reminder-enabled"
                  checked={settings.weightReminder.enabled}
                  onCheckedChange={(checked) => handleWeightReminderChange("enabled", checked)}
                />
              </div>
              {settings.weightReminder.enabled && (
                <div className="space-y-4 pl-2 border-l-2">
                  <div className="space-y-2">
                    <Label className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" /> 알림 요일
                    </Label>
                    <div className="flex justify-between items-center">
                      {weekDays.map((day) => (
                        <div key={day.id} className="flex flex-col items-center space-y-1">
                          <Label htmlFor={`day-${day.id}`} className="text-xs">
                            {day.label}
                          </Label>
                          <Checkbox
                            id={`day-${day.id}`}
                            checked={settings.weightReminder.days.includes(day.id)}
                            onCheckedChange={(checked) => handleWeightDayChange(day.id, !!checked)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight-reminder-time" className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" /> 알림 시간
                    </Label>
                    <Input
                      id="weight-reminder-time"
                      type="time"
                      value={settings.weightReminder.time}
                      onChange={(e) => handleWeightReminderChange("time", e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">데이터 관리</CardTitle>
          </CardHeader>
          <CardContent>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full justify-start text-left">
                  <Trash2 className="w-4 h-4 mr-2" /> 모든 데이터 초기화
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center">
                    <ShieldAlert className="w-5 h-5 mr-2 text-destructive" />
                    정말로 모든 데이터를 초기화하시겠습니까?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    이 작업은 되돌릴 수 없습니다. 모든 사용자 정보, 목표, 식사, 체중, 알림 및 스트릭 기록이 영구적으로
                    삭제됩니다.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>취소</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDataReset} className="bg-destructive hover:bg-destructive/90">
                    초기화
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <p className="text-xs text-muted-foreground mt-2">
              주의: 데이터 초기화 후에는 온보딩 과정부터 다시 시작해야 합니다.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">앱 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center">
                <Info className="w-4 h-4 mr-2 text-primary" />앱 버전
              </span>
              <span>1.2.0 (Demo)</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
