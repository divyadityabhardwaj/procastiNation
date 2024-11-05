'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { Loader2, Plus, Video, FileText, ChevronLeft, ChevronRight, Home, X, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { marked } from 'marked'
import '../globals.css'

const AnimatedSummary = ({ summary }) => {
  const [displayedSummary, setDisplayedSummary] = useState('')
  const words = summary.split(' ')
  const [wordIndex, setWordIndex] = useState(0)

  useEffect(() => {
    if (wordIndex < words.length) {
      const timer = setTimeout(() => {
        setDisplayedSummary(prev => prev + ' ' + words[wordIndex])
        setWordIndex(wordIndex + 1)
      }, 10)
      return () => clearTimeout(timer)
    }
  }, [wordIndex, words])

  return (
    <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: marked(displayedSummary) }} />
  )
}

export default function SessionsPage() {
  const { sessionId } = useParams()
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [newSessionName, setNewSessionName] = useState('')
  const [error, setError] = useState(null)
  const [sessionVideos, setSessionVideos] = useState([])
  const [selectedSession, setSelectedSession] = useState(null)
  const [sidebarWidth] = useState(256)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [userName, setUserName] = useState('')
  const [showHome, setShowHome] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isAddVideoDialogOpen, setIsAddVideoDialogOpen] = useState(false)
  const [newVideoUrl, setNewVideoUrl] = useState('')
  const { toast } = useToast()
  const [expandedVideoId, setExpandedVideoId] = useState(null)
  const [playingVideoId, setPlayingVideoId] = useState(null)
  const [sessionNotes, setSessionNotes] = useState('')
  const [isNotesExpanded, setIsNotesExpanded] = useState(false)
  const [videoNotes, setVideoNotes] = useState({})
  const [videoSummaries, setVideoSummaries] = useState({})

  useEffect(() => {
    fetchSessions()
    fetchUserName()
  }, [])

  useEffect(() => {
    if (selectedSession) {
      fetchSessionNotes(selectedSession.id)
    }
  }, [selectedSession])

  useEffect(() => {
    let saveTimer
    if (selectedSession) {
      saveTimer = setInterval(() => {
        saveSessionNotes(selectedSession.id, sessionNotes)
      }, 10000)
    }
    return () => clearInterval(saveTimer)
  }, [selectedSession, sessionNotes])

  const fetchUserName = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/auth/user', {
        method: 'GET',
        credentials: 'include',
      })
      if (!response.ok) throw new Error('Network response was not ok')
      const data = await response.json()
      setUserName(data.name)
    } catch (error) {
      console.error('Error fetching user name:', error)
    }
  }

  const fetchSessions = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/sessions/sessions', {
        method: 'GET',
        credentials: 'include',
      })
      if (!response.ok) throw new Error('Network response was not ok')
      const data = await response.json()
      setSessions(data.sessions || [])
    } catch (error) {
      console.error('Error fetching sessions:', error)
      setError('Failed to fetch sessions')
      toast({
        title: "Error",
        description: "Failed to fetch sessions. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSessionSelect = async (session) => {
    setSelectedSession(session)
    setShowHome(false)
    setSessionVideos([])
    try {
      const response = await fetch(`http://localhost:3001/api/video/${session.id}`, {
        method: 'GET',
        credentials: 'include',
      })
      if (!response.ok) throw new Error('Network response was not ok')
      const data = await response.json()
      setSessionVideos(data.videos || [])
    } catch (error) {
      console.error('Error fetching session:', error)
      setError('Failed to fetch session')
      toast({
        title: "Error",
        description: "Failed to fetch session details. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleCreateSession = async (e) => {
    e.preventDefault()
    setError(null)
    try {
      const response = await fetch('http://localhost:3001/api/sessions/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newSessionName }),
        credentials: 'include',
      })
      if (!response.ok) throw new Error('Network response was not ok')
      const data = await response.json()
      setSessions([...sessions, data.session])
      setNewSessionName('')
      setIsDialogOpen(false)
      toast({
        title: "Success",
        description: "New session created successfully.",
      })
    } catch (error) {
      console.error('Error creating session:', error)
      setError('Failed to create session')
      toast({
        title: "Error",
        description: "Failed to create new session. Please try again.",
        variant: "destructive",
      })
    }
  }

  const fetchSessionNotes = async (sessionId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/sessions/${sessionId}/notes`, {
        method: 'GET',
        credentials: 'include',
      })
      if (!response.ok) throw new Error('Network response was not ok')
      const data = await response.json()
      setSessionNotes(data.notes || '')
    } catch (error) {
      console.error('Error fetching session notes:', error)
      toast({
        title: "Error",
        description: "Failed to fetch session notes. Please try again.",
        variant: "destructive",
      })
    }
  }

  const saveSessionNotes = async (sessionId, notes) => {
    try {
      const response = await fetch(`http://localhost:3001/api/sessions/${sessionId}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes }),
        credentials: 'include',
      })
      if (!response.ok) throw new Error('Network response was not ok')
      toast({
        title: "Success",
        description: "Session notes saved successfully.",
      })
    } catch (error) {
      console.error('Error saving session notes:', error)
      toast({
        title: "Error",
        description: "Failed to save session notes. Please try again.",
        variant: "destructive",
      })
    }
  }

  const fetchVideoNotes = async (videoId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/video/${videoId}/notes`, {
        method: 'GET',
        credentials: 'include',
      })
      if (!response.ok) throw new Error('Network response was not ok')
      const data = await response.json()
      setVideoNotes(prevNotes => ({ ...prevNotes, [videoId]: data.notes || '' }))
    } catch (error) {
      console.error('Error fetching video notes:', error)
      toast({
        title: "Error",
        description: "Failed to fetch video notes. Please try again.",
        variant: "destructive",
      })
    }
  }

  const saveVideoNotes = async (videoId, notes) => {
    try {
      const response = await fetch(`http://localhost:3001/api/video/${videoId}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes }),
        credentials: 'include',
      })
      if (!response.ok) throw new Error('Network response was not ok')
      toast({
        title: "Success",
        description: "Video notes saved successfully.",
      })
    } catch (error) {
      console.error('Error saving video notes:', error)
      toast({
        title: "Error",
        description: "Failed to save video notes. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleNotesChange = useCallback((videoId, newNotes) => {
    setVideoNotes(prevNotes => ({ ...prevNotes, [videoId]: newNotes }))
    saveVideoNotes(videoId, newNotes)
  }, [])

  const handleGenerateSummary = async (videoId, youtubeUrl) => {
    try {
      const response = await fetch(`http://localhost:3001/api/video/get/summary?youtubeUrl=${encodeURIComponent(youtubeUrl)}`, {
        method: 'GET',
        credentials: 'include',
      })
      if (!response.ok) throw new Error('Network response was not ok')
      const data = await response.json()
      setVideoSummaries(prevSummaries => ({ ...prevSummaries, [videoId]: data.summary }))
    } catch (error) {
      console.error('Error generating summary:', error)
      toast({
        title: "Error",
        description: "Failed to generate summary. Please try again.",
        variant: "destructive",
      })
    }
  }

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed)
  }

  const handleSessionNotesChange = (newNotes) => {
    setSessionNotes(newNotes)
  }

  const handleAddVideo = async () => {
    if (!selectedSession) {
      toast({
        title: "Error",
        description: "Please select a session first.",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch(`http://localhost:3001/api/video/create?sessionId=${selectedSession.id}&youtubeUrl=${encodeURIComponent(newVideoUrl)}`, {
        method: 'POST',
        credentials: 'include',
      })
      if (!response.ok) throw new Error('Network response was not ok')
      const data = await response.json()
      setSessionVideos([...sessionVideos, data.video])
      setNewVideoUrl('')
      setIsAddVideoDialogOpen(false)
      toast({
        title: "Success",
        description: "Video added successfully.",
      })
    } catch (error) {
      console.error('Error adding video:', error)
      toast({
        title: "Error",
        description: "Failed to add video. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <Loader2 className="mr-2 h-16 w-16 animate-spin text-gray-700" />
      </div>
    )
  }

  const mainContentWidth = isSidebarCollapsed ? 'calc(100% - 64px)' : `calc(100% - ${sidebarWidth}px)`
  const videoPlayerWidth = playingVideoId ? '50%' : '0%'

  return (
    <div className="flex h-screen bg-white text-gray-800">
      <div
        className="relative flex flex-col border-r border-gray-200 transition-all duration-300 ease-in-out"
        style={{ width: isSidebarCollapsed ? '64px' : `${sidebarWidth}px` }}
      >
        <div className="p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="absolute right-2 top-2 mr-1"
          >
            {isSidebarCollapsed ? <ChevronRight /> : <ChevronLeft />}
          </Button>
          {!isSidebarCollapsed ? (
            <>
              <h2 className="text-xl font-semibold mb-4">Welcome, {userName}</h2>
              <Button
                variant="ghost"
                className="w-full justify-start mb-4"
                onClick={() => {
                  setShowHome(true)
                  setSelectedSession(null)
                }}
              >
                <Home className="mr-2 h-4 w-4" />
                Home
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start mb-4"
                onClick={() => setIsDialogOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Create New Session
              </Button>
              <h3 className="text-lg font-semibold mb-2">Sessions</h3>
              <ScrollArea className="h-[calc(100vh-200px)]">
                {sessions.map((session) => (
                  <Button
                    key={session.id}
                    variant={selectedSession?.id === session.id ? "secondary" : "ghost"}
                    className="w-full justify-start mb-2"
                    onClick={() => handleSessionSelect(session)}
                  >
                    <FileText className="mr-2  h-4 w-4" />
                    <span className="truncate">{session.name}</span>
                  </Button>
                ))}
              </ScrollArea>
            </>
          ) : (
            <div className="flex flex-col items-center mt-8">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setShowHome(true)
                  setSelectedSession(null)
                }}
                className="mb-4"
              >
                <Home className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsDialogOpen(true)}
                className="mb-4"
              >
                <Plus className="h-6 w-6" />
              </Button>
            </div>
          )}
        </div>
      </div>
      <div  className="flex-1 flex overflow-hidden" style={{ width: mainContentWidth }}>
        <div className="flex-1 p-4 overflow-auto" style={{ width: playingVideoId ? '50%' : '100%' }}>
          {showHome ? (
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">Your Sessions</h2>
              <div className="space-y-4">
                {sessions.map((session) => (
                  <Card key={session.id} className="bg-white border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => handleSessionSelect(session)}>
                    <CardHeader>
                      <CardTitle className="text-gray-800">{session.name}</CardTitle>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          ) : selectedSession ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-gray-800">{selectedSession.name}</h2>
                <Button
                  onClick={() => setIsAddVideoDialogOpen(true)}
                  className="bg-gray-800 text-white hover:bg-gray-700"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Video
                </Button>
              </div>

              <div className="border border-gray-200 rounded-md">
                <Button
                  onClick={() => setIsNotesExpanded(!isNotesExpanded)}
                  className="w-full flex justify-between items-center py-2 px-4 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <span className="font-semibold text-gray-700">Session Notes</span>
                  {isNotesExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
                {isNotesExpanded && (
                  <div className="p-4">
                    <Textarea
                      value={sessionNotes}
                      onChange={(e) => handleSessionNotesChange(e.target.value)}
                      placeholder="Write your session notes here..."
                      className="mb-4 bg-white text-gray-800 border-gray-300 h-40"
                    />
                  </div>
                )}
              </div>

              {sessionVideos.length > 0 ? (
                <ScrollArea className="h-[calc(100vh)]">
                  {sessionVideos.map((video) => (
                    <div key={video.id} className="mb-8 border-b border-gray-200 pb-8">
                      <h3 className="text-lg flex items-center text-gray-800 mb-2 cursor-pointer" onClick={() => {
                        setExpandedVideoId(expandedVideoId === video.id ? null : video.id)
                        if (expandedVideoId !== video.id) {
                          fetchVideoNotes(video.id)
                        }
                      }}>
                        <Video className="mr-2 h-5 w-5" />
                        {video.title}
                      </h3>
                      {expandedVideoId === video.id && (
                        <div>
                          <h4 className="font-semibold mb-2 text-gray-700">Notes:</h4>
                          <Textarea
                            value={videoNotes[video.id] || ''}
                            onChange={(e) => handleNotesChange(video.id, e.target.value)}
                            placeholder="Write your notes here..."
                            className="mb-4 bg-white text-gray-800 border-gray-300 h-64"
                          />
                          <div className="flex justify-between items-center">
                            <Button
                              onClick={() => handleGenerateSummary(video.id, video.youtube_url)}
                              className="bg-white text-gray-800 hover:bg-gray-100 border border-gray-300 text-sm"
                            >
                              Generate Summary
                            </Button>
                            <Button
                              onClick={() => setPlayingVideoId(video.id)}
                              className="bg-white text-gray-800 hover:bg-gray-100 border border-gray-300 text-sm"
                            >
                              Watch Video
                            </Button>
                          </div>
                          {videoSummaries[video.id] && (
                            <div className="mt-4">
                              <h4 className="font-semibold mb-2 text-gray-700">Summary:</h4>
                              <AnimatedSummary summary={videoSummaries[video.id]} />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </ScrollArea>
              ) : (
                <div className="text-center">
                  <p className="text-gray-600">No videos available for this session. Please add a new video.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">Welcome to Your Sessions</h2>
              <p className="text-gray-600">Select a session from the sidebar to view its details.</p>
            </div>
          )}
        </div>
        {playingVideoId && (
          <div className="relative" style={{ width: videoPlayerWidth }}>
            <div className="h-full flex flex-col">
              <div className="flex-1 overflow-hidden">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${sessionVideos.find(video => video.id === playingVideoId)?.youtube_url.split('v=')[1]}`}
                  title="YouTube Video Player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <Button 
                onClick={() => setPlayingVideoId(null)} 
                className="mt-2 bg-gray-200 text-gray-800 hover:bg-gray-300 w-full flex items-center justify-center"
              >
                <X className="mr-2 h-4 w-4" />
                Close Video
              </Button>
            </div>
          </div>
        )}
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-white text-gray-800 border border-gray-200">
          <DialogHeader>
            <DialogTitle className="text-gray-800">Create New Session</DialogTitle>
            <DialogDescription className="text-gray-600">
              Enter a name for your new session.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateSession}>
            <Input
              value={newSessionName}
              onChange={(e) => setNewSessionName(e.target.value)}
              placeholder="Session Name"
              className="mb-4 bg-white text-gray-800 border-gray-300"
            />
            <DialogFooter>
              <Button type="submit" className="bg-gray-800 text-white hover:bg-gray-700">Create Session</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog open={isAddVideoDialogOpen} onOpenChange={setIsAddVideoDialogOpen}>
        <DialogContent className="bg-white text-gray-800 border border-gray-200">
          <DialogHeader>
            <DialogTitle className="text-gray-800">Add New Video</DialogTitle>
            <DialogDescription className="text-gray-600">
              Enter the YouTube URL of the video you want to add.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); handleAddVideo(); }}>
            <Input
              value={newVideoUrl}
              onChange={(e) => setNewVideoUrl(e.target.value)}
              placeholder="YouTube URL"
              className="mb-4 bg-white text-gray-800 border-gray-300"
            />
            <DialogFooter>
              <Button type="submit" className="bg-gray-800 text-white hover:bg-gray-700">Add Video</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}