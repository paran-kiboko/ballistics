"use client"

import { useEffect, useState } from "react"
import { MobileLayout } from "@/components/fiti/mobile-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ChevronRight, Edit3, LogOut, Settings, Target, UserCog, Activity, Star, Utensils, Users } from "lucide-react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/fiti/page-header"
import Link from "next/link"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface UserInfo {
  gender: string
  age: string
  height: string
  currentWeight: string
  goalWeight: string
  activityLevel: string
}

interface NutrientGoal {
  calories: number
  carbs: number
  protein: number
  fat: number
  currentBmi?: number
  currentBmiStatus?: string
  targetBmi?: number
  targetBmiStatus?: string
}

export default function ProfilePage() {
  const [userInfo, setUserInfo] = useState<Partial<UserInfo>>({})
  const [userGoals, setUserGoals] = useState<Partial<NutrientGoal>>({})
  const [isPremiumUser, setIsPremiumUser] = useState(false)
  const [isSocialEnabled, setIsSocialEnabled] = useState(false) // 소셜 기능 활성화 상태
  const router = useRouter()

  useEffect(() => {
    const storedInfo = localStorage.getItem("fitiUserInfo")
    const storedGoals = localStorage.getItem("fitiUserGoals")
    const premiumStatus = localStorage.getItem("fitiIsPremiumUser") === "true"
    const socialStatus = localStorage.getItem("fitiCoachSocialEnabled") === "true" // 소셜 기능 상태 로드

    if (storedInfo) setUserInfo(JSON.parse(storedInfo))
    if (storedGoals) setUserGoals(JSON.parse(storedGoals))
    setIsPremiumUser(premiumStatus)
    setIsSocialEnabled(socialStatus) // 상태 설정

    // Listen for storage changes to update premium status
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "fitiIsPremiumUser") {
        setIsPremiumUser(event.newValue === "true")
      }
      if (event.key === "fitiUserInfo") {
        setUserInfo(event.newValue ? JSON.parse(event.newValue) : {})
      }
      if (event.key === "fitiUserGoals") {
        setUserGoals(event.newValue ? JSON.parse(event.newValue) : {})
      }
      if (event.key === "fitiCoachSocialEnabled") {
        setIsSocialEnabled(event.newValue === "true")
      }
    }
    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  const activityLevelMap: { [key: string]: string } = {
    sedentary: "비활동적",
    light: "가벼운 활동",
    moderate: "보통 활동",
    active: "활동적",
    very_active: "매우 활동적",
  }

  const handleLogout = () => {
    localStorage.removeItem("fitiUserInfo")
    localStorage.removeItem("fitiUserGoals")
    localStorage.removeItem("fitiDailyIntake")
    localStorage.removeItem("fitiWeightHistory")
    localStorage.removeItem("fitiNotificationSettings")
    localStorage.removeItem("fitiStreakData")
    localStorage.setItem("fitiIsPremiumUser", "false")
    alert("로그아웃 되었습니다. Zap 코치가 회원님을 기다리고 있을게요!")
    router.push("/onboarding")
  }

  const handleSocialToggle = (enabled: boolean) => {
    setIsSocialEnabled(enabled)
    localStorage.setItem("fitiCoachSocialEnabled", String(enabled))
    // 처음 활성화 시 그룹 배정 시뮬레이션
    if (enabled && !localStorage.getItem("fitiCoachUserGroup")) {
      localStorage.setItem("fitiCoachUserGroup", `group-${Math.floor(Math.random() * 100)}`)
    }
  }

  return (
    <MobileLayout showBottomNav currentPage="profile">
      <PageHeader title="내 프로필" showBackButton={false} />
      <div className="p-4 space-y-6 pb-20 h-[calc(100%-3.5rem)] overflow-y-auto">
        <header className="flex items-center space-x-4 pt-2">
          <Avatar className="w-16 h-16">
            <AvatarImage src="/diverse-user-avatars.png" alt="User Avatar" />
            <AvatarFallback>{userInfo.age ? userInfo.age.charAt(0) : "U"}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-xl font-bold">사용자 님</h1>
            <p className="text-sm text-muted-foreground">fiti 코치가 항상 응원하고 있어요! 💪</p>
            {isPremiumUser && (
              <div className="mt-1 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 border border-yellow-300">
                <Star className="w-3 h-3 mr-1" /> 프리미엄 회원
              </div>
            )}
          </div>
        </header>

        {!isPremiumUser && (
          <Card className="bg-blue-50 border-blue-200 hover:shadow-lg transition-shadow">
            <Link href="/subscribe" passHref>
              <CardContent className="p-4 flex items-center justify-between cursor-pointer">
                <div>
                  <CardTitle className="text-md text-blue-700">FITI 프리미엄으로 업그레이드</CardTitle>
                  <CardDescription className="text-sm text-blue-600">
                    모든 기능을 잠금 해제하고 AI 코칭을 최대로 활용하세요!
                  </CardDescription>
                </div>
                <Button size="sm" variant="default" className="bg-blue-600 hover:bg-blue-700">
                  자세히 보기 <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </CardContent>
            </Link>
          </Card>
        )}

        {userGoals.currentBmi && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Activity className="w-5 h-5 mr-2 text-primary" /> 나의 건강 상태
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>현재 BMI:</span>
                <span className="font-semibold">
                  {userGoals.currentBmi} ({userGoals.currentBmiStatus})
                </span>
              </div>
              <div className="flex justify-between">
                <span>목표 BMI:</span>
                <span className="font-semibold">
                  {userGoals.targetBmi} ({userGoals.targetBmiStatus})
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">내 정보</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-3 right-3"
              onClick={() => router.push("/edit-profile")}
            >
              <Edit3 className="w-4 h-4 mr-1" /> 수정
            </Button>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>나이:</span> <span>{userInfo.age || "N/A"}세</span>
            </div>
            <div className="flex justify-between">
              <span>신장:</span> <span>{userInfo.height || "N/A"}cm</span>
            </div>
            <div className="flex justify-between">
              <span>현재 체중:</span> <span>{userInfo.currentWeight || "N/A"}kg</span>
            </div>
            <div className="flex justify-between">
              <span>목표 체중:</span> <span>{userInfo.goalWeight || "N/A"}kg</span>
            </div>
            <div className="flex justify-between">
              <span>활동 수준:</span> <span>{activityLevelMap[userInfo.activityLevel || ""] || "N/A"}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">나의 목표</CardTitle>
            <CardDescription>fiti 코치가 설정한 일일 권장 섭취량이에요.</CardDescription>
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-3 right-3"
              onClick={() => router.push("/edit-goals")}
            >
              <Target className="w-4 h-4 mr-1" /> 수정
            </Button>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>총 칼로리:</span>{" "}
              <span className="font-semibold">{userGoals.calories?.toLocaleString() || "N/A"} kcal</span>
            </div>
            <div className="flex justify-between">
              <span>탄수화물:</span> <span>{userGoals.carbs || "N/A"}g</span>
            </div>
            <div className="flex justify-between">
              <span>단백질:</span> <span>{userGoals.protein || "N/A"}g</span>
            </div>
            <div className="flex justify-between">
              <span>지방:</span> <span>{userGoals.fat || "N/A"}g</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Users className="w-5 h-5 mr-2 text-primary" /> 그룹 소셜 기능
            </CardTitle>
            <CardDescription>비슷한 목표를 가진 사람들과 익명으로 소통하며 동기를 부여받으세요.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <Label htmlFor="social-toggle" className="flex-grow pr-4">
                그룹 소셜 기능 참여
              </Label>
              <Switch id="social-toggle" checked={isSocialEnabled} onCheckedChange={handleSocialToggle} />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-1">
          <Button
            variant="ghost"
            className="w-full justify-between text-muted-foreground hover:text-foreground hover:bg-accent"
            onClick={() => router.push("/edit-profile")}
          >
            <div className="flex items-center">
              <UserCog className="w-5 h-5 mr-3" /> 개인 정보 수정하기
            </div>
            <ChevronRight className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-between text-muted-foreground hover:text-foreground hover:bg-accent"
            onClick={() => router.push("/meal-history")}
          >
            <div className="flex items-center">
              <Utensils className="w-5 h-5 mr-3" /> 식사 기록 히스토리 보기
            </div>
            <ChevronRight className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-between text-muted-foreground hover:text-foreground hover:bg-accent"
            onClick={() => router.push("/account-settings")}
          >
            <div className="flex items-center">
              <Settings className="w-5 h-5 mr-3" /> 알림 및 계정 설정
            </div>
            <ChevronRight className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full justify-between text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <div className="flex items-center">
              <LogOut className="w-5 h-5 mr-3" /> 로그아웃하기
            </div>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </MobileLayout>
  )
}
