"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Leaderboard from "@/components/ballistics/Leaderboard"
import AddStats from "@/components/ballistics/AddStats"

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-green-50 via-blue-50 to-yellow-50">
      {/* 태블릿 가로 모드 최적화 (2000×1200px) */}
      <div className="w-full h-screen overflow-hidden">
        <header className="flex items-center justify-between px-4 py-2 border-b bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-lg">
          <h1 className="text-2xl font-bold">⚽ Ballistics</h1>
          <p className="text-sm opacity-90">축구 동호회 경기 기록 시스템</p>
        </header>
        
        <main className="h-[calc(100vh-60px)]">
          <Tabs defaultValue="leaderboard" className="h-full">
            <div className="bg-white/90 backdrop-blur-sm shadow-sm border border-gray-200 rounded-lg mx-4 mt-3 mb-2 p-1">
              <TabsList className="grid w-full grid-cols-2 bg-transparent shadow-none border-none h-10">
                <TabsTrigger 
                  value="leaderboard" 
                  className="text-base py-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-400 data-[state=active]:to-orange-500 data-[state=active]:text-white font-medium transition-all duration-200 data-[state=inactive]:text-gray-600 data-[state=active]:shadow-md rounded-md h-8"
                >
                  🏆 Leaderboard
                </TabsTrigger>
                <TabsTrigger 
                  value="add-stats" 
                  className="text-base py-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white font-medium transition-all duration-200 data-[state=inactive]:text-gray-600 data-[state=active]:shadow-md rounded-md h-8"
                >
                  ✍️ Add Stats
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="leaderboard" className="h-[calc(100%-60px)] m-4 mt-3">
              <Leaderboard />
            </TabsContent>
            
            <TabsContent value="add-stats" className="h-[calc(100%-60px)] m-4 mt-3">
              <AddStats />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}