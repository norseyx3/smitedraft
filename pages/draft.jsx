// File: src/pages/Draft.jsx
import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, Sword, Crown, Eye, AlertCircle, Check, X } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import GodGrid from '../components/draft/GodGrid';
import TeamPanel from '../components/draft/TeamPanel';
import DraftHeader from '../components/draft/DraftHeader';

export default function Draft() {
  const urlParams = new URLSearchParams(window.location.search);
  const lobbyId = urlParams.get('lobby');
  const role = urlParams.get('role');
  const queryClient = useQueryClient();
  
  const [selectedGod, setSelectedGod] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(60);

  const { data: lobbies, isLoading } = useQuery({
    queryKey: ['lobby', lobbyId],
    queryFn: () => base44.entities.Lobby.filter({ lobby_id: lobbyId }),
    refetchInterval: 2000,
    initialData: []
  });

  const lobby = lobbies?.[0];

  // Timer logic
  useEffect(() => {
    if (!lobby || lobby.draft_complete) return;

    const turnStartTime = lobby.turn_start_time ? new Date(lobby.turn_start_time).getTime() : Date.now();
    const updateTimer = () => {
      const now = Date.now();
      const elapsed = Math.floor((now - turnStartTime) / 1000);
      const remaining = Math.max(0, 60 - elapsed);
      setTimeRemaining(remaining);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 100);

    return () => clearInterval(interval);
  }, [lobby?.current_turn, lobby?.turn_start_time, lobby?.draft_complete]);

  const updateLobbyMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Lobby.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lobby', lobbyId] });
      setSelectedGod(null);
    }
  });

  const getDraftOrder = () => {
    return [
      { team: 1, action: 'ban' },
      { team: 2, action: 'ban' },
      { team: 1, action: 'ban' },
      { team: 2, action: 'ban' },
      { team: 1, action: 'ban' },
      { team: 2, action: 'ban' },
      { team: 1, action: 'pick' },
      { team: 2, action: 'pick' },
      { team: 2, action: 'pick' },
      { team: 1, action: 'pick' },
      { team: 1, action: 'pick' },
      { team: 2, action: 'pick' },
      { team: 2, action: 'ban' },
      { team: 1, action: 'ban' },
      { team: 2, action: 'ban' },
      { team: 1, action: 'ban' },
      { team: 2, action: 'pick' },
      { team: 1, action: 'pick' },
      { team: 1, action: 'pick' },
      { team: 2, action: 'pick' }
    ];
  };

  const draftOrder = getDraftOrder();
  const currentTurn = draftOrder[lobby?.current_turn] || {};
  const isMyTurn = (role === 'captain1' && currentTurn.team === 1) || 
                   (role === 'captain2' && currentTurn.team === 2);
  const canInteract = role !== 'spectator' && isMyTurn && !lobby?.draft_complete;

  const handleGodSelect = (godName) => {
    if (!canInteract || !lobby) return;
    setSelectedGod(godName);
  };

  const handleConfirm = () => {
    if (!selectedGod || !canInteract || !lobby) return;

    const action = currentTurn.action;
    let updates = {};

    if (action === 'ban') {
      if (currentTurn.team === 1) {
        updates.team1_bans = [...(lobby.team1_bans || []), selectedGod];
      } else {
        updates.team2_bans = [...(lobby.team2_bans || []), selectedGod];
      }
    } else if (action === 'pick') {
      if (currentTurn.team === 1) {
        updates.team1_picks = [...(lobby.team1_picks || []), selectedGod];
      } else {
        updates.team2_picks = [...(lobby.team2_picks || []), selectedGod];
      }
    }

    const nextTurn = lobby.current_turn + 1;
    updates.current_turn = nextTurn;
    updates.turn_start_time = new Date().toISOString();

    if (nextTurn >= draftOrder.length) {
      updates.draft_complete = true;
    }

    updateLobbyMutation.mutate({ id: lobby.id, data: updates });
  };

  const handleCancel = () => {
    setSelectedGod(null);
  };

  // Initialize turn_start_time on first load if not set
  useEffect(() => {
    if (lobby && !lobby.turn_start_time && !lobby.draft_complete) {
      updateLobbyMutation.mutate({ 
        id: lobby.id, 
        data: { turn_start_time: new Date().toISOString() } 
      });
    }
  }, [lobby?.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading draft...</div>
      </div>
    );
  }

  if (!lobby) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
        <Alert className="max-w-md bg-red-500/20 border-red-500">
          <AlertCircle className="h-4 w-4 text-red-400" />
          <AlertDescription className="text-white">
            Lobby not found. Please check your link.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const allPicks = [...(lobby.team1_picks || []), ...(lobby.team2_picks || [])];
  const allBans = [...(lobby.team1_bans || []), ...(lobby.team2_bans || [])];
  const unavailableGods = [...allBans, ...allPicks];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      <DraftHeader 
        lobby={lobby}
        role={role}
        currentTurn={currentTurn}
        isMyTurn={isMyTurn}
        draftOrder={draftOrder}
        timeRemaining={timeRemaining}
      />

      <div className="container mx-auto px-4 py-6">
        {lobby.draft_complete ? (
          <div className="text-center py-12">
            <div className="max-w-2xl mx-auto bg-slate-800/90 backdrop-blur-sm rounded-2xl p-8 border border-green-500/30">
              <Crown className="w-16 h-16 mx-auto mb-4 text-amber-400" />
              <h2 className="text-3xl font-bold mb-4">Draft Complete!</h2>
              <p className="text-blue-200 mb-6">
                Head into SMITE 2 and manually select your drafted gods in the custom game lobby.
              </p>
              <div className="grid md:grid-cols-2 gap-6 mt-8">
                <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/30">
                  <h3 className="font-bold text-lg mb-2">{lobby.team1_name}</h3>
                  <div className="space-y-1">
                    {lobby.team1_picks.map((god, idx) => (
                      <div key={idx} className="text-sm text-blue-200">{god}</div>
                    ))}
                  </div>
                </div>
                <div className="bg-amber-500/10 rounded-lg p-4 border border-amber-500/30">
                  <h3 className="font-bold text-lg mb-2">{lobby.team2_name}</h3>
                  <div className="space-y-1">
                    {lobby.team2_picks.map((god, idx) => (
                      <div key={idx} className="text-sm text-amber-200">{god}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-12 gap-6">
            {/* Team Panels */}
            <div className="lg:col-span-3">
              <TeamPanel
                teamName={lobby.team1_name}
                picks={lobby.team1_picks || []}
                bans={lobby.team1_bans || []}
                color="blue"
                isActive={currentTurn.team === 1}
              />
            </div>

            {/* God Grid */}
            <div className="lg:col-span-6">
              <div className="bg-slate-800/90 backdrop-blur-sm rounded-2xl border border-blue-500/30 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold">Select God</h3>
                  {canInteract && (
                    <Badge className="bg-gradient-to-r from-blue-600 to-amber-500">
                      Your Turn - {currentTurn.action === 'ban' ? 'BAN' : 'PICK'}
                    </Badge>
                  )}
                </div>
                
                {/* Confirmation Panel */}
                {selectedGod && canInteract && (
                  <div className="mb-4 bg-blue-500/20 border-2 border-blue-500 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-slate-700 flex items-center justify-center">
                          <span className="text-lg font-bold">{selectedGod[0]}</span>
                        </div>
                        <div>
                          <p className="text-sm text-slate-300">Selected God</p>
                          <p className="text-lg font-bold">{selectedGod}</p>
                        </div>
                      </div>
                      <Button
                        onClick={handleConfirm}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Confirm {currentTurn.action === 'ban' ? 'Ban' : 'Pick'}
                      </Button>
                    </div>
                  </div>
                )}

                <GodGrid
                  unavailableGods={unavailableGods}
                  onSelect={handleGodSelect}
                  canInteract={canInteract}
                  selectedGod={selectedGod}
                />
              </div>
            </div>

            {/* Team 2 Panel */}
            <div className="lg:col-span-3">
              <TeamPanel
                teamName={lobby.team2_name}
                picks={lobby.team2_picks || []}
                bans={lobby.team2_bans || []}
                color="amber"
                isActive={currentTurn.team === 2}
              />
            </div>
          </div>
        )}

        {/* Role Indicator */}
        {role && (
          <div className="fixed bottom-4 right-4">
            <Badge className={`
              ${role === 'captain1' ? 'bg-blue-600' : ''}
              ${role === 'captain2' ? 'bg-amber-600' : ''}
              ${role === 'spectator' ? 'bg-green-600' : ''}
              text-white px-4 py-2 flex items-center gap-2
            `}>
              {role === 'spectator' ? (
                <><Eye className="w-4 h-4" /> Spectator Mode</>
              ) : role === 'captain1' ? (
                <><Sword className="w-4 h-4" /> {lobby.team1_name} Captain</>
              ) : (
                <><Sword className="w-4 h-4" /> {lobby.team2_name} Captain</>
              )}
            </Badge>
          </div>
        )}
      </div>
    </div>
  );
}