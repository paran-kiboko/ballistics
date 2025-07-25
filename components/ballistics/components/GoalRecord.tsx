import React from 'react';

interface Goal {
  player: string;
  time: string;
  quarter: string;
  assist?: string;
  semiAssist?: string;
}

interface GoalRecordProps {
  team: 'yellow' | 'blue';
  goals: Goal[];
  teamEmoji: string;
  colorClass: string;
  bgClass: string;
  hoverBgClass: string;
  onDelete: (index: number) => void;
}

export default function GoalRecord({
  team,
  goals,
  teamEmoji,
  colorClass,
  bgClass,
  hoverBgClass,
  onDelete
}: GoalRecordProps) {
  return (
    <div className="space-y-0.5 flex-1">
      {goals
        .sort((a, b) => {
          const quarterOrder = ['Q1', 'Q2', 'Q3', 'Q4'];
          return quarterOrder.indexOf(a.quarter) - quarterOrder.indexOf(b.quarter);
        })
        .map((goal, index) => (
          <div key={index} className={`text-xs ${colorClass} flex items-center justify-between group ${hoverBgClass} px-1 rounded`}>
            <span>
              [{goal.quarter}] - ⚽ {goal.player} 
              {goal.assist && <span> 🎯 {goal.assist}</span>}
              {goal.semiAssist && <span> 👍 {goal.semiAssist}</span>}
            </span>
            <button
              onClick={() => onDelete(index)}
              className="text-red-500 hover:text-red-700 ml-2 text-xs"
              title="삭제"
            >
              ✕
            </button>
          </div>
        ))}
    </div>
  );
}