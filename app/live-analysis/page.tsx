"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Play,
  Pause,
  Square,
  Volume2,
  Mic,
  Video,
  Users,
  Clock,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Activity,
  Brain,
  MessageSquare,
  BarChart3,
} from "lucide-react"
import Layout from "@/components/kokonutui/layout"

export default function LiveAnalysisPage() {
  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Live Analysis</h1>
            <p className="text-gray-600 dark:text-gray-400">Real-time debate monitoring and analysis</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Video className="h-4 w-4 mr-2" />
              Camera
            </Button>
            <Button size="sm">
              <Play className="h-4 w-4 mr-2" />
              Start Analysis
            </Button>
          </div>
        </div>

        {/* Live Status */}
        <Card className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                  <Badge variant="destructive">LIVE</Badge>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-red-900 dark:text-red-100">Presidential Debate 2024</h3>
                  <p className="text-red-700 dark:text-red-300">Economic Policy Discussion</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-red-700 dark:text-red-300">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  45:32
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />2 speakers
                </div>
                <div className="flex items-center gap-1">
                  <Activity className="h-4 w-4" />
                  1,234 viewers
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Control Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-sm">Recording Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Button size="sm" className="flex-1">
                  <Pause className="h-4 w-4 mr-2" />
                  Pause
                </Button>
                <Button variant="outline" size="sm">
                  <Square className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Volume2 className="h-4 w-4 text-gray-600" />
                <Progress value={75} className="flex-1 h-2" />
              </div>
              <div className="flex items-center gap-2">
                <Mic className="h-4 w-4 text-gray-600" />
                <Progress value={85} className="flex-1 h-2" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-sm">Speaker Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">John Smith</span>
                <Badge variant="default">Active</Badge>
              </div>
              <Progress value={65} className="h-2" />
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Sarah Johnson</span>
                <Badge variant="secondary">Listening</Badge>
              </div>
              <Progress value={35} className="h-2" />
            </CardContent>
          </Card>

          <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-sm">Analysis Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Accuracy</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">94.2%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Confidence</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">87.5%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Processing</span>
                <span className="text-sm font-medium text-green-600">Real-time</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-sm">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                <Brain className="h-4 w-4 mr-2" />
                AI Insights
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                <MessageSquare className="h-4 w-4 mr-2" />
                Transcript
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Analysis Tabs */}
        <Tabs defaultValue="realtime" className="space-y-6">
          <TabsList className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-0">
            <TabsTrigger value="realtime">Real-time</TabsTrigger>
            <TabsTrigger value="transcript">Transcript</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
          </TabsList>

          <TabsContent value="realtime" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-blue-600" />
                    Live Feed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        time: "45:32",
                        speaker: "John Smith",
                        text: "The economic indicators show a clear trend toward recovery...",
                        confidence: 95,
                      },
                      {
                        time: "45:28",
                        speaker: "Sarah Johnson",
                        text: "I disagree with that assessment. The data suggests...",
                        confidence: 92,
                      },
                      {
                        time: "45:15",
                        speaker: "John Smith",
                        text: "Let me clarify my position on fiscal policy...",
                        confidence: 88,
                      },
                      {
                        time: "45:02",
                        speaker: "Sarah Johnson",
                        text: "The unemployment figures tell a different story...",
                        confidence: 94,
                      },
                    ].map((item, index) => (
                      <div key={index} className="p-3 bg-gray-50/50 dark:bg-gray-700/50 rounded-lg border-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {item.time}
                            </Badge>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">{item.speaker}</span>
                          </div>
                          <Badge variant={item.confidence > 90 ? "default" : "secondary"} className="text-xs">
                            {item.confidence}%
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{item.text}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                    Alerts & Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { type: "warning", message: "Audio quality degraded", time: "2 min ago" },
                      { type: "info", message: "New speaker detected", time: "5 min ago" },
                      { type: "success", message: "Fact-check completed", time: "8 min ago" },
                      { type: "warning", message: "Background noise detected", time: "12 min ago" },
                    ].map((alert, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3 bg-gray-50/50 dark:bg-gray-700/50 rounded-lg border-0"
                      >
                        {alert.type === "warning" && <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5" />}
                        {alert.type === "info" && <Activity className="h-4 w-4 text-blue-500 mt-0.5" />}
                        {alert.type === "success" && <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />}
                        <div className="flex-1">
                          <p className="text-sm text-gray-900 dark:text-white">{alert.message}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">{alert.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="transcript" className="space-y-6">
            <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Live Transcript</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {[
                    {
                      time: "45:32",
                      speaker: "John Smith",
                      text: "The economic indicators show a clear trend toward recovery. We've seen consistent growth in employment rates over the past quarter, and consumer confidence is at its highest point in two years.",
                    },
                    {
                      time: "45:28",
                      speaker: "Sarah Johnson",
                      text: "I disagree with that assessment. The data suggests that while there may be short-term improvements, the underlying structural issues remain unaddressed. We need to look at long-term sustainability.",
                    },
                    {
                      time: "45:15",
                      speaker: "John Smith",
                      text: "Let me clarify my position on fiscal policy. The measures we've implemented have created a foundation for sustained growth, not just temporary relief.",
                    },
                    {
                      time: "45:02",
                      speaker: "Sarah Johnson",
                      text: "The unemployment figures tell a different story. While the headline numbers look good, underemployment and wage stagnation continue to affect millions of workers.",
                    },
                  ].map((item, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs">
                          {item.time}
                        </Badge>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{item.speaker}</span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{item.text}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-purple-600" />
                    AI Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 bg-purple-50/50 dark:bg-purple-900/20 rounded-lg border-0">
                      <h4 className="font-medium text-purple-900 dark:text-purple-100 mb-2">Key Topics</h4>
                      <div className="flex flex-wrap gap-2">
                        {["Economic Recovery", "Employment", "Fiscal Policy", "Consumer Confidence"].map(
                          (topic, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {topic}
                            </Badge>
                          ),
                        )}
                      </div>
                    </div>
                    <div className="p-3 bg-blue-50/50 dark:bg-blue-900/20 rounded-lg border-0">
                      <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Sentiment Analysis</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>John Smith</span>
                          <span className="text-green-600">Positive (72%)</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Sarah Johnson</span>
                          <span className="text-orange-600">Critical (68%)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Speech Clarity</span>
                        <span className="text-gray-900 dark:text-white">94%</span>
                      </div>
                      <Progress value={94} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Engagement Level</span>
                        <span className="text-gray-900 dark:text-white">87%</span>
                      </div>
                      <Progress value={87} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Fact Accuracy</span>
                        <span className="text-gray-900 dark:text-white">91%</span>
                      </div>
                      <Progress value={91} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="metrics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-blue-900 dark:text-blue-100 mb-2">45:32</div>
                  <p className="text-sm text-blue-700 dark:text-blue-300">Session Duration</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-green-900 dark:text-green-100 mb-2">1,234</div>
                  <p className="text-sm text-green-700 dark:text-green-300">Live Viewers</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-purple-900 dark:text-purple-100 mb-2">94.2%</div>
                  <p className="text-sm text-purple-700 dark:text-purple-300">Accuracy Rate</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  )
}
