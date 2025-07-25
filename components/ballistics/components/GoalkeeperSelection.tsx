import React from 'react';

interface GoalkeeperSelectionProps {
  team: 'yellow' | 'blue';
  teamName: string;
  teamMembers: string[];
  teamEmoji: string;
  colorClass: string;
  focusColorClass: string;
  goalkeepersByQuarter: {[key: string]: string};
  onGoalkeeperChange: (quarter: string, value: string) => void;
}

export default function GoalkeeperSelection({
  team,
  teamName,
  teamMembers,
  teamEmoji,
  colorClass,
  focusColorClass,
  goalkeepersByQuarter,
  onGoalkeeperChange
}: GoalkeeperSelectionProps) {
  return (
    <div id={`${team}-goalkeeper-section`}>
      <h4 className={`text-xs font-medium ${colorClass} mb-2`}>{teamEmoji} {teamName} 골키퍼</h4>
      <div className="space-y-2">
        {['Q1', 'Q2', 'Q3', 'Q4'].map((quarter) => (
          <div key={quarter} className="grid grid-cols-[60px_1fr] gap-2 items-center">
            <div className="font-bold text-sm text-gray-700">{quarter}</div>
            <div>
              <select 
                id={`${team}-goalkeeper-${quarter.toLowerCase()}`}
                className={`w-full p-1.5 border border-gray-300 rounded-lg ${focusColorClass} transition-all text-xs`}
                value={goalkeepersByQuarter[quarter] || ""}
                onChange={(e) => onGoalkeeperChange(quarter, e.target.value)}
              >
                <option value="">선택</option>
                {teamMembers
                  .sort()
                  .map((member, index) => (
                    <option key={index} value={member}>{member}</option>
                  ))}
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}