// File: src/pages/Home.jsx
import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sword, Users, Eye, Copy, Check, ExternalLink } from 'lucide-react';
import { createPageUrl } from '@/utils';
import { Link } from 'react-router-dom';

export default function Home() {
  const [isCreating, setIsCreating] = useState(false);
  const [lobbyLinks, setLobbyLinks] = useState(null);
  const [team1Name, setTeam1Name] = useState('Order Side');
  const [team2Name, setTeam2Name] = useState('Chaos Side');
  const [copiedLink, setCopiedLink] = useState(null);

  const createLobby = async () => {
    setIsCreating(true);
    try {
      const lobbyId = `lobby_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      await base44.entities.Lobby.create({
        lobby_id: lobbyId,
        team1_name: team1Name,
        team2_name: team2Name
      });

      const baseUrl = window.location.origin;
      const links = {
        captain1: `${baseUrl}${createPageUrl('Draft')}?lobby=${lobbyId}&role=captain1`,
        captain2: `${baseUrl}${createPageUrl('Draft')}?lobby=${lobbyId}&role=captain2`,
        spectator: `${baseUrl}${createPageUrl('Draft')}?lobby=${lobbyId}&role=spectator`,
        captain1Path: `${createPageUrl('Draft')}?lobby=${lobbyId}&role=captain1`,
        captain2Path: `${createPageUrl('Draft')}?lobby=${lobbyId}&role=captain2`,
        spectatorPath: `${createPageUrl('Draft')}?lobby=${lobbyId}&role=spectator`
      };

      setLobbyLinks(links);
    } catch (error) {
      console.error('Error creating lobby:', error);
    }
    setIsCreating(false);
  };

  const copyToClipboard = (text, linkType) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(linkType);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1920')] opacity-5 bg-cover bg-center" />
      
      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Sword className="w-12 h-12 text-amber-400" />
              <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight">
                SMITE 2 Draft
              </h1>
            </div>
            <p className="text-xl text-blue-200 font-medium">
              SMITE 2 Draft Competitive Simulator
            </p>
          </div>

          {!lobbyLinks ? (
            /* Create Lobby Card */
            <Card className="bg-slate-800/90 backdrop-blur-sm border-blue-500/30 shadow-2xl">
              <CardHeader className="border-b border-blue-500/20">
                <CardTitle className="text-2xl text-white">Create Draft Lobby</CardTitle>
                <CardDescription className="text-blue-200">
                  Set up your draft session and get unique links for captains and spectators
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="team1" className="text-white">Team 1 Name</Label>
                    <Input
                      id="team1"
                      value={team1Name}
                      onChange={(e) => setTeam1Name(e.target.value)}
                      placeholder="Enter team name"
                      className="bg-slate-700 border-blue-500/30 text-white placeholder:text-slate-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="team2" className="text-white">Team 2 Name</Label>
                    <Input
                      id="team2"
                      value={team2Name}
                      onChange={(e) => setTeam2Name(e.target.value)}
                      placeholder="Enter team name"
                      className="bg-slate-700 border-blue-500/30 text-white placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <Button
                  onClick={createLobby}
                  disabled={isCreating}
                  className="w-full bg-gradient-to-r from-blue-600 to-amber-500 hover:from-blue-700 hover:to-amber-600 text-white font-bold py-6 text-lg shadow-lg shadow-blue-500/50"
                >
                  {isCreating ? (
                    <>Creating Lobby...</>
                  ) : (
                    <>
                      <Users className="w-5 h-5 mr-2" />
                      Create Draft Lobby
                    </>
                  )}
                </Button>

                <div className="grid md:grid-cols-3 gap-4 pt-4 border-t border-blue-500/20">
                  <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                    <Users className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                    <p className="text-sm text-white font-semibold">Captain Links</p>
                    <p className="text-xs text-blue-300 mt-1">Control the draft</p>
                  </div>
                  <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                    <Eye className="w-8 h-8 mx-auto mb-2 text-amber-400" />
                    <p className="text-sm text-white font-semibold">Spectator Link</p>
                    <p className="text-xs text-blue-300 mt-1">Watch & stream</p>
                  </div>
                  <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                    <Sword className="w-8 h-8 mx-auto mb-2 text-green-400" />
                    <p className="text-sm text-white font-semibold">Snake Draft</p>
                    <p className="text-xs text-blue-300 mt-1">Competitive format</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            /* Links Display Card */
            <Card className="bg-slate-800/90 backdrop-blur-sm border-blue-500/30 shadow-2xl">
              <CardHeader className="border-b border-blue-500/20">
                <CardTitle className="text-2xl text-white flex items-center gap-2">
                  <Check className="w-6 h-6 text-green-400" />
                  Lobby Created!
                </CardTitle>
                <CardDescription className="text-blue-200">
                  Share these links with your team captains and spectators
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                {/* Captain 1 Link */}
                <div className="space-y-2">
                  <Label className="text-white font-semibold flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-400" />
                    {team1Name} Captain Link
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      value={lobbyLinks.captain1}
                      readOnly
                      className="bg-slate-700 border-blue-500/30 text-white font-mono text-sm"
                    />
                    <Button
                      onClick={() => copyToClipboard(lobbyLinks.captain1, 'captain1')}
                      variant="outline"
                      className="border-blue-500/30 hover:bg-blue-600"
                    >
                      {copiedLink === 'captain1' ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                    <Link to={lobbyLinks.captain1Path}>
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Captain 2 Link */}
                <div className="space-y-2">
                  <Label className="text-white font-semibold flex items-center gap-2">
                    <Users className="w-4 h-4 text-amber-400" />
                    {team2Name} Captain Link
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      value={lobbyLinks.captain2}
                      readOnly
                      className="bg-slate-700 border-amber-500/30 text-white font-mono text-sm"
                    />
                    <Button
                      onClick={() => copyToClipboard(lobbyLinks.captain2, 'captain2')}
                      variant="outline"
                      className="border-amber-500/30 hover:bg-amber-600"
                    >
                      {copiedLink === 'captain2' ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                    <Link to={lobbyLinks.captain2Path}>
                      <Button className="bg-amber-600 hover:bg-amber-700">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Spectator Link */}
                <div className="space-y-2">
                  <Label className="text-white font-semibold flex items-center gap-2">
                    <Eye className="w-4 h-4 text-green-400" />
                    Spectator Link (For Streaming)
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      value={lobbyLinks.spectator}
                      readOnly
                      className="bg-slate-700 border-green-500/30 text-white font-mono text-sm"
                    />
                    <Button
                      onClick={() => copyToClipboard(lobbyLinks.spectator, 'spectator')}
                      variant="outline"
                      className="border-green-500/30 hover:bg-green-600"
                    >
                      {copiedLink === 'spectator' ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                    <Link to={lobbyLinks.spectatorPath}>
                      <Button className="bg-green-600 hover:bg-green-700">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="pt-4 border-t border-blue-500/20">
                  <Button
                    onClick={() => setLobbyLinks(null)}
                    variant="outline"
                    className="w-full border-blue-500/30 hover:bg-slate-700"
                  >
                    Create Another Lobby
                  </Button>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                  <p className="text-sm text-blue-200">
                    <strong className="text-white">Tip:</strong> Each captain should open their link to control their team's picks. 
                    Share the spectator link in Discord for your community to watch the draft live!
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* How it Works */}
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <Card className="bg-slate-800/70 backdrop-blur-sm border-blue-500/20">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mb-2">
                  <span className="text-2xl font-bold text-blue-400">1</span>
                </div>
                <CardTitle className="text-white">Create Lobby</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-blue-200 text-sm">
                  Generate unique links for both team captains and spectators
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/70 backdrop-blur-sm border-amber-500/20">
              <CardHeader>
                <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center mb-2">
                  <span className="text-2xl font-bold text-amber-400">2</span>
                </div>
                <CardTitle className="text-white">Snake Draft</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-blue-200 text-sm">
                  Captains take turns banning and picking gods in competitive order
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/70 backdrop-blur-sm border-green-500/20">
              <CardHeader>
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mb-2">
                  <span className="text-2xl font-bold text-green-400">3</span>
                </div>
                <CardTitle className="text-white">Play In-Game</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-blue-200 text-sm">
                  Lock in your drafted gods manually in SMITE 2 custom game
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}