"use client"

import { redirect } from 'next/navigation'
import { useEffect } from 'react'

export default function LeaderboardPage() {
  useEffect(() => {
    // 클라이언트 사이드에서 리다이렉트
    window.location.href = '/?tab=leaderboard'
  }, [])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">리더보드로 이동 중...</p>
      </div>
    </div>
  )
}