"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useEffect, useState } from "react"

interface PlayerStats {
  player_id: number
  name: string
  matches_played: number
  goals: number
  assists: number
  semi_assists: number
  gk_quarters: number
  referee_quarters: number
  assistant_referee_quarters: number
  no_shows: number
  points: number
}

interface LeaderboardData {
  players: PlayerStats[]
  teams: any[]
  recentMatches: any[]
  mvpCandidates: any[]
}

export default function Leaderboard() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<LeaderboardData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchLeaderboardData()
  }, [])

  const fetchLeaderboardData = async () => {
    try {
      const response = await fetch('/api/ballistics/leaderboard')
      const result = await response.json()
      
      if (result.success) {
        setData(result.data)
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError('Failed to load leaderboard data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card className="h-full bg-gradient-to-br from-white via-amber-50 to-orange-50 shadow-xl border-2 border-amber-200">
        <CardHeader className="bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-t-lg py-2">
          <CardTitle className="text-lg font-bold">🏆 리더보드</CardTitle>
        </CardHeader>
        <CardContent className="h-[calc(100%-50px)] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">데이터 로딩 중...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || !data) {
    return (
      <Card className="h-full bg-gradient-to-br from-white via-amber-50 to-orange-50 shadow-xl border-2 border-amber-200">
        <CardHeader className="bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-t-lg py-2">
          <CardTitle className="text-lg font-bold">🏆 리더보드</CardTitle>
        </CardHeader>
        <CardContent className="h-[calc(100%-50px)] flex items-center justify-center">
          <p className="text-red-600">데이터를 불러오는 중 오류가 발생했습니다.</p>
        </CardContent>
      </Card>
    )
  }


  return (
    <Card id="leaderboard-card" className="h-full bg-gradient-to-br from-white via-amber-50 to-orange-50 shadow-xl border-2 border-amber-200">
      <CardHeader className="bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-t-lg py-2">
        <CardTitle className="text-lg font-bold">🏆 리더보드</CardTitle>
      </CardHeader>
      <CardContent id="leaderboard-content" className="h-[calc(100%-50px)] overflow-auto p-4">
        <Table id="leaderboard-table">
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-amber-100 to-orange-100 border-b-2 border-amber-300">
              <TableHead className="text-center font-bold text-amber-800">순위</TableHead>
              <TableHead className="font-bold text-amber-800">이름</TableHead>
              <TableHead className="text-center font-bold text-amber-800">경기수</TableHead>
              <TableHead className="text-center font-bold text-amber-800">승</TableHead>
              <TableHead className="text-center font-bold text-amber-800">무</TableHead>
              <TableHead className="text-center font-bold text-amber-800">패</TableHead>
              <TableHead className="text-center font-bold text-amber-800">승점</TableHead>
              <TableHead className="text-center font-bold text-amber-800">골</TableHead>
              <TableHead className="text-center font-bold text-amber-800">어시스트</TableHead>
              <TableHead className="text-center font-bold text-amber-800">세미어시스트</TableHead>
              <TableHead className="text-center font-bold text-amber-800">No Show</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.players
              .map((player, index) => (
                <TableRow 
                  key={player.player_id} 
                  className={`hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 border-b border-amber-200 ${
                    index === 0 ? 'bg-gradient-to-r from-yellow-100 to-amber-100' : 
                    index === 1 ? 'bg-gradient-to-r from-gray-100 to-gray-200' :
                    index === 2 ? 'bg-gradient-to-r from-orange-100 to-amber-100' : 
                    'bg-white/70'
                  }`}
                >
                  <TableCell className="text-center font-bold text-lg">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                  </TableCell>
                  <TableCell className="font-semibold text-lg text-gray-800">
                    {player.name}
                  </TableCell>
                  <TableCell className="text-center font-medium">{player.matches_played}</TableCell>
                  <TableCell className="text-center font-semibold text-green-600">
                    -
                  </TableCell>
                  <TableCell className="text-center font-semibold text-yellow-600">
                    -
                  </TableCell>
                  <TableCell className="text-center font-semibold text-red-600">
                    -
                  </TableCell>
                  <TableCell className="text-center font-bold text-amber-700 text-lg">
                    {player.points}
                  </TableCell>
                  <TableCell className="text-center font-semibold">
                    ⚽ {player.goals}
                  </TableCell>
                  <TableCell className="text-center font-semibold">
                    🎯 {player.assists}
                  </TableCell>
                  <TableCell className="text-center font-semibold">
                    👍 {player.semi_assists}
                  </TableCell>
                  <TableCell className="text-center font-semibold text-red-600">
                    ❌ {player.no_shows}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        
        {/* MVP 후보 */}
        {data.mvpCandidates && data.mvpCandidates.length > 0 && (
          <div className="mt-4 p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg border-2 border-purple-300">
            <h3 className="font-bold text-purple-800 mb-2 text-center">🌟 MVP 후보 (경기당 포인트)</h3>
            <div className="grid grid-cols-5 gap-2">
              {data.mvpCandidates.map((mvp: any, index: number) => (
                <div key={index} className="text-center p-2 bg-white rounded-lg border border-purple-300">
                  <div className="font-bold text-purple-700">{mvp.name}</div>
                  <div className="text-2xl font-bold text-purple-900">{mvp.points_per_match}</div>
                  <div className="text-xs text-gray-600">{mvp.matches}경기</div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* 승점 계산 방법 설명 */}
        <div id="scoring-system-info" className="mt-4 p-4 bg-gradient-to-r from-amber-100 to-orange-100 rounded-lg border-2 border-amber-300">
          <h3 className="font-bold text-amber-800 mb-2 text-center">📊 승점 계산 방법</h3>
          <div className="grid grid-cols-4 gap-2 text-sm">
            <div className="flex items-center justify-center p-2 bg-white rounded-lg border border-amber-300">
              <span className="text-amber-700 font-semibold">🏆 승리: 3점</span>
            </div>
            <div className="flex items-center justify-center p-2 bg-white rounded-lg border border-amber-300">
              <span className="text-amber-700 font-semibold">🤝 무승부: 2점</span>
            </div>
            <div className="flex items-center justify-center p-2 bg-white rounded-lg border border-amber-300">
              <span className="text-amber-700 font-semibold">💔 패배: 1점</span>
            </div>
            <div className="flex items-center justify-center p-2 bg-white rounded-lg border border-amber-300">
              <span className="text-amber-700 font-semibold">❌ 노쇼: -1점</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}