"use client"

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface MatchData {
  match: {
    match_id: number
    match_datetime: string
    match_type: string
  }
  teams: Array<{
    team_id: number
    name: string
    is_home: boolean
    members: string[]
    goals: Array<{
      player_name: string
      quarter: number
    }>
    ogs: Array<{
      player_name: string
      quarter: number
      team_name: string
    }>
    assists: Array<{
      player_name: string
      quarter: number
    }>
    goalkeepers: Array<{
      player_name: string
      quarter: number
    }>
  }>
  referees: Array<{
    player_name: string
    quarter: number
  }>
  assistantReferees: Array<{
    player_name: string
    quarter: number
  }>
  noShows: Array<{
    player_name: string
  }>
}

export default function MatchView() {
  const searchParams = useSearchParams()
  const matchId = searchParams.get('match_id')
  const [matchData, setMatchData] = useState<MatchData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (matchId) {
      fetchMatchData(matchId)
    }
  }, [matchId])

  const fetchMatchData = async (id: string) => {
    try {
      const response = await fetch(`/api/ballistics/match?match_id=${id}`)
      const result = await response.json()
      
      if (result.success) {
        setMatchData(result.data)
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError('Failed to load match data')
    } finally {
      setLoading(false)
    }
  }

  if (!matchId) {
    return <div className="p-4">No match ID provided</div>
  }

  if (loading) {
    return <div className="p-4">Loading...</div>
  }

  if (error || !matchData) {
    return <div className="p-4">Error: {error || 'Failed to load match data'}</div>
  }

  const homeTeam = matchData.teams.find(t => t.is_home)
  const awayTeam = matchData.teams.find(t => !t.is_home)

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">⚽ 경기 결과</h1>
        
        {/* 경기 정보 */}
        <Card className="mb-4 shadow-md">
          <CardHeader className="bg-gray-100">
            <CardTitle className="text-gray-800">📅 경기 정보</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="font-medium text-gray-600">날짜:</span> {new Date(matchData.match.match_datetime).toLocaleDateString('ko-KR')}
              </div>
              <div>
                <span className="font-medium text-gray-600">유형:</span> {matchData.match.match_type === 'internal' ? '자체전' : '대외전'}
              </div>
            </div>
          </CardContent>
        </Card>

      {/* 스코어 */}
      <Card className="mb-4 shadow-md">
        <CardHeader className="bg-gray-100">
          <CardTitle className="text-gray-800">🏆 최종 스코어</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex justify-center items-center gap-8">
            <div className="text-center">
              <div className="text-gray-700 text-2xl font-bold">
                {homeTeam?.name}
              </div>
              <div className="text-5xl mt-4 font-bold text-gray-800">{(homeTeam?.goals.length || 0) + (homeTeam?.ogs?.length || 0)}</div>
            </div>
            <div className="text-gray-400 text-2xl">VS</div>
            <div className="text-center">
              <div className="text-gray-700 text-2xl font-bold">
                {awayTeam?.name}
              </div>
              <div className="text-5xl mt-4 font-bold text-gray-800">{(awayTeam?.goals.length || 0) + (awayTeam?.ogs?.length || 0)}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 골 기록 */}
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        {matchData.teams.map(team => (
          <Card key={team.team_id} className="shadow-md">
            <CardHeader className="bg-gray-100">
              <CardTitle className="text-gray-800">
                {team.name} 골 기록
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {team.goals.length === 0 && (!team.ogs || team.ogs.length === 0) ? (
                <p className="text-gray-500">골 기록 없음</p>
              ) : (
                <ul className="space-y-1">
                  {team.goals.map((goal, idx) => (
                    <li key={idx} className="text-sm text-gray-700">
                      <span className="font-medium">Q{goal.quarter}</span> - {goal.player_name}
                    </li>
                  ))}
                  {team.ogs?.map((og, idx) => (
                    <li key={`og-${idx}`} className="text-sm text-gray-700">
                      <span className="font-medium">Q{og.quarter}</span> - OG({og.team_name})
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 팀 구성 */}
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        {matchData.teams.map(team => (
          <Card key={team.team_id} className="shadow-md">
            <CardHeader className="bg-gray-100">
              <CardTitle className="text-gray-800">
                {team.name} 선수 명단
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-2">
                {team.members.map((member, idx) => (
                  <span key={idx} className="px-2 py-1 bg-gray-100 rounded text-sm text-gray-700">
                    {member}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 골키퍼 */}
      <Card className="mb-4 shadow-md">
        <CardHeader className="bg-gray-100">
          <CardTitle className="text-gray-800">🥅 쿼터별 골키퍼</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(quarter => (
              <div key={quarter}>
                <h4 className="font-medium text-gray-700 mb-2">Q{quarter}</h4>
                {matchData.teams.map(team => {
                  const gk = team.goalkeepers.find(g => g.quarter === quarter)
                  return gk ? (
                    <div key={team.team_id} className="text-sm mb-1 text-gray-600">
                      {team.name}: {gk.player_name}
                    </div>
                  ) : null
                })}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 심판 */}
      <Card className="mb-4 shadow-md">
        <CardHeader className="bg-gray-100">
          <CardTitle className="text-gray-800">👨‍⚖️ 쿼터별 심판</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(quarter => (
              <div key={quarter}>
                <h4 className="font-medium text-gray-700 mb-2">Q{quarter}</h4>
                <div className="text-sm space-y-1">
                  {matchData.referees
                    .filter(r => r.quarter === quarter)
                    .map((ref, idx) => (
                      <div key={idx} className="text-gray-600">
                        <span className="font-medium">주심:</span> {ref.player_name}
                      </div>
                    ))}
                  {matchData.assistantReferees
                    .filter(r => r.quarter === quarter)
                    .map((ref, idx) => (
                      <div key={idx} className="text-gray-600">
                        <span className="font-medium">부심:</span> {ref.player_name}
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 불참 */}
      {matchData.noShows.length > 0 && (
        <Card className="shadow-md">
          <CardHeader className="bg-gray-100">
            <CardTitle className="text-gray-800">⚪ 불참 인원</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-2">
              {matchData.noShows.map((player, idx) => (
                <span key={idx} className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-sm">
                  {player.player_name}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      </div>
    </div>
  )
}