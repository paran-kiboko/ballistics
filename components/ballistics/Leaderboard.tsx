"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function Leaderboard() {
  // 임시 데이터 - 추후 Redux에서 가져올 예정
  const mockData = [
    {
      name: "김철수",
      gamesPlayed: 12,
      wins: 8,
      draws: 2,
      losses: 2,
      points: 28,
      goals: 15,
      assists: 8,
      semiAssists: 12,
      noShows: 0
    },
    {
      name: "이영희",
      gamesPlayed: 10,
      wins: 6,
      draws: 3,
      losses: 1,
      points: 25,
      goals: 12,
      assists: 10,
      semiAssists: 8,
      noShows: 1
    },
    {
      name: "박민수",
      gamesPlayed: 8,
      wins: 4,
      draws: 2,
      losses: 2,
      points: 18,
      goals: 8,
      assists: 5,
      semiAssists: 6,
      noShows: 0
    }
  ]

  return (
    <Card className="h-full bg-gradient-to-br from-white via-amber-50 to-orange-50 shadow-xl border-2 border-amber-200">
      <CardHeader className="bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-t-lg py-2">
        <CardTitle className="text-lg font-bold">🏆 리더보드</CardTitle>
      </CardHeader>
      <CardContent className="h-[calc(100%-50px)] overflow-auto p-4">
        <Table>
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
            {mockData
              .sort((a, b) => b.points - a.points)
              .map((player, index) => (
                <TableRow 
                  key={player.name} 
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
                  <TableCell className="text-center font-medium">{player.gamesPlayed}</TableCell>
                  <TableCell className="text-center font-semibold text-green-600">
                    {player.wins}
                  </TableCell>
                  <TableCell className="text-center font-semibold text-yellow-600">
                    {player.draws}
                  </TableCell>
                  <TableCell className="text-center font-semibold text-red-600">
                    {player.losses}
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
                    👍 {player.semiAssists}
                  </TableCell>
                  <TableCell className="text-center font-semibold text-red-600">
                    ❌ {player.noShows}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        
        {/* 승점 계산 방법 설명 */}
        <div className="mt-4 p-4 bg-gradient-to-r from-amber-100 to-orange-100 rounded-lg border-2 border-amber-300">
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