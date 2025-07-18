"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { User, Settings, LogOut } from "lucide-react"
import { signOut } from "next-auth/react"
import { useTranslation } from "react-i18next"
import '@/i18n'

export default function DashboardPage() {
  const { data: session } = useSession()
  const { t } = useTranslation()

  const handleSignOut = () => {
    signOut({ callbackUrl: "/login" })
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {t('dashboard.welcome', '대시보드')}
            </h1>
            <p className="text-muted-foreground mt-2">
              {session?.user?.email ? 
                `안녕하세요, ${session.user.email}님!` : 
                '프로토타입 애플리케이션에 오신 것을 환영합니다.'
              }
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSignOut}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            로그아웃
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* User Info Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">사용자 정보</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-2xl font-bold">
                  {session?.user?.name || 'Guest User'}
                </div>
                <p className="text-xs text-muted-foreground">
                  {session?.user?.email || 'No email'}
                </p>
                <Badge variant="secondary" className="w-fit">
                  {session?.user?.role || 'User'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">빠른 액션</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href="/edit-profile">프로필 편집</a>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href="/account-settings">계정 설정</a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Application Info Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">애플리케이션 정보</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-sm">
                  <p className="font-medium">프레임워크</p>
                  <p className="text-muted-foreground">Next.js 14</p>
                </div>
                <div className="text-sm">
                  <p className="font-medium">인증</p>
                  <p className="text-muted-foreground">NextAuth.js</p>
                </div>
                <div className="text-sm">
                  <p className="font-medium">상태 관리</p>
                  <p className="text-muted-foreground">Redux Toolkit</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">사용 가능한 기능</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">인증 시스템</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  NextAuth.js를 사용한 완전한 인증 시스템이 구현되어 있습니다.
                  로그인, 회원가입, 세션 관리가 포함되어 있습니다.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">다국어 지원</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  i18next를 사용한 다국어 지원이 구현되어 있습니다.
                  한국어를 기본으로 하며 추가 언어 확장이 가능합니다.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">UI 컴포넌트</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  shadcn/ui 컴포넌트 라이브러리가 설정되어 있으며,
                  Tailwind CSS로 스타일링되어 있습니다.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">상태 관리</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Redux Toolkit이 설정되어 있어 복잡한 상태 관리가 가능합니다.
                  필요에 따라 추가 슬라이스를 생성할 수 있습니다.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}