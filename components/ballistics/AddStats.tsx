"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState, useEffect } from "react"
import participantsData from "@/data/participants.json"

export default function AddStats() {
  const [yellowTeamName, setYellowTeamName] = useState("형광팀")
  const [blueTeamName, setBlueTeamName] = useState("파랑팀")
  const [editingTeam, setEditingTeam] = useState<'yellow' | 'blue' | null>(null)
  const [referee, setReferee] = useState("")
  const [assistantReferees, setAssistantReferees] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredParticipants, setFilteredParticipants] = useState(participantsData)

  useEffect(() => {
    const filtered = participantsData.filter(participant =>
      participant.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredParticipants(filtered)
  }, [searchTerm])

  const handleTeamNameChange = (team: 'yellow' | 'blue', newName: string) => {
    if (team === 'yellow') {
      setYellowTeamName(newName)
    } else {
      setBlueTeamName(newName)
    }
    setEditingTeam(null)
  }

  const handleTeamClick = (team: 'yellow' | 'blue') => {
    setEditingTeam(team)
  }

  const handleKeyPress = (e: React.KeyboardEvent, team: 'yellow' | 'blue') => {
    if (e.key === 'Enter') {
      const target = e.target as HTMLInputElement
      handleTeamNameChange(team, target.value)
    }
    if (e.key === 'Escape') {
      setEditingTeam(null)
    }
  }

  const handleAssistantRefereeChange = (index: number, value: string) => {
    const newAssistantReferees = [...assistantReferees]
    if (value === "") {
      // 빈 값이면 해당 인덱스 제거
      newAssistantReferees.splice(index, 1)
    } else {
      newAssistantReferees[index] = value
    }
    setAssistantReferees(newAssistantReferees)
  }

  const addAssistantReferee = () => {
    if (assistantReferees.length < 2) {
      setAssistantReferees([...assistantReferees, ""])
    }
  }

  const removeAssistantReferee = (index: number) => {
    const newAssistantReferees = assistantReferees.filter((_, i) => i !== index)
    setAssistantReferees(newAssistantReferees)
  }

  return (
    <div className="grid grid-cols-[1fr_3fr] gap-4 h-full">
      {/* 좌측 영역: 날짜 선택 & 참여자 관리 */}
      <Card className="h-full bg-gradient-to-br from-white via-blue-50 to-cyan-50 shadow-xl border-2 border-blue-200">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-t-lg py-2">
          <CardTitle className="text-lg font-bold">📅 경기 설정</CardTitle>
        </CardHeader>
        <CardContent className="h-[calc(100%-50px)] overflow-auto p-4">
          <div className="space-y-3">
            {/* 날짜 선택 */}
            <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="font-medium mb-2 text-gray-800">📅 경기 날짜</h3>
              <input 
                type="date" 
                className="w-full p-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-all"
                defaultValue={new Date().toISOString().split('T')[0]}
              />
            </div>
            
            {/* 참여자 목록 */}
            <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="font-medium mb-2 text-gray-800">👥 참여자 관리</h3>
              <div className="space-y-2">
                <input 
                  type="text" 
                  placeholder="사용자 이름 검색/추가"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-all"
                />
                
                {/* 검색 결과 표시 */}
                {searchTerm && (
                  <div className="bg-white border border-gray-300 rounded-lg shadow-lg max-h-32 overflow-y-auto">
                    {filteredParticipants.length > 0 ? (
                      filteredParticipants.map((participant, index) => (
                        <div
                          key={index}
                          className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm border-b border-gray-100 last:border-b-0"
                          onClick={() => {
                            setSearchTerm("")
                            // 여기서 참여자를 팀에 추가하는 로직을 추가할 수 있습니다
                          }}
                        >
                          {participant.name}
                        </div>
                      ))
                    ) : (
                      <div className="px-3 py-2 text-gray-500 text-sm">
                        검색 결과가 없습니다
                      </div>
                    )}
                  </div>
                )}
                
                {/* 팀 배정 영역 */}
                <div className="space-y-2">
                  <div className="p-3 border-2 border-yellow-400 rounded-lg bg-yellow-50 shadow-sm">
                    <h4 className="font-medium text-yellow-700 mb-2 flex items-center">
                      🟡 {yellowTeamName}
                    </h4>
                    <div className="space-y-1">
                      <div className="text-sm p-1 bg-white rounded border border-gray-200">
                        김철수 ✅
                      </div>
                      <div className="text-sm p-1 bg-white rounded border border-gray-200">
                        이영희 ✅
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 border-2 border-blue-400 rounded-lg bg-blue-50 shadow-sm">
                    <h4 className="font-medium text-blue-700 mb-2 flex items-center">
                      🔵 {blueTeamName}
                    </h4>
                    <div className="space-y-1">
                      <div className="text-sm p-1 bg-white rounded border border-gray-200">
                        박민수 ✅
                      </div>
                      <div className="text-sm p-1 bg-white rounded border border-gray-200">
                        최영수 ✅
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* 우측 영역: 경기 진행 & 기록 */}
      <Card className="h-full bg-gradient-to-br from-white via-purple-50 to-pink-50 shadow-xl border-2 border-purple-200">
        <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg py-2">
          <CardTitle className="text-lg font-bold">⚽ 경기 기록</CardTitle>
        </CardHeader>
        <CardContent className="h-[calc(100%-50px)] overflow-auto p-4">
          <div className="space-y-4">
            {/* 주심/부심 선택 */}
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="font-medium mb-2 text-gray-800">👨‍⚖️ 심판 선택</h3>
              <div className="space-y-3">
                <div>
                  <label className="block font-medium mb-1 text-gray-700">주심</label>
                  <select 
                    className="w-full p-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-all"
                    value={referee}
                    onChange={(e) => setReferee(e.target.value)}
                  >
                    <option value="">주심 선택</option>
                    {participantsData.map((participant, index) => (
                      <option key={index} value={participant.name}>{participant.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-medium text-gray-700">부심 ({assistantReferees.length}/2)</label>
                    {assistantReferees.length < 2 && (
                      <button
                        type="button"
                        onClick={addAssistantReferee}
                        className="text-blue-500 hover:text-blue-700 text-sm font-medium"
                      >
                        + 추가
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {/* 부심 1 */}
                    <div className="flex gap-1">
                      <select
                        className="flex-1 p-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-all text-sm"
                        value={assistantReferees[0] || ""}
                        onChange={(e) => handleAssistantRefereeChange(0, e.target.value)}
                      >
                        <option value="">부심 1</option>
                        {participantsData.map((participant, index) => (
                          <option key={index} value={participant.name}>{participant.name}</option>
                        ))}
                      </select>
                      {assistantReferees.length > 0 && assistantReferees[0] && (
                        <button
                          type="button"
                          onClick={() => removeAssistantReferee(0)}
                          className="px-1 py-1 text-red-500 hover:text-red-700 text-sm"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                    
                    {/* 부심 2 */}
                    <div className="flex gap-1">
                      <select
                        className="flex-1 p-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-all text-sm"
                        value={assistantReferees[1] || ""}
                        onChange={(e) => handleAssistantRefereeChange(1, e.target.value)}
                      >
                        <option value="">부심 2</option>
                        {participantsData.map((participant, index) => (
                          <option key={index} value={participant.name}>{participant.name}</option>
                        ))}
                      </select>
                      {assistantReferees.length > 1 && assistantReferees[1] && (
                        <button
                          type="button"
                          onClick={() => removeAssistantReferee(1)}
                          className="px-1 py-1 text-red-500 hover:text-red-700 text-sm"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 점수 표시 */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between text-4xl font-bold">
                <div 
                  className="text-yellow-600 bg-yellow-100 px-4 py-2 rounded-lg shadow-sm cursor-pointer hover:bg-yellow-200 transition-colors"
                  onClick={() => handleTeamClick('yellow')}
                >
                  🟡 {editingTeam === 'yellow' ? (
                    <input
                      type="text"
                      defaultValue={yellowTeamName}
                      className="bg-transparent border-b-2 border-yellow-600 outline-none text-4xl font-bold text-yellow-600 w-32"
                      onBlur={(e) => handleTeamNameChange('yellow', e.target.value)}
                      onKeyDown={(e) => handleKeyPress(e, 'yellow')}
                      autoFocus
                    />
                  ) : (
                    yellowTeamName
                  )} 2
                </div>
                <div className="text-gray-600 text-2xl">VS</div>
                <div 
                  className="text-blue-600 bg-blue-100 px-4 py-2 rounded-lg shadow-sm cursor-pointer hover:bg-blue-200 transition-colors"
                  onClick={() => handleTeamClick('blue')}
                >
                  🔵 {editingTeam === 'blue' ? (
                    <input
                      type="text"
                      defaultValue={blueTeamName}
                      className="bg-transparent border-b-2 border-blue-600 outline-none text-4xl font-bold text-blue-600 w-32"
                      onBlur={(e) => handleTeamNameChange('blue', e.target.value)}
                      onKeyDown={(e) => handleKeyPress(e, 'blue')}
                      autoFocus
                    />
                  ) : (
                    blueTeamName
                  )} 1
                </div>
              </div>
            </div>
            
            {/* 쿼터별 기록 */}
            <div className="grid grid-cols-4 gap-3">
              {['1Q', '2Q', '3Q', '4Q'].map((quarter, index) => (
                <div key={quarter} className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
                  <h4 className="font-medium text-center mb-2 text-gray-800">{quarter}</h4>
                  <div className="space-y-1 text-xs">
                    <div className="text-gray-600 bg-gray-50 p-1 rounded border">
                      ⚽ 김철수 (15')
                    </div>
                    <div className="text-gray-600 bg-gray-50 p-1 rounded border">
                      🎯 이영희 → 김철수
                    </div>
                  </div>
                  <button className="w-full mt-2 p-2 rounded text-sm font-medium transition-all hover:bg-blue-600 bg-blue-500 text-white">
                    기록 추가
                  </button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}