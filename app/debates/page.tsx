"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Filter,
  Plus,
  Play,
  Pause,
  Square,
  Users,
  Clock,
  Calendar,
  Eye,
  MessageSquare,
  TrendingUp,
  MoreHorizontal,
  Video,
} from "lucide-react"
import Layout from "@/components/kokonutui/layout"

export default function DebatesPage() {
  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Debates</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage and monitor debate sessions</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Debate
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search debates..."
            className="pl-10 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-0 shadow-sm"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Active Debates</p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">3</p>
                </div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700 dark:text-green-300">Completed</p>
                  <p className="text-2xl font-bold text-green-900 dark:text-green-100">156</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Total Hours</p>
                  <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">2,847</p>
                </div>
                <Clock className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-700 dark:text-orange-300">Participants</p>
                  <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">89</p>
                </div>
                <Users className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Debate Tabs */}
        <Tabs defaultValue="active" className="space-y-6">
          <TabsList className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-0">
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="archived">Archived</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {[
              {
                title: "Presidential Debate 2024",
                topic: "Economic Policy",
                speakers: ["John Smith", "Sarah Johnson"],
                duration: "45:32",
                status: "live",
                viewers: 1234,
                startTime: "2:30 PM",
              },
              {
                title: "Climate Change Panel",
                topic: "Environmental Policy",
                speakers: ["Dr. Emily Chen", "Prof. Michael Brown", "Lisa Wilson", "David Garcia"],
                duration: "1:23:45",
                status: "recording",
                viewers: 856,
                startTime: "1:00 PM",
              },
              {
                title: "Tech Innovation Forum",
                topic: "AI Ethics",
                speakers: ["Alex Thompson", "Maria Rodriguez", "James Kim"],
                duration: "32:18",
                status: "paused",
                viewers: 445,
                startTime: "3:15 PM",
              },
            ].map((debate, index) => (
              <Card key={index} className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{debate.title}</h3>
                        <div className="flex items-center gap-2">
                          {debate.status === "live" && (
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                          )}
                          {debate.status === "recording" && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
                          {debate.status === "paused" && <div className="w-2 h-2 bg-yellow-500 rounded-full" />}
                          <Badge
                            variant={
                              debate.status === "live"
                                ? "destructive"
                                : debate.status === "recording"
                                  ? "default"
                                  : "secondary"
                            }
                          >
                            {debate.status}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mb-3">{debate.topic}</p>

                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {debate.speakers.length} speakers
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {debate.duration}
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {debate.viewers} viewers
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Started {debate.startTime}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {debate.speakers.map((speaker, speakerIndex) => (
                          <Badge key={speakerIndex} variant="outline" className="text-xs">
                            {speaker}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <Button variant="outline" size="sm">
                        {debate.status === "live" || debate.status === "recording" ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>
                      <Button variant="outline" size="sm">
                        <Square className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Video className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="scheduled" className="space-y-4">
            {[
              {
                title: "Healthcare Reform Debate",
                topic: "Healthcare Policy",
                speakers: ["Dr. Amanda White", "Robert Johnson"],
                scheduledTime: "Tomorrow, 2:00 PM",
                duration: "2 hours",
                participants: 2,
              },
              {
                title: "Education System Discussion",
                topic: "Education Reform",
                speakers: ["Prof. Lisa Chen", "Mark Thompson", "Sarah Davis"],
                scheduledTime: "Jan 20, 10:00 AM",
                duration: "1.5 hours",
                participants: 3,
              },
            ].map((debate, index) => (
              <Card key={index} className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{debate.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-3">{debate.topic}</p>

                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {debate.scheduledTime}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {debate.duration}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {debate.participants} participants
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {debate.speakers.map((speaker, speakerIndex) => (
                          <Badge key={speakerIndex} variant="outline" className="text-xs">
                            {speaker}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button size="sm">Start Early</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="completed">
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Completed debates will be displayed here</p>
            </div>
          </TabsContent>

          <TabsContent value="archived">
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Archived debates will be displayed here</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  )
}
