import React from 'react';

interface RefereeSelectionProps {
  quarter: string;
  mainReferee: string;
  assistantReferees: string[];
  participantsData: {name: string}[];
  selectedReferees: string[];
  onMainRefereeChange: (value: string) => void;
  onAssistantRefereeChange: (index: number, value: string) => void;
  onRemoveAssistantReferee: (index: number) => void;
}

export default function RefereeSelection({
  quarter,
  mainReferee,
  assistantReferees,
  participantsData,
  selectedReferees,
  onMainRefereeChange,
  onAssistantRefereeChange,
  onRemoveAssistantReferee
}: RefereeSelectionProps) {
  return (
    <div className="grid grid-cols-4 gap-2 items-center">
      {/* Quarter Label */}
      <div className="font-bold text-sm text-gray-700">{quarter}</div>
      
      {/* 주심 */}
      <div>
        <select 
          className="w-full p-1.5 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-all text-xs"
          value={mainReferee || ""}
          onChange={(e) => onMainRefereeChange(e.target.value)}
        >
          <option value="">선택</option>
          {participantsData
            .filter(participant => 
              !selectedReferees.includes(participant.name) || 
              participant.name === mainReferee
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
          value={assistantReferees[0] || ""}
          onChange={(e) => onAssistantRefereeChange(0, e.target.value)}
        >
          <option value="">선택</option>
          {participantsData
            .filter(participant => 
              !selectedReferees.includes(participant.name) || 
              participant.name === assistantReferees[0]
            )
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((participant, index) => (
              <option key={index} value={participant.name}>{participant.name}</option>
            ))}
        </select>
        {assistantReferees[0] && (
          <button
            type="button"
            onClick={() => onRemoveAssistantReferee(0)}
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
          value={assistantReferees[1] || ""}
          onChange={(e) => {
            if (!assistantReferees[0] && e.target.value) {
              // 부심 1이 비어있으면 먼저 부심 1에 추가
              onAssistantRefereeChange(0, e.target.value)
            } else {
              onAssistantRefereeChange(1, e.target.value)
            }
          }}
        >
          <option value="">선택</option>
          {participantsData
            .filter(participant => 
              !selectedReferees.includes(participant.name) || 
              participant.name === assistantReferees[1]
            )
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((participant, index) => (
              <option key={index} value={participant.name}>{participant.name}</option>
            ))}
        </select>
        {assistantReferees[1] && (
          <button
            type="button"
            onClick={() => onRemoveAssistantReferee(1)}
            className="px-1.5 py-0.5 text-red-500 hover:text-red-700 text-xs"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}