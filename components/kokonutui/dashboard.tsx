"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { BarChart3, Users, Clock, TrendingUp, Play, Pause, Square, Mic, Video, Shield, Brain } from "lucide-react"

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Monitor your debate analysis in real-time</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Play className="h-4 w-4 mr-2" />
            Start Analysis
          </Button>
          <Button size="sm">
            <Video className="h-4 w-4 mr-2" />
            New Session
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Sessions</CardTitle>
            <Video className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">3</div>
            <p className="text-xs text-green-600 dark:text-green-400">+2 from yesterday</p>
          </CardContent>
        </Card>

        <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Speakers</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">24</div>
            <p className="text-xs text-green-600 dark:text-green-400">+12% from last week</p>
          </CardContent>
        </Card>

        <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Analysis Time</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">2.4h</div>
            <p className="text-xs text-orange-600 dark:text-orange-400">Average session length</p>
          </CardContent>
        </Card>

        <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Accuracy Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">94.2%</div>
            <p className="text-xs text-green-600 dark:text-green-400">+2.1% improvement</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Sessions */}
        <div className="lg:col-span-2">
          <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5 text-blue-600" />
                Live Sessions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: "Presidential Debate 2024", speakers: 2, duration: "45:32", status: "live" },
                { name: "Climate Change Panel", speakers: 4, duration: "1:23:45", status: "recording" },
                { name: "Tech Innovation Forum", speakers: 3, duration: "32:18", status: "paused" },
              ].map((session, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50/50 dark:bg-gray-700/50 rounded-lg border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      {session.status === "live" && <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />}
                      {session.status === "recording" && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
                      {session.status === "paused" && <div className="w-2 h-2 bg-yellow-500 rounded-full" />}
                      <Badge
                        variant={
                          session.status === "live"
                            ? "destructive"
                            : session.status === "recording"
                              ? "default"
                              : "secondary"
                        }
                      >
                        {session.status}
                      </Badge>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{session.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {session.speakers} speakers • {session.duration}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      {session.status === "live" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Square className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="ghost">
                <Mic className="h-4 w-4 mr-2" />
                Start Transcription
              </Button>
              <Button className="w-full justify-start" variant="ghost">
                <Shield className="h-4 w-4 mr-2" />
                Fact Check
              </Button>
              <Button className="w-full justify-start" variant="ghost">
                <Brain className="h-4 w-4 mr-2" />
                AI Analysis
              </Button>
              <Button className="w-full justify-start" variant="ghost">
                <BarChart3 className="h-4 w-4 mr-2" />
                View Analytics
              </Button>
            </CardContent>
          </Card>

  
        </div>
      </div>
    </div>
  )
}
