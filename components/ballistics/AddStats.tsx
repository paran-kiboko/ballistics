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
  const [yellowTeamMembers, setYellowTeamMembers] = useState<string[]>(["김철수", "이영희"])
  const [blueTeamMembers, setBlueTeamMembers] = useState<string[]>(["박민수", "최영수"])
  const [unassignedMembers, setUnassignedMembers] = useState<string[]>(["정하늘", "송미래", "조현우", "윤서연"])
  const [showAddPlayerModal, setShowAddPlayerModal] = useState<'yellow' | 'blue' | 'unassigned' | null>(null)
  const [yellowTeamGoals, setYellowTeamGoals] = useState<Array<{player: string, time: string, quarter: string, assist?: string, semiAssist?: string}>>([
    {player: "김철수", time: "15'", quarter: "Q1"},
    {player: "이영희", time: "27'", quarter: "Q2"}
  ])
  const [blueTeamGoals, setBlueTeamGoals] = useState<Array<{player: string, time: string, quarter: string, assist?: string, semiAssist?: string}>>([
    {player: "박민수", time: "42'", quarter: "Q3"}
  ])
  
  // Quarter-based referee tracking
  const [refereesByQuarter, setRefereesByQuarter] = useState<{[key: string]: string}>({
    Q1: "", Q2: "", Q3: "", Q4: ""
  })
  const [assistantRefereesByQuarter, setAssistantRefereesByQuarter] = useState<{[key: string]: string[]}>({
    Q1: [], Q2: [], Q3: [], Q4: []
  })
  
  // Goal record modal state
  const [showGoalModal, setShowGoalModal] = useState<{team: 'yellow' | 'blue', quarter: string} | null>(null)
  const [selectedGoalScorer, setSelectedGoalScorer] = useState("")
  const [selectedAssist, setSelectedAssist] = useState("")
  const [selectedSemiAssist, setSelectedSemiAssist] = useState("")


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

  const addPlayerToTeam = (playerName: string, team: 'yellow' | 'blue' | 'unassigned') => {
    // 먼저 다른 팀에서 제거
    setYellowTeamMembers(yellowTeamMembers.filter(name => name !== playerName))
    setBlueTeamMembers(blueTeamMembers.filter(name => name !== playerName))
    setUnassignedMembers(unassignedMembers.filter(name => name !== playerName))
    
    // 새로운 팀에 추가
    if (team === 'yellow') {
      setYellowTeamMembers([...yellowTeamMembers.filter(name => name !== playerName), playerName])
    } else if (team === 'blue') {
      setBlueTeamMembers([...blueTeamMembers.filter(name => name !== playerName), playerName])
    } else if (team === 'unassigned') {
      setUnassignedMembers([...unassignedMembers.filter(name => name !== playerName), playerName])
    }
    setShowAddPlayerModal(null)
  }

  const removePlayerFromTeam = (playerName: string, team: 'yellow' | 'blue' | 'unassigned') => {
    if (team === 'yellow') {
      setYellowTeamMembers(yellowTeamMembers.filter(name => name !== playerName))
      // 형광팀에서 제거된 플레이어를 미배정 인원으로 이동
      if (!unassignedMembers.includes(playerName)) {
        setUnassignedMembers([...unassignedMembers, playerName])
      }
    } else if (team === 'blue') {
      setBlueTeamMembers(blueTeamMembers.filter(name => name !== playerName))
      // 파랑팀에서 제거된 플레이어를 미배정 인원으로 이동
      if (!unassignedMembers.includes(playerName)) {
        setUnassignedMembers([...unassignedMembers, playerName])
      }
    } else if (team === 'unassigned') {
      // 미배정 인원에서 제거는 완전 제거
      setUnassignedMembers(unassignedMembers.filter(name => name !== playerName))
    }
  }

  const completelyRemovePlayer = (playerName: string) => {
    // 모든 팀에서 완전히 제거
    setYellowTeamMembers(yellowTeamMembers.filter(name => name !== playerName))
    setBlueTeamMembers(blueTeamMembers.filter(name => name !== playerName))
    setUnassignedMembers(unassignedMembers.filter(name => name !== playerName))
  }

  // Quarter-based referee handlers
  const handleQuarterRefereeChange = (quarter: string, value: string) => {
    setRefereesByQuarter(prev => ({
      ...prev,
      [quarter]: value
    }))
  }

  const handleQuarterAssistantRefereeChange = (quarter: string, index: number, value: string) => {
    setAssistantRefereesByQuarter(prev => {
      const newAssistants = [...(prev[quarter] || [])]
      if (value === "") {
        newAssistants.splice(index, 1)
      } else {
        newAssistants[index] = value
      }
      return {
        ...prev,
        [quarter]: newAssistants
      }
    })
  }

  const removeQuarterAssistantReferee = (quarter: string, index: number) => {
    setAssistantRefereesByQuarter(prev => {
      const newAssistants = (prev[quarter] || []).filter((_, i) => i !== index)
      return {
        ...prev,
        [quarter]: newAssistants
      }
    })
  }

  // Helper function to get all selected referees for a quarter
  const getSelectedRefereesForQuarter = (quarter: string) => {
    const selected: string[] = []
    if (refereesByQuarter[quarter]) {
      selected.push(refereesByQuarter[quarter])
    }
    if (assistantRefereesByQuarter[quarter]) {
      selected.push(...assistantRefereesByQuarter[quarter])
    }
    return selected.filter(Boolean) // Remove empty strings
  }

  // Goal record handlers
  const handleAddGoalRecord = () => {
    if (!showGoalModal || !selectedGoalScorer) return

    const newGoal = {
      player: selectedGoalScorer,
      time: "", // We're not using time anymore
      quarter: showGoalModal.quarter,
      assist: selectedAssist,
      semiAssist: selectedSemiAssist
    }

    if (showGoalModal.team === 'yellow') {
      setYellowTeamGoals([...yellowTeamGoals, newGoal])
    } else {
      setBlueTeamGoals([...blueTeamGoals, newGoal])
    }

    // Reset modal state
    setShowGoalModal(null)
    setSelectedGoalScorer("")
    setSelectedAssist("")
    setSelectedSemiAssist("")
  }

  const openGoalModal = (team: 'yellow' | 'blue') => {
    // Determine current quarter based on existing goals or default to Q1
    const currentQuarter = 'Q1' // You might want to make this dynamic
    setShowGoalModal({ team, quarter: currentQuarter })
  }

  const deleteGoalRecord = (team: 'yellow' | 'blue', index: number) => {
    if (team === 'yellow') {
      setYellowTeamGoals(yellowTeamGoals.filter((_, i) => i !== index))
    } else {
      setBlueTeamGoals(blueTeamGoals.filter((_, i) => i !== index))
    }
  }

  return (
    <div id="add-stats-container" className="grid grid-cols-[1fr_3fr] gap-4 h-full overflow-hidden">
      {/* 좌측 영역: 날짜 선택 & Check-In */}
      <Card id="game-settings-card" className="h-full bg-gradient-to-br from-white via-blue-50 to-cyan-50 shadow-xl border-2 border-blue-200 flex flex-col overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-t-lg py-2 flex-shrink-0">
          <CardTitle className="text-lg font-bold">📅 경기 설정</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto p-4 min-h-0">
          <div className="space-y-3">
            {/* 날짜 선택 */}
            <div id="game-date-section" className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="font-medium mb-2 text-gray-800">📅 경기 날짜</h3>
              <input 
                type="date" 
                className="w-full p-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-all"
                defaultValue={new Date().toISOString().split('T')[0]}
              />
            </div>
            
            {/* 참여자 목록 */}
            <div id="participants-management-section" className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="font-medium mb-2 text-gray-800">👥 Check-In</h3>
              <div className="space-y-2">
                {/* 팀 배정 영역 */}
                <div className="space-y-2">
                  <div id="yellow-team-card" className="p-3 border-2 border-green-400 rounded-lg bg-green-50 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-green-700 flex items-center">
                        🟢 {yellowTeamName}
                      </h4>
                      <button
                        onClick={() => setShowAddPlayerModal('yellow')}
                        className="text-xs bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600 transition-colors touch-manipulation cursor-pointer min-h-[32px] min-w-[50px]"
                      >
                        + 추가
                      </button>
                    </div>
                    <div className="space-y-1">
                      {yellowTeamMembers.sort().map((member, index) => (
                        <div key={index} className="text-sm p-1 bg-white rounded border border-gray-200 flex items-center justify-between">
                          <span>{member} </span>
                          <button
                            onClick={() => removePlayerFromTeam(member, 'yellow')}
                            className="text-red-500 hover:text-red-700 text-xs touch-manipulation cursor-pointer min-h-[24px] min-w-[24px] flex items-center justify-center"
                            title="미배정 인원으로 이동"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                      {yellowTeamMembers.length === 0 && (
                        <div className="text-sm text-gray-500 p-1">
                          팀원을 추가해주세요
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div id="blue-team-card" className="p-3 border-2 border-blue-400 rounded-lg bg-blue-50 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-blue-700 flex items-center">
                        🔵 {blueTeamName}
                      </h4>
                      <button
                        onClick={() => setShowAddPlayerModal('blue')}
                        className="text-xs bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 transition-colors touch-manipulation cursor-pointer min-h-[32px] min-w-[50px]"
                      >
                        + 추가
                      </button>
                    </div>
                    <div className="space-y-1">
                      {blueTeamMembers.sort().map((member, index) => (
                        <div key={index} className="text-sm p-1 bg-white rounded border border-gray-200 flex items-center justify-between">
                          <span>{member}</span>
                          <button
                            onClick={() => removePlayerFromTeam(member, 'blue')}
                            className="text-red-500 hover:text-red-700 text-xs touch-manipulation cursor-pointer min-h-[24px] min-w-[24px] flex items-center justify-center"
                            title="미배정 인원으로 이동"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                      {blueTeamMembers.length === 0 && (
                        <div className="text-sm text-gray-500 p-1">
                          팀원을 추가해주세요
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* 미배정 인원 카드 */}
                  <div id="unassigned-players-card" className="p-3 border-2 border-gray-400 rounded-lg bg-gray-50 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-700 flex items-center">
                        ⚪ 미배정 인원
                      </h4>
                      <button
                        onClick={() => setShowAddPlayerModal('unassigned')}
                        className="text-xs bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600 transition-colors touch-manipulation cursor-pointer min-h-[32px] min-w-[50px]"
                      >
                        + 추가
                      </button>
                    </div>
                    <div className="space-y-1">
                      {unassignedMembers.sort().map((member, index) => (
                        <div key={index} className="text-sm p-1 bg-white rounded border border-gray-200 flex items-center justify-between">
                          <span>{member}</span>
                          <div className="flex gap-1">
                            <button
                              onClick={() => addPlayerToTeam(member, 'yellow')}
                              className="text-green-600 hover:text-green-800 text-xs px-1 touch-manipulation cursor-pointer min-h-[24px] min-w-[24px] flex items-center justify-center"
                              title="형광팀으로 이동"
                            >
                              🟢
                            </button>
                            <button
                              onClick={() => addPlayerToTeam(member, 'blue')}
                              className="text-blue-600 hover:text-blue-800 text-xs px-1 touch-manipulation cursor-pointer min-h-[24px] min-w-[24px] flex items-center justify-center"
                              title="파랑팀으로 이동"
                            >
                              🔵
                            </button>
                            <button
                              onClick={() => removePlayerFromTeam(member, 'unassigned')}
                              className="text-red-500 hover:text-red-700 text-xs touch-manipulation cursor-pointer min-h-[24px] min-w-[24px] flex items-center justify-center"
                              title="완전 제거"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      ))}
                      {unassignedMembers.length === 0 && (
                        <div className="text-sm text-gray-500 p-1">
                          모든 인원이 배정되었습니다
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* 우측 영역: 경기 진행 & 기록 */}
      <Card id="game-record-card" className="h-full bg-gradient-to-br from-white via-purple-50 to-pink-50 shadow-xl border-2 border-purple-200 flex flex-col overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg py-2 flex-shrink-0">
          <CardTitle className="flex items-center justify-between text-lg font-bold">
            <span>⚽ 경기 기록</span>
            <button 
              className="text-white hover:bg-white/20 p-1 rounded transition-colors"
              title="저장"
            >
              💾
            </button>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto p-4 min-h-0">
          <div className="space-y-4">
            {/* 점수 표시 */}
            <div id="score-display-section" className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm min-h-[200px]">
              <div className="flex items-start justify-between">
                {/* 형광팀 */}
                <div id="yellow-team-score-area" className="flex-1">
                  <div 
                    className="text-green-600 bg-green-100 px-4 py-2 rounded-lg shadow-sm cursor-pointer hover:bg-green-200 transition-colors text-4xl font-bold text-center"
                    onClick={() => handleTeamClick('yellow')}
                  >
                    🟢 {editingTeam === 'yellow' ? (
                      <input
                        type="text"
                        defaultValue={yellowTeamName}
                        className="bg-transparent border-b-2 border-green-600 outline-none text-4xl font-bold text-green-600 w-32"
                        onBlur={(e) => handleTeamNameChange('yellow', e.target.value)}
                        onKeyDown={(e) => handleKeyPress(e, 'yellow')}
                        autoFocus
                      />
                    ) : (
                      yellowTeamName
                    )} {yellowTeamGoals.length}
                  </div>
                  {/* 형광팀 골 기록 */}
                  <div className="mt-2 flex items-start gap-2">
                    <div className="space-y-0.5 flex-1">
                      {yellowTeamGoals
                        .sort((a, b) => {
                          const quarterOrder = ['Q1', 'Q2', 'Q3', 'Q4'];
                          return quarterOrder.indexOf(a.quarter) - quarterOrder.indexOf(b.quarter);
                        })
                        .map((goal, index) => (
                          <div key={index} className="text-xs text-green-700 flex items-center justify-between group hover:bg-green-50 px-1 rounded">
                            <span>
                              [{goal.quarter}] - ⚽ {goal.player} 
                              {goal.assist && <span> 🎯 {goal.assist}</span>}
                              {goal.semiAssist && <span> 👍 {goal.semiAssist}</span>}
                            </span>
                            <button
                              onClick={() => deleteGoalRecord('yellow', index)}
                              className="text-red-500 hover:text-red-700 ml-2 text-xs"
                              title="삭제"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                    </div>
                    <button 
                      onClick={() => openGoalModal('yellow')}
                      className="text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 transition-colors"
                    >
                      +추가
                    </button>
                  </div>
                </div>
                
                <div className="text-gray-600 text-2xl mx-4 self-center">VS</div>
                
                {/* 파랑팀 */}
                <div id="blue-team-score-area" className="flex-1">
                  <div 
                    className="text-blue-600 bg-blue-100 px-4 py-2 rounded-lg shadow-sm cursor-pointer hover:bg-blue-200 transition-colors text-4xl font-bold text-center"
                    onClick={() => handleTeamClick('blue')}
                  >
                    {blueTeamGoals.length}&nbsp;
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
                    )} 
                  </div>
                  {/* 파랑팀 골 기록 */}
                  <div className="mt-2 flex items-start gap-2">
                    <div className="space-y-0.5 flex-1">
                      {blueTeamGoals
                        .sort((a, b) => {
                          const quarterOrder = ['Q1', 'Q2', 'Q3', 'Q4'];
                          return quarterOrder.indexOf(a.quarter) - quarterOrder.indexOf(b.quarter);
                        })
                        .map((goal, index) => (
                          <div key={index} className="text-xs text-blue-700 flex items-center justify-between group hover:bg-blue-50 px-1 rounded">
                            <span>
                              [{goal.quarter}] - ⚽ {goal.player} 
                              {goal.assist && <span> 🎯 {goal.assist}</span>}
                              {goal.semiAssist && <span> 👍 {goal.semiAssist}</span>}
                            </span>
                            <button
                              onClick={() => deleteGoalRecord('blue', index)}
                              className="text-red-500 hover:text-red-700 ml-2 text-xs"
                              title="삭제"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                    </div>
                    <button 
                      onClick={() => openGoalModal('blue')}
                      className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors"
                    >
                      +추가
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 주심/부심 선택 - 쿼터별 */}
            <div id="referee-selection-section" className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
              <div className="grid grid-cols-4 gap-2 mb-2">
                <h3 className="font-medium text-gray-800 text-sm">👨‍⚖️ 심판 선택</h3>
                <div className="text-xs font-medium text-gray-600 text-center">주심</div>
                <div className="text-xs font-medium text-gray-600 text-center">부심 1</div>
                <div className="text-xs font-medium text-gray-600 text-center">부심 2</div>
              </div>
              <div className="space-y-2">
                {['Q1', 'Q2', 'Q3', 'Q4'].map((quarter) => {
                  const selectedReferees = getSelectedRefereesForQuarter(quarter)
                  return (
                    <div key={quarter} className="grid grid-cols-4 gap-2 items-center">
                      {/* Quarter Label */}
                      <div className="font-bold text-sm text-gray-700">{quarter}</div>
                      
                      {/* 주심 */}
                      <div>
                        <select 
                          className="w-full p-1.5 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-all text-xs"
                          value={refereesByQuarter[quarter] || ""}
                          onChange={(e) => handleQuarterRefereeChange(quarter, e.target.value)}
                        >
                          <option value="">선택</option>
                          {participantsData
                            .filter(participant => 
                              !selectedReferees.includes(participant.name) || 
                              participant.name === refereesByQuarter[quarter]
                            )
                            .sort((a, b) => a.name.localeCompare(b.name))
                            .map((participant, index) => (
                              <option key={index} value={participant.name}>{participant.name}</option>
                            ))}
                        </select>
                      </div>
                    
                    {/* 부심 1 */}
                    <div className="flex gap-1">
                        <select
                          className="flex-1 p-1.5 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-all text-xs"
                          value={assistantRefereesByQuarter[quarter]?.[0] || ""}
                          onChange={(e) => handleQuarterAssistantRefereeChange(quarter, 0, e.target.value)}
                        >
                          <option value="">선택</option>
                          {participantsData
                            .filter(participant => 
                              !selectedReferees.includes(participant.name) || 
                              participant.name === assistantRefereesByQuarter[quarter]?.[0]
                            )
                            .sort((a, b) => a.name.localeCompare(b.name))
                            .map((participant, index) => (
                              <option key={index} value={participant.name}>{participant.name}</option>
                            ))}
                        </select>
                        {assistantRefereesByQuarter[quarter]?.[0] && (
                          <button
                            type="button"
                            onClick={() => removeQuarterAssistantReferee(quarter, 0)}
                            className="px-1.5 py-0.5 text-red-500 hover:text-red-700 text-xs"
                          >
                            ✕
                          </button>
                        )}
                    </div>
                    
                    {/* 부심 2 */}
                    <div className="flex gap-1">
                        <select
                          className="flex-1 p-1.5 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-all text-xs"
                          value={assistantRefereesByQuarter[quarter]?.[1] || ""}
                          onChange={(e) => {
                            if (!assistantRefereesByQuarter[quarter]?.[0] && e.target.value) {
                              // 부심 1이 비어있으면 먼저 부심 1에 추가
                              handleQuarterAssistantRefereeChange(quarter, 0, e.target.value)
                            } else {
                              handleQuarterAssistantRefereeChange(quarter, 1, e.target.value)
                            }
                          }}
                        >
                          <option value="">선택</option>
                          {participantsData
                            .filter(participant => 
                              !selectedReferees.includes(participant.name) || 
                              participant.name === assistantRefereesByQuarter[quarter]?.[1]
                            )
                            .sort((a, b) => a.name.localeCompare(b.name))
                            .map((participant, index) => (
                              <option key={index} value={participant.name}>{participant.name}</option>
                            ))}
                        </select>
                        {assistantRefereesByQuarter[quarter]?.[1] && (
                          <button
                            type="button"
                            onClick={() => removeQuarterAssistantReferee(quarter, 1)}
                            className="px-1.5 py-0.5 text-red-500 hover:text-red-700 text-xs"
                          >
                            ✕
                          </button>
                        )}
                    </div>
                  </div>
                  )
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* 플레이어 추가 모달 */}
      {showAddPlayerModal && (
        <div id="add-player-modal" className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">
                {showAddPlayerModal === 'yellow' ? '🟢 ' + yellowTeamName : 
                 showAddPlayerModal === 'blue' ? '🔵 ' + blueTeamName : 
                 '⚪ 미배정 인원'}에 추가
              </h3>
              <button
                onClick={() => setShowAddPlayerModal(null)}
                className="text-gray-500 hover:text-gray-700 touch-manipulation cursor-pointer min-h-[32px] min-w-[32px] flex items-center justify-center"
              >
                ✕
              </button>
            </div>
            <div className="space-y-2">
              {participantsData
                .filter(participant => {
                  // 이미 팀에 속한 플레이어는 제외
                  return !yellowTeamMembers.includes(participant.name) && 
                         !blueTeamMembers.includes(participant.name) &&
                         !unassignedMembers.includes(participant.name)
                })
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((participant, index) => (
                  <button
                    key={index}
                    onClick={() => addPlayerToTeam(participant.name, showAddPlayerModal!)}
                    className="w-full text-left p-3 hover:bg-gray-100 rounded-lg border border-gray-200 touch-manipulation cursor-pointer min-h-[44px]"
                  >
                    {participant.name}
                  </button>
                ))}
              {participantsData.filter(participant => 
                !yellowTeamMembers.includes(participant.name) && 
                !blueTeamMembers.includes(participant.name) &&
                !unassignedMembers.includes(participant.name)
              ).length === 0 && (
                <div className="text-center text-gray-500 p-4">
                  추가할 수 있는 참여자가 없습니다
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Goal Record Modal */}
      {showGoalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">
                {showGoalModal.team === 'yellow' ? '🟢 ' + yellowTeamName : '🔵 ' + blueTeamName} 골 기록
              </h3>
              <button
                onClick={() => {
                  setShowGoalModal(null)
                  setSelectedGoalScorer("")
                  setSelectedAssist("")
                  setSelectedSemiAssist("")
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Quarter Selection */}
              <div>
                <label className="block text-sm font-medium mb-1">쿼터</label>
                <div className="grid grid-cols-4 gap-2">
                  {['Q1', 'Q2', 'Q3', 'Q4'].map(quarter => (
                    <button
                      key={quarter}
                      onClick={() => setShowGoalModal({...showGoalModal, quarter})}
                      className={`py-1 px-3 rounded text-sm font-medium transition-colors ${
                        showGoalModal.quarter === quarter
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 hover:bg-gray-300'
                      }`}
                    >
                      {quarter}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Goal Scorer */}
              <div>
                <label className="block text-sm font-medium mb-1">⚽ 골 (G)</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  value={selectedGoalScorer}
                  onChange={(e) => setSelectedGoalScorer(e.target.value)}
                >
                  <option value="">선택하세요</option>
                  {(showGoalModal.team === 'yellow' ? yellowTeamMembers : blueTeamMembers)
                    .sort()
                    .map((member, index) => (
                      <option key={index} value={member}>{member}</option>
                    ))}
                </select>
              </div>
              
              {/* Assist */}
              <div>
                <label className="block text-sm font-medium mb-1">🎯 어시스트 (AS)</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  value={selectedAssist}
                  onChange={(e) => setSelectedAssist(e.target.value)}
                >
                  <option value="">선택하세요</option>
                  {(showGoalModal.team === 'yellow' ? yellowTeamMembers : blueTeamMembers)
                    .filter(member => member !== selectedGoalScorer)
                    .sort()
                    .map((member, index) => (
                      <option key={index} value={member}>{member}</option>
                    ))}
                </select>
              </div>
              
              {/* Semi-Assist */}
              <div>
                <label className="block text-sm font-medium mb-1">👍 세미어시스트 (SA)</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  value={selectedSemiAssist}
                  onChange={(e) => setSelectedSemiAssist(e.target.value)}
                >
                  <option value="">선택하세요</option>
                  {(showGoalModal.team === 'yellow' ? yellowTeamMembers : blueTeamMembers)
                    .filter(member => member !== selectedAssist)
                    .sort()
                    .map((member, index) => (
                      <option key={index} value={member}>{member}</option>
                    ))}
                </select>
              </div>
              
              {/* Buttons */}
              <div className="flex gap-2 mt-6">
                <button
                  onClick={() => {
                    setShowGoalModal(null)
                    setSelectedGoalScorer("")
                    setSelectedAssist("")
                    setSelectedSemiAssist("")
                  }}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  취소
                </button>
                <button
                  onClick={handleAddGoalRecord}
                  disabled={!selectedGoalScorer}
                  className={`flex-1 py-2 px-4 rounded-lg text-white ${
                    selectedGoalScorer
                      ? 'bg-blue-500 hover:bg-blue-600'
                      : 'bg-gray-300 cursor-not-allowed'
                  }`}
                >
                  완료
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}