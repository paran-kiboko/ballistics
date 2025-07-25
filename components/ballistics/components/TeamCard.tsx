import React from 'react';

interface TeamCardProps {
  teamId: 'yellow' | 'blue' | 'unassigned';
  teamName: string;
  members: string[];
  emoji: string;
  colorClass: string;
  borderClass: string;
  bgClass: string;
  onAddPlayer: () => void;
  onRemovePlayer: (playerName: string) => void;
  onMoveToYellow?: (playerName: string) => void;
  onMoveToBlue?: (playerName: string) => void;
  showTeamButtons?: boolean;
}

export default function TeamCard({
  teamId,
  teamName,
  members,
  emoji,
  colorClass,
  borderClass,
  bgClass,
  onAddPlayer,
  onRemovePlayer,
  onMoveToYellow,
  onMoveToBlue,
  showTeamButtons = false
}: TeamCardProps) {
  return (
    <div id={`${teamId}-team-card`} className={`p-3 ${borderClass} rounded-lg ${bgClass} shadow-sm`}>
      <div className="flex items-center justify-between mb-2">
        <h4 className={`font-medium ${colorClass} flex items-center`}>
          {emoji} {teamName} ({members.length}명)
        </h4>
        <button
          onClick={onAddPlayer}
          className={`text-xs ${teamId === 'yellow' ? 'bg-green-500 hover:bg-green-600' : teamId === 'blue' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-500 hover:bg-gray-600'} text-white px-3 py-2 rounded transition-colors touch-manipulation cursor-pointer min-h-[32px] min-w-[50px]`}
        >
          + 추가
        </button>
      </div>
      <div className="space-y-1">
        {members.sort().map((member, index) => (
          <div key={index} className="text-sm p-1 bg-white rounded border border-gray-200 flex items-center justify-between">
            <span>{member}</span>
            <div className="flex gap-1">
              {showTeamButtons && (
                <>
                  <button
                    onClick={() => onMoveToYellow?.(member)}
                    className="text-green-600 hover:text-green-800 text-xs px-1 touch-manipulation cursor-pointer min-h-[24px] min-w-[24px] flex items-center justify-center"
                    title="형광팀으로 이동"
                  >
                    🟢
                  </button>
                  <button
                    onClick={() => onMoveToBlue?.(member)}
                    className="text-blue-600 hover:text-blue-800 text-xs px-1 touch-manipulation cursor-pointer min-h-[24px] min-w-[24px] flex items-center justify-center"
                    title="파랑팀으로 이동"
                  >
                    🔵
                  </button>
                </>
              )}
              <button
                onClick={() => onRemovePlayer(member)}
                className="text-red-500 hover:text-red-700 text-xs touch-manipulation cursor-pointer min-h-[24px] min-w-[24px] flex items-center justify-center"
                title={teamId === 'unassigned' ? '완전 제거' : '미배정 인원으로 이동'}
              >
                ✕
              </button>
            </div>
          </div>
        ))}
        {members.length === 0 && (
          <div className="text-sm text-gray-500 p-1">
            {teamId === 'unassigned' ? '모든 인원이 배정되었습니다' : '팀원을 추가해주세요'}
          </div>
        )}
      </div>
    </div>
  );
}