"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState, useEffect } from "react"
import participantsData from "@/data/participants.json"
import TeamCard from "./components/TeamCard"
import GoalRecord from "./components/GoalRecord"
import GoalkeeperSelection from "./components/GoalkeeperSelection"
import RefereeSelection from "./components/RefereeSelection"
import { AlertModal } from "./components/AlertModal"
import { ConfirmModal } from "./components/ConfirmModal"

export default function AddStats() {
  const [yellowTeamName, setYellowTeamName] = useState("형광팀")
  const [blueTeamName, setBlueTeamName] = useState("파랑팀")
  const [editingTeam, setEditingTeam] = useState<'yellow' | 'blue' | null>(null)
  const [yellowTeamId, setYellowTeamId] = useState<number | null>(null)
  const [blueTeamId, setBlueTeamId] = useState<number | null>(null)
  const [referee, setReferee] = useState("")
  const [assistantReferees, setAssistantReferees] = useState<string[]>([])
  const [yellowTeamMembers, setYellowTeamMembers] = useState<string[]>([])
  const [blueTeamMembers, setBlueTeamMembers] = useState<string[]>([])
  const [unassignedMembers, setUnassignedMembers] = useState<string[]>(participantsData.map(p => p.name))
  const [showAddPlayerModal, setShowAddPlayerModal] = useState<'yellow' | 'blue' | 'unassigned' | null>(null)
  const [yellowTeamGoals, setYellowTeamGoals] = useState<Array<{player: string, time: string, quarter: string, assist?: string, semiAssist?: string}>>([])
  const [blueTeamGoals, setBlueTeamGoals] = useState<Array<{player: string, time: string, quarter: string, assist?: string, semiAssist?: string}>>([])
  
  // Quarter-based referee tracking
  const [refereesByQuarter, setRefereesByQuarter] = useState<{[key: string]: string}>({
    Q1: "", Q2: "", Q3: "", Q4: ""
  })
  const [assistantRefereesByQuarter, setAssistantRefereesByQuarter] = useState<{[key: string]: string[]}>({
    Q1: [], Q2: [], Q3: [], Q4: []
  })
  
  // Quarter-based goalkeeper tracking for each team
  const [yellowGoalkeepersByQuarter, setYellowGoalkeepersByQuarter] = useState<{[key: string]: string}>({
    Q1: "", Q2: "", Q3: "", Q4: ""
  })
  const [blueGoalkeepersByQuarter, setBlueGoalkeepersByQuarter] = useState<{[key: string]: string}>({
    Q1: "", Q2: "", Q3: "", Q4: ""
  })
  
  // Goal record modal state
  const [showGoalModal, setShowGoalModal] = useState<{team: 'yellow' | 'blue', quarter: string} | null>(null)
  const [selectedGoalScorer, setSelectedGoalScorer] = useState("")
  const [selectedAssist, setSelectedAssist] = useState("")
  const [selectedSemiAssist, setSelectedSemiAssist] = useState("")
  
  // Save data modal state
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [gameDate, setGameDate] = useState(new Date().toISOString().split('T')[0])
  const [gameType, setGameType] = useState<'internal' | 'friendly'>('internal')
  const [savedMatchId, setSavedMatchId] = useState<number | null>(null)
  
  // Alert modal state
  const [alertModal, setAlertModal] = useState<{
    isOpen: boolean
    message: string
    type: 'success' | 'error' | 'info' | 'warning'
    title?: string
  }>({
    isOpen: false,
    message: '',
    type: 'info'
  })
  
  // Track if data has been modified
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [pendingDate, setPendingDate] = useState<string | null>(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  
  // Track original data for comparison
  const [originalData, setOriginalData] = useState<any>(null)


  // Helper function to show alert
  const showAlert = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info', title?: string) => {
    setAlertModal({
      isOpen: true,
      message,
      type,
      title
    })
  }

  // Track changes to mark as unsaved
  useEffect(() => {
    // Check if any data has been modified
    const hasChanges = 
      yellowTeamMembers.length > 0 ||
      blueTeamMembers.length > 0 ||
      yellowTeamGoals.length > 0 ||
      blueTeamGoals.length > 0 ||
      Object.values(yellowGoalkeepersByQuarter).some(v => v) ||
      Object.values(blueGoalkeepersByQuarter).some(v => v) ||
      Object.values(refereesByQuarter).some(v => v) ||
      Object.values(assistantRefereesByQuarter).some(v => v && v.length > 0)
    
    setHasUnsavedChanges(hasChanges)
  }, [
    yellowTeamMembers, blueTeamMembers, 
    yellowTeamGoals, blueTeamGoals,
    yellowGoalkeepersByQuarter, blueGoalkeepersByQuarter,
    refereesByQuarter, assistantRefereesByQuarter
  ])
  
  // Load initial data on mount
  useEffect(() => {
    // Initialize participants
    if (participantsData && participantsData.length > 0) {
      setUnassignedMembers(participantsData.map(p => p.name))
    }
    
    // Check if there's existing data for today's date
    proceedWithDateChange(gameDate)
  }, [])

  const handleTeamNameChange = (team: 'yellow' | 'blue', newName: string) => {
    const oldName = team === 'yellow' ? yellowTeamName : blueTeamName;
    
    if (team === 'yellow') {
      setYellowTeamName(newName)
      // Update OG records in blue team goals
      setBlueTeamGoals(blueTeamGoals.map(goal => {
        if (goal.player === `OG(${oldName})`) {
          return { ...goal, player: `OG(${newName})` };
        }
        return goal;
      }));
    } else {
      setBlueTeamName(newName)
      // Update OG records in yellow team goals
      setYellowTeamGoals(yellowTeamGoals.map(goal => {
        if (goal.player === `OG(${oldName})`) {
          return { ...goal, player: `OG(${newName})` };
        }
        return goal;
      }));
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
  
  // Goalkeeper handlers
  const handleYellowQuarterGoalkeeperChange = (quarter: string, value: string) => {
    setYellowGoalkeepersByQuarter(prev => ({
      ...prev,
      [quarter]: value
    }))
  }
  
  const handleBlueQuarterGoalkeeperChange = (quarter: string, value: string) => {
    setBlueGoalkeepersByQuarter(prev => ({
      ...prev,
      [quarter]: value
    }))
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
  
  // Save data to database
  // Handle date change
  const handleDateChange = async (newDate: string) => {
    // If there are unsaved changes, show confirmation modal
    if (hasUnsavedChanges && newDate !== gameDate) {
      setPendingDate(newDate)
      setShowConfirmModal(true)
      return
    }
    
    // Otherwise, proceed with date change
    await proceedWithDateChange(newDate)
  }
  
  // Proceed with date change after confirmation
  const proceedWithDateChange = async (newDate: string) => {
    setGameDate(newDate)
    setPendingDate(null)
    
    // Check if there's a match for the new date
    try {
      const response = await fetch(`/api/ballistics/check-match?datetime=${newDate}`)
      const result = await response.json()
      
      if (result.exists && result.matchId) {
        // Load match data
        await loadMatchData(result.matchId)
      } else {
        // Clear all data for new match
        clearAllData()
      }
    } catch (error) {
      console.error('Error checking match:', error)
    }
  }
  
  // Load match data from database
  const loadMatchData = async (matchId: number) => {
    try {
      const response = await fetch(`/api/ballistics/match?match_id=${matchId}`)
      const result = await response.json()
      
      if (result.success && result.data) {
        const { match, teams, referees, assistantReferees } = result.data
        
        // Clear current data first
        clearAllData()
        
        // Load match type
        if (match.match_type) {
          setGameType(match.match_type as 'internal' | 'friendly')
        }
        
        // Load team data
        teams.forEach((team: any) => {
          if (team.is_home) {
            setYellowTeamName(team.name)
            setYellowTeamId(team.team_id)
            setYellowTeamMembers(team.members || [])
            
            // Load goals
            const goals = team.goals.map((goal: any) => ({
              quarter: `Q${goal.quarter}`,
              player: goal.player_name,
              assist: '',
              semiAssist: ''
            }))
            
            // Load OGs
            const ogs = team.ogs?.map((og: any) => ({
              quarter: `Q${og.quarter}`,
              player: `OG(${og.team_name})`,
              assist: '',
              semiAssist: ''
            })) || []
            
            setYellowTeamGoals([...goals, ...ogs])
            
            // Load goalkeepers
            const gkByQuarter: {[key: string]: string} = {}
            team.goalkeepers?.forEach((gk: any) => {
              gkByQuarter[`Q${gk.quarter}`] = gk.player_name
            })
            setYellowGoalkeepersByQuarter(gkByQuarter)
          } else {
            setBlueTeamName(team.name)
            setBlueTeamId(team.team_id)
            setBlueTeamMembers(team.members || [])
            
            // Load goals
            const goals = team.goals.map((goal: any) => ({
              quarter: `Q${goal.quarter}`,
              player: goal.player_name,
              assist: '',
              semiAssist: ''
            }))
            
            // Load OGs
            const ogs = team.ogs?.map((og: any) => ({
              quarter: `Q${og.quarter}`,
              player: `OG(${og.team_name})`,
              assist: '',
              semiAssist: ''
            })) || []
            
            setBlueTeamGoals([...goals, ...ogs])
            
            // Load goalkeepers
            const gkByQuarter: {[key: string]: string} = {}
            team.goalkeepers?.forEach((gk: any) => {
              gkByQuarter[`Q${gk.quarter}`] = gk.player_name
            })
            setBlueGoalkeepersByQuarter(gkByQuarter)
          }
        })
        
        // Load referees
        const refByQuarter: {[key: string]: string} = {}
        referees?.forEach((ref: any) => {
          refByQuarter[`Q${ref.quarter}`] = ref.player_name
        })
        setRefereesByQuarter(refByQuarter)
        
        // Load assistant referees
        const aRefByQuarter: {[key: string]: string[]} = {
          Q1: [], Q2: [], Q3: [], Q4: []
        }
        assistantReferees?.forEach((ref: any) => {
          const quarter = `Q${ref.quarter}`
          if (!aRefByQuarter[quarter].includes(ref.player_name)) {
            aRefByQuarter[quarter].push(ref.player_name)
          }
        })
        setAssistantRefereesByQuarter(aRefByQuarter)
        
        // Set saved match ID
        setSavedMatchId(matchId)
        setHasUnsavedChanges(false)
        
        // Capture loaded data as original
        setTimeout(() => {
          captureOriginalData()
        }, 100)
        
        showAlert(`경기 데이터를 불러왔습니다. (Match ID: ${matchId})`, 'success')
      }
    } catch (error) {
      console.error('Error loading match data:', error)
      showAlert('경기 데이터를 불러오는 중 오류가 발생했습니다.', 'error')
    }
  }
  
  // Clear all data
  const clearAllData = () => {
    setYellowTeamName('형광팀')
    setBlueTeamName('파랑팀')
    setYellowTeamId(null)
    setBlueTeamId(null)
    setYellowTeamMembers([])
    setBlueTeamMembers([])
    setUnassignedMembers(participantsData.map(p => p.name))
    setYellowTeamGoals([])
    setBlueTeamGoals([])
    setYellowGoalkeepersByQuarter({ Q1: '', Q2: '', Q3: '', Q4: '' })
    setBlueGoalkeepersByQuarter({ Q1: '', Q2: '', Q3: '', Q4: '' })
    setRefereesByQuarter({ Q1: '', Q2: '', Q3: '', Q4: '' })
    setAssistantRefereesByQuarter({ Q1: [], Q2: [], Q3: [], Q4: [] })
    setSavedMatchId(null)
    setHasUnsavedChanges(false)
    setOriginalData(null)
  }
  
  // Capture current state as original data
  const captureOriginalData = () => {
    const data = {
      yellowTeamName,
      blueTeamName,
      yellowTeamMembers: [...yellowTeamMembers],
      blueTeamMembers: [...blueTeamMembers],
      yellowTeamGoals: [...yellowTeamGoals],
      blueTeamGoals: [...blueTeamGoals],
      yellowGoalkeepersByQuarter: {...yellowGoalkeepersByQuarter},
      blueGoalkeepersByQuarter: {...blueGoalkeepersByQuarter},
      refereesByQuarter: {...refereesByQuarter},
      assistantRefereesByQuarter: {...assistantRefereesByQuarter},
      gameType
    }
    setOriginalData(data)
    return data
  }

  // Compare current data with original to find changes
  const detectChanges = () => {
    if (!originalData || !savedMatchId) return null;
    
    const changes: any = {
      match: {},
      teams: [],
      teamMembers: { added: [], removed: [] },
      stats: { added: [], removed: [] },
      players: { added: [] }
    };
    
    // Check game type change
    if (originalData.gameType !== gameType) {
      changes.match.match_type = gameType;
    }
    
    // Check team name changes
    if (originalData.yellowTeamName !== yellowTeamName && yellowTeamId) {
      changes.teams.push({ team_id: yellowTeamId, name: yellowTeamName, is_home: true });
    }
    if (originalData.blueTeamName !== blueTeamName && blueTeamId) {
      changes.teams.push({ team_id: blueTeamId, name: blueTeamName, is_home: false });
    }
    
    // Check team member changes
    const origYellow = new Set(originalData.yellowTeamMembers);
    const currYellow = new Set(yellowTeamMembers);
    const origBlue = new Set(originalData.blueTeamMembers);
    const currBlue = new Set(blueTeamMembers);
    
    // Find added/removed members
    if (yellowTeamId) {
      yellowTeamMembers.forEach(member => {
        if (!origYellow.has(member)) {
          changes.players.added.push(member);
          changes.teamMembers.added.push({ team_id: yellowTeamId, player_name: member });
        }
      });
    }
    
    if (blueTeamId) {
      blueTeamMembers.forEach(member => {
        if (!origBlue.has(member)) {
          changes.players.added.push(member);
          changes.teamMembers.added.push({ team_id: blueTeamId, player_name: member });
        }
      });
    }
    
    // Compare goals, goalkeepers, referees (simplified for now)
    // In a real implementation, you'd need to track stat IDs from the database
    
    return changes;
  };

  const saveToDatabase = async () => {
    // If we have a saved match ID and original data, check for changes
    if (savedMatchId && originalData) {
      const changes = detectChanges();
      
      if (changes) {
        // Use update API
        try {
          const response = await fetch('/api/ballistics/update', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ matchId: savedMatchId, changes }),
          });
          
          const result = await response.json();
          
          if (result.success) {
            showAlert(`경기 데이터가 성공적으로 수정되었습니다. (Match ID: ${savedMatchId})`, 'success');
            captureOriginalData(); // Update original data
            setHasUnsavedChanges(false);
            setShowSaveModal(false);
          } else {
            showAlert('수정 중 오류가 발생했습니다: ' + (result.details || result.error), 'error');
          }
        } catch (error) {
          console.error('Error updating data:', error);
          showAlert('수정 중 오류가 발생했습니다.', 'error');
        }
        return;
      }
    }
    
    // Otherwise, create new match
    const data = prepareDataForSave();
    
    // Add team members to data for the API
    const dataWithMembers = {
      ...data,
      yellowTeamMembers,
      blueTeamMembers,
      unassignedMembers,
      participantsData
    };
    
    try {
      const response = await fetch('/api/ballistics/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataWithMembers),
      });
      
      const result = await response.json();
      
      if (result.success) {
        showAlert(`경기 데이터가 성공적으로 저장되었습니다. (Match ID: ${result.matchId})`, 'success');
        setSavedMatchId(result.matchId);
        captureOriginalData(); // Capture as original after save
        setHasUnsavedChanges(false);
        setShowSaveModal(false);
      } else {
        showAlert('저장 중 오류가 발생했습니다: ' + (result.details || result.error), 'error');
      }
    } catch (error) {
      console.error('Error saving data:', error);
      showAlert('저장 중 오류가 발생했습니다.', 'error');
    }
  };

  // Prepare data for saving (formatted for database)
  const prepareDataForSave = () => {
    // Generate unique IDs for demo purposes
    const matchId = Date.now();
    const yellowTeamId = 1;
    const blueTeamId = 2;
    
    const data = {
      // matches table
      match: {
        match_id: matchId,
        match_datetime: `${gameDate} 00:00:00`,
        match_type: gameType
      },
      
      // teams table
      teams: [
        { team_id: yellowTeamId, name: yellowTeamName },
        { team_id: blueTeamId, name: blueTeamName }
      ],
      
      // match_team table
      match_teams: [
        { match_id: matchId, team_id: yellowTeamId, is_home: true },
        { match_id: matchId, team_id: blueTeamId, is_home: false }
      ],
      
      // stats table entries
      stats: [] as Array<{
        match_id: number;
        team_id: number | null;
        player_id: number | null;
        quarter: number | null;
        type: string;
      }>
    };
    
    // Add goal, assist, semi-assist stats for yellow team
    yellowTeamGoals.forEach((goal, index) => {
      const quarter = parseInt(goal.quarter.replace('Q', ''));
      
      // Goal stat
      data.stats.push({
        match_id: matchId,
        team_id: yellowTeamId,
        player_id: goal.player.startsWith('OG(') ? null : yellowTeamMembers.indexOf(goal.player) + 1,
        quarter: quarter,
        type: goal.player.startsWith('OG(') ? 'og' : 'goal'
      });
      
      // Assist stat
      if (goal.assist) {
        data.stats.push({
          match_id: matchId,
          team_id: yellowTeamId,
          player_id: yellowTeamMembers.indexOf(goal.assist) + 1,
          quarter: quarter,
          type: 'assist'
        });
      }
      
      // Semi-assist stat
      if (goal.semiAssist) {
        data.stats.push({
          match_id: matchId,
          team_id: yellowTeamId,
          player_id: yellowTeamMembers.indexOf(goal.semiAssist) + 1,
          quarter: quarter,
          type: 'semi assist'
        });
      }
    });
    
    // Add goal, assist, semi-assist stats for blue team
    blueTeamGoals.forEach((goal, index) => {
      const quarter = parseInt(goal.quarter.replace('Q', ''));
      
      // Goal stat
      data.stats.push({
        match_id: matchId,
        team_id: blueTeamId,
        player_id: goal.player.startsWith('OG(') ? null : blueTeamMembers.indexOf(goal.player) + 1,
        quarter: quarter,
        type: goal.player.startsWith('OG(') ? 'og' : 'goal'
      });
      
      // Assist stat
      if (goal.assist) {
        data.stats.push({
          match_id: matchId,
          team_id: blueTeamId,
          player_id: blueTeamMembers.indexOf(goal.assist) + 1,
          quarter: quarter,
          type: 'assist'
        });
      }
      
      // Semi-assist stat
      if (goal.semiAssist) {
        data.stats.push({
          match_id: matchId,
          team_id: blueTeamId,
          player_id: blueTeamMembers.indexOf(goal.semiAssist) + 1,
          quarter: quarter,
          type: 'semi assist'
        });
      }
    });
    
    // Add goalkeeper stats
    Object.entries(yellowGoalkeepersByQuarter).forEach(([quarter, playerName]) => {
      if (playerName) {
        data.stats.push({
          match_id: matchId,
          team_id: yellowTeamId,
          player_id: yellowTeamMembers.indexOf(playerName) + 1,
          quarter: parseInt(quarter.replace('Q', '')),
          type: 'GK'
        });
      }
    });
    
    Object.entries(blueGoalkeepersByQuarter).forEach(([quarter, playerName]) => {
      if (playerName) {
        data.stats.push({
          match_id: matchId,
          team_id: blueTeamId,
          player_id: blueTeamMembers.indexOf(playerName) + 1,
          quarter: parseInt(quarter.replace('Q', '')),
          type: 'GK'
        });
      }
    });
    
    // Add referee stats
    Object.entries(refereesByQuarter).forEach(([quarter, refereeName]) => {
      if (refereeName) {
        data.stats.push({
          match_id: matchId,
          team_id: null,
          player_id: participantsData.findIndex(p => p.name === refereeName) + 1,
          quarter: parseInt(quarter.replace('Q', '')),
          type: 'referee'
        });
      }
    });
    
    // Add assistant referee stats
    Object.entries(assistantRefereesByQuarter).forEach(([quarter, assistantRefs]) => {
      if (assistantRefs && Array.isArray(assistantRefs)) {
        assistantRefs.forEach(assistantName => {
          if (assistantName) {
            data.stats.push({
              match_id: matchId,
              team_id: null,
              player_id: participantsData.findIndex(p => p.name === assistantName) + 1,
              quarter: parseInt(quarter.replace('Q', '')),
              type: 'assistance referee'
            });
          }
        });
      }
    });
    
    // Add no-show stats for unassigned players
    unassignedMembers.forEach(memberName => {
      data.stats.push({
        match_id: matchId,
        team_id: null,
        player_id: participantsData.findIndex(p => p.name === memberName) + 1,
        quarter: null,
        type: 'no show'
      });
    });
    
    return data;
  }

  return (
    <div id="add-stats-container" className="grid grid-cols-[285px_1fr] gap-3.5 h-full overflow-hidden">
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
                value={gameDate}
                onChange={(e) => handleDateChange(e.target.value)}
              />
            </div>
            
            {/* 경기 유형 선택 */}
            <div id="game-type-section" className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="font-medium mb-2 text-gray-800">🏆 경기 유형</h3>
              <div className="flex gap-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="gameType"
                    value="internal"
                    checked={gameType === 'internal'}
                    onChange={(e) => setGameType(e.target.value as 'internal' | 'friendly')}
                    className="mr-2 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">자체전</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="gameType"
                    value="friendly"
                    checked={gameType === 'friendly'}
                    onChange={(e) => setGameType(e.target.value as 'internal' | 'friendly')}
                    className="mr-2 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">대외전</span>
                </label>
              </div>
            </div>
            
            {/* 참여자 목록 */}
            <div id="participants-management-section" className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="font-medium mb-2 text-gray-800">👥 Check-In (총: {yellowTeamMembers.length + blueTeamMembers.length + unassignedMembers.length}명)</h3>
              <div className="space-y-2">
                {/* 팀 배정 영역 */}
                <div className="space-y-2">
                  <TeamCard
                    teamId="yellow"
                    teamName={yellowTeamName}
                    members={yellowTeamMembers}
                    emoji="🟢"
                    colorClass="text-green-700"
                    borderClass="border-2 border-green-400"
                    bgClass="bg-green-50"
                    onAddPlayer={() => setShowAddPlayerModal('yellow')}
                    onRemovePlayer={(member) => removePlayerFromTeam(member, 'yellow')}
                  />
                  
                  <TeamCard
                    teamId="blue"
                    teamName={blueTeamName}
                    members={blueTeamMembers}
                    emoji="🔵"
                    colorClass="text-blue-700"
                    borderClass="border-2 border-blue-400"
                    bgClass="bg-blue-50"
                    onAddPlayer={() => setShowAddPlayerModal('blue')}
                    onRemovePlayer={(member) => removePlayerFromTeam(member, 'blue')}
                  />
                  
                  {/* 미배정 인원 카드 */}
                  <TeamCard
                    teamId="unassigned"
                    teamName="미배정 인원"
                    members={unassignedMembers}
                    emoji="⚪"
                    colorClass="text-gray-700"
                    borderClass="border-2 border-gray-400"
                    bgClass="bg-gray-50"
                    onAddPlayer={() => setShowAddPlayerModal('unassigned')}
                    onRemovePlayer={(member) => removePlayerFromTeam(member, 'unassigned')}
                    onMoveToYellow={(member) => addPlayerToTeam(member, 'yellow')}
                    onMoveToBlue={(member) => addPlayerToTeam(member, 'blue')}
                    showTeamButtons={true}
                  />
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
            <div className="flex gap-2">
              <button 
                id="save-button"
                className="text-white hover:bg-white/20 p-1 rounded transition-colors"
                title="저장"
                onClick={() => setShowSaveModal(true)}
              >
                💾
              </button>
              <button 
                id="share-button"
                className="text-white hover:bg-white/20 p-1 rounded transition-colors"
                title="공유"
                onClick={async () => {
                  try {
                    let matchId = savedMatchId;
                    
                    // If no saved match ID, check if match exists for the selected date
                    if (!matchId) {
                      const response = await fetch(`/api/ballistics/check-match?datetime=${gameDate}`);
                      const result = await response.json();
                      
                      if (!result.exists) {
                        showAlert('저장을 먼저해주세요.', 'warning');
                        return;
                      }
                      
                      matchId = result.matchId;
                    }
                    
                    // Copy match URL with the match ID
                    const matchUrl = `${window.location.origin}/match?match_id=${matchId}`;
                    await navigator.clipboard.writeText(matchUrl);
                    showAlert('URL이 클립보드에 복사되었습니다!', 'success');
                  } catch (err) {
                    showAlert('URL 복사에 실패했습니다.', 'error');
                  }
                }}
              >
                📤
              </button>
            </div>
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
                    <GoalRecord
                      team="yellow"
                      goals={yellowTeamGoals}
                      teamEmoji="🟢"
                      colorClass="text-green-700"
                      bgClass="bg-green-50"
                      hoverBgClass="hover:bg-green-50"
                      onDelete={(index) => deleteGoalRecord('yellow', index)}
                    />
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
                    <GoalRecord
                      team="blue"
                      goals={blueTeamGoals}
                      teamEmoji="🔵"
                      colorClass="text-blue-700"
                      bgClass="bg-blue-50"
                      hoverBgClass="hover:bg-blue-50"
                      onDelete={(index) => deleteGoalRecord('blue', index)}
                    />
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
            
            {/* 골키퍼 선택 - 쿼터별 */}
            <div id="goalkeeper-selection-section" className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="font-medium text-gray-800 text-sm mb-2">🥅 골키퍼 선택</h3>
              <div className="grid grid-cols-2 gap-4">
                {/* 형광팀 골키퍼 */}
                <GoalkeeperSelection
                  team="yellow"
                  teamName={yellowTeamName}
                  teamMembers={yellowTeamMembers}
                  teamEmoji="🟢"
                  colorClass="text-green-700"
                  focusColorClass="focus:border-green-500 focus:ring-1 focus:ring-green-200"
                  goalkeepersByQuarter={yellowGoalkeepersByQuarter}
                  onGoalkeeperChange={handleYellowQuarterGoalkeeperChange}
                />
                
                {/* 파랑팀 골키퍼 */}
                <GoalkeeperSelection
                  team="blue"
                  teamName={blueTeamName}
                  teamMembers={blueTeamMembers}
                  teamEmoji="🔵"
                  colorClass="text-blue-700"
                  focusColorClass="focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
                  goalkeepersByQuarter={blueGoalkeepersByQuarter}
                  onGoalkeeperChange={handleBlueQuarterGoalkeeperChange}
                />
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
                    <RefereeSelection
                      key={quarter}
                      quarter={quarter}
                      mainReferee={refereesByQuarter[quarter]}
                      assistantReferees={assistantRefereesByQuarter[quarter] || []}
                      participantsData={participantsData}
                      selectedReferees={selectedReferees}
                      onMainRefereeChange={(value) => handleQuarterRefereeChange(quarter, value)}
                      onAssistantRefereeChange={(index, value) => handleQuarterAssistantRefereeChange(quarter, index, value)}
                      onRemoveAssistantReferee={(index) => removeQuarterAssistantReferee(quarter, index)}
                    />
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
                  <optgroup label={showGoalModal.team === 'yellow' ? yellowTeamName : blueTeamName}>
                    {(showGoalModal.team === 'yellow' ? yellowTeamMembers : blueTeamMembers)
                      .sort()
                      .map((member, index) => (
                        <option key={index} value={member}>{member}</option>
                      ))}
                  </optgroup>
                  <optgroup label="자책골 (OG)">
                    <option value={`OG(${showGoalModal.team === 'yellow' ? blueTeamName : yellowTeamName})`}>
                      OG({showGoalModal.team === 'yellow' ? blueTeamName : yellowTeamName})
                    </option>
                  </optgroup>
                </select>
              </div>
              
              {/* Assist */}
              <div>
                <label className="block text-sm font-medium mb-1">🎯 어시스트 (AS)</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  value={selectedAssist}
                  onChange={(e) => setSelectedAssist(e.target.value)}
                  disabled={selectedGoalScorer.startsWith('OG(')}
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
                  disabled={selectedGoalScorer.startsWith('OG(')}
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
      
      {/* Save Data Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[600px] max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">💾 저장할 데이터</h3>
              <button
                onClick={() => setShowSaveModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="bg-gray-100 p-4 rounded-lg">
              <pre className="text-xs overflow-x-auto">
                {JSON.stringify(prepareDataForSave(), null, 2)}
              </pre>
            </div>
            
            <div className="flex gap-2 mt-6">
              <button
                onClick={() => setShowSaveModal(false)}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                닫기
              </button>
              <button
                onClick={saveToDatabase}
                className="flex-1 py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                저장하기
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Alert Modal */}
      <AlertModal
        isOpen={alertModal.isOpen}
        onClose={() => setAlertModal(prev => ({ ...prev, isOpen: false }))}
        message={alertModal.message}
        type={alertModal.type}
        title={alertModal.title}
      />
      
      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => {
          setShowConfirmModal(false)
          setPendingDate(null)
        }}
        onConfirm={() => {
          if (pendingDate) {
            proceedWithDateChange(pendingDate)
          }
        }}
        title="데이터 저장 확인"
        message="저장하지 않은 데이터는 없어집니다. 계속하시겠습니까?"
        confirmText="계속"
        cancelText="취소"
      />
    </div>
  )
}