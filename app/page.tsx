"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Leaderboard from "@/components/ballistics/Leaderboard"
import AddStats from "@/components/ballistics/AddStats"
import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import Image from 'next/image'

function HomeContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("leaderboard")
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab === 'add-stats') {
      setActiveTab('add-stats')
    } else {
      setActiveTab('leaderboard')
    }
  }, [searchParams])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isFullscreen])

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    // URL 업데이트
    const newUrl = value === 'leaderboard' ? '/' : `/?tab=${value}`
    router.push(newUrl, { scroll: false })
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }
  return (
    <div id="home-container" className="min-h-screen w-full bg-gradient-to-br from-green-50 via-blue-50 to-yellow-50" style={{ touchAction: 'manipulation' }}>
      {/* 태블릿 가로 모드 최적화 (2000×1200px) */}
      <div id="main-wrapper" className="w-full h-screen overflow-hidden">
        {!isFullscreen && (
          <header id="main-header" className="flex items-center justify-between px-4 py-2 border-b bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-lg">
            <div className="flex items-center space-x-3">
              {/* <Image 
                src="/images/ballistics-logo.png" 
                alt="Ballistics Logo" 
                width={32}
                height={32}
                className="w-8 h-8"
              /> */}
              <h1 className="text-2xl font-bold">Ballistics</h1>
            </div>
            <p className="text-sm opacity-90">FC 재간둥이 경기 기록 시스템</p>
          </header>
        )}
        
        <main id="main-content-area" className={isFullscreen ? "h-screen" : "h-[calc(100vh-60px)]"}>
          <Tabs id="main-tabs" value={activeTab} onValueChange={handleTabChange} className="h-full">
            <div id="tabs-container" className="bg-white/90 backdrop-blur-sm shadow-sm border border-gray-200 rounded-lg mx-4 mt-3 mb-2 p-1">
              <div className="flex items-center justify-between">
                <TabsList id="tabs-list" className="grid grid-cols-2 bg-transparent shadow-none border-none h-12 flex-1">
                  <TabsTrigger 
                    value="leaderboard" 
                    className="text-base py-2 px-4 data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-400 data-[state=active]:to-orange-500 data-[state=active]:text-white font-medium transition-all duration-200 data-[state=inactive]:text-gray-600 data-[state=active]:shadow-md rounded-md h-10 touch-manipulation select-none cursor-pointer"
                  >
                    🏆 Leaderboard
                  </TabsTrigger>
                  <TabsTrigger 
                    value="add-stats" 
                    className="text-base py-2 px-4 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white font-medium transition-all duration-200 data-[state=inactive]:text-gray-600 data-[state=active]:shadow-md rounded-md h-10 touch-manipulation select-none cursor-pointer"
                  >
                    ✍️ Add Stats
                  </TabsTrigger>
                </TabsList>
                
                {/* 전체화면 버튼 - 모든 탭에서 표시 */}
                <button
                  id="fullscreen-toggle-btn"
                  onClick={toggleFullscreen}
                  className="ml-2 p-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors touch-manipulation cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
                  title={isFullscreen ? "일반 화면으로 돌아가기" : "전체화면으로 보기"}
                >
                  {isFullscreen ? (
                    <span className="text-sm">🔽</span>
                  ) : (
                    <span className="text-sm">🔍</span>
                  )}
                </button>
              </div>
            </div>
            
            <TabsContent id="leaderboard-tab-content" value="leaderboard" className={`m-4 mt-3 ${isFullscreen ? "h-[calc(100%-60px)]" : "h-[calc(100%-60px)]"}`}>
              <Leaderboard />
            </TabsContent>
            
            <TabsContent id="add-stats-tab-content" value="add-stats" className={`m-4 mt-3 ${isFullscreen ? "h-[calc(100%-60px)]" : "h-[calc(100%-66px)]"}`}>
              <AddStats />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">로딩 중...</p>
        </div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  )
}