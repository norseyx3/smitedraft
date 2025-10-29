import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Sword, Shield, Clock } from 'lucide-react';

export default function DraftHeader({ lobby, role, currentTurn, isMyTurn, draftOrder, timeRemaining }) {
  const timerColor = timeRemaining <= 10 ? 'text-red-400' : timeRemaining <= 30 ? 'text-yellow-400' : 'text-green-400';
  const timerBgColor = timeRemaining <= 10 ? 'bg-red-500/20' : timeRemaining <= 30 ? 'bg-yellow-500/20' : 'bg-green-500/20';

  return (
    <div className="bg-slate-800/90 backdrop-blur-sm border-b border-blue-500/30 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* Title */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sword className="w-5 h-5 text-amber-400" />
              <h1 className="text-xl font-bold text-white">SMITE 2 Draft</h1>
            </div>
            <p className="text-sm text-blue-200">
              {lobby.team1_name} vs {lobby.team2_name}
            </p>
          </div>

          {/* Timer */}
          <div className={`${timerBgColor} border-2 ${timerColor.replace('text-', 'border-')} rounded-xl px-6 py-3`}>
            <div className="text-center">
              <div className="text-xs text-slate-300 mb-1">Time Remaining</div>
              <div className={`text-3xl font-black ${timerColor} font-mono`}>
                {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
              </div>
            </div>
          </div>

          {/* Current Turn Info */}
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-xs text-slate-400 mb-1">Current Phase</div>
              <Badge className={currentTurn.action === 'ban' ? 'bg-red-600' : 'bg-green-600'}>
                {currentTurn.action === 'ban' ? (
                  <>
                    <Shield className="w-3 h-3 mr-1" />
                    Ban Phase
                  </>
                ) : (
                  <>
                    <Sword className="w-3 h-3 mr-1" />
                    Pick Phase
                  </>
                )}
              </Badge>
            </div>

            <div className="h-10 w-px bg-slate-600" />

            <div className="text-center">
              <div className="text-xs text-slate-400 mb-1">Active Team</div>
              <Badge className={currentTurn.team === 1 ? 'bg-blue-600' : 'bg-amber-600'}>
                {currentTurn.team === 1 ? lobby.team1_name : lobby.team2_name}
              </Badge>
            </div>

            {isMyTurn && role !== 'spectator' && (
              <>
                <div className="h-10 w-px bg-slate-600" />
                <Badge className="bg-gradient-to-r from-blue-600 to-amber-500 animate-pulse">
                  <Clock className="w-3 h-3 mr-1" />
                  Your Turn!
                </Badge>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}