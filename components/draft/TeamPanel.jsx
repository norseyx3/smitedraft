import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Crown, Shield } from 'lucide-react';

export default function TeamPanel({ teamName, picks = [], bans = [], color, isActive }) {
  const colorStyles = {
    blue: {
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30',
      activeBorder: 'border-blue-500',
      text: 'text-blue-400',
      badge: 'bg-blue-500'
    },
    amber: {
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/30',
      activeBorder: 'border-amber-500',
      text: 'text-amber-400',
      badge: 'bg-amber-500'
    }
  };

  const styles = colorStyles[color];

  return (
    <div className="space-y-4">
      <Card className={`
        ${styles.bg} backdrop-blur-sm border-2 transition-all
        ${isActive ? `${styles.activeBorder} shadow-lg shadow-${color}-500/50` : styles.border}
      `}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <span className="text-white">{teamName}</span>
            {isActive && (
              <Badge className={`${styles.badge} text-white animate-pulse`}>
                <Crown className="w-3 h-3 mr-1" />
                Picking
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {[0, 1, 2, 3, 4].map((index) => (
            <div
              key={index}
              className={`
                p-3 rounded-lg border transition-all
                ${picks[index] 
                  ? `bg-slate-700/80 border-${color}-500/50` 
                  : 'bg-slate-800/50 border-slate-700'
                }
              `}
            >
              {picks[index] ? (
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full ${styles.bg} flex items-center justify-center border ${styles.border}`}>
                    <User className={`w-4 h-4 ${styles.text}`} />
                  </div>
                  <div>
                    <p className="font-medium text-white text-sm">{picks[index]}</p>
                    <p className="text-xs text-slate-400">Pick {index + 1}</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 opacity-40">
                  <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
                    <User className="w-4 h-4 text-slate-500" />
                  </div>
                  <p className="text-sm text-slate-500">Waiting for pick {index + 1}</p>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Bans Section */}
      <Card className={`${styles.bg} backdrop-blur-sm border ${styles.border}`}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-white text-lg">
            <Shield className="w-4 h-4 text-red-400" />
            Bans
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-2">
            {[0, 1, 2, 3, 4].map((index) => (
              <div
                key={index}
                className={`
                  relative aspect-square rounded-lg overflow-hidden border-2
                  ${bans[index] 
                    ? 'border-red-500/50 bg-slate-700' 
                    : 'border-slate-700 bg-slate-800/50'
                  }
                `}
              >
                {bans[index] ? (
                  <>
                    {/* Placeholder for god image */}
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-600 to-slate-800" />
                    
                    {/* God name overlay */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent p-1">
                      <p className="text-white text-[10px] font-bold text-center leading-tight">
                        {bans[index]}
                      </p>
                    </div>

                    {/* Banned X overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-red-900/60">
                      <div className="text-red-200 font-black text-2xl">✕</div>
                    </div>
                  </>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-slate-600" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}