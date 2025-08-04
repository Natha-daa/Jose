"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  User,
  TrendingUp,
  TrendingDown,
  MessageSquare,
  CheckCircle,
  AlertTriangle,
  Calendar,
  Filter,
  MoreHorizontal,
  Eye,
  Share,
  Star,
} from "lucide-react"
import Image from "next/image"
import Layout from "@/components/kokonutui/layout"

export default function SpeakerProfilesPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const speakers = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      role: "Climate Scientist",
      avatar: "https://ferf1mheo22r9ira.public.blob.vercel-storage.com/avatar-01-n0x8HFv8EUetf9z6ht0wScJKoTHqf8.png",
      totalDebates: 23,
      factCheckScore: 92,
      contradictionRate: 3,
      lastSeen: "2 hours ago",
      trend: "up",
      expertise: ["Climate Change", "Environmental Policy", "Renewable Energy"],
      totalSpeakTime: "12h 34m",
      avgAccuracy: 94,
      followers: 1247,
    },
    {
      id: 2,
      name: "Senator Mike Davis",
      role: "Politician",
      avatar: "https://ferf1mheo22r9ira.public.blob.vercel-storage.com/avatar-02-albo9B0tWOSLXCVZh9rX9KFxXIVWMr.png",
      totalDebates: 45,
      factCheckScore: 67,
      contradictionRate: 15,
      lastSeen: "Live now",
      trend: "down",
      expertise: ["Economic Policy", "Healthcare", "Education"],
      totalSpeakTime: "28h 12m",
      avgAccuracy: 72,
      followers: 2891,
    },
    {
      id: 3,
      name: "Prof. Elena Rodriguez",
      role: "Economist",
      totalDebates: 18,
      factCheckScore: 88,
      contradictionRate: 7,
      lastSeen: "Yesterday",
      trend: "stable",
      expertise: ["Economic Theory", "Market Analysis", "Policy Impact"],
      totalSpeakTime: "9h 45m",
      avgAccuracy: 89,
      followers: 856,
    },
  ]

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-green-600" />
      case "down":
        return <TrendingDown className="w-4 h-4 text-red-600" />
      default:
        return <div className="w-4 h-4" />
    }
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Speaker Profiles</h1>
            <p className="text-gray-600 dark:text-gray-400">Track and analyze speaker performance across debates</p>
          </div>

          <Button className="flex items-center gap-2" size="sm">
            <User className="h-4 w-4" />
            Add Speaker
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Speakers</p>
                  <p className="text-xl font-bold">847</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Avg Accuracy</p>
                  <p className="text-xl font-bold">84%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Debates</p>
                  <p className="text-xl font-bold">1,247</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Avg Contradictions</p>
                  <p className="text-xl font-bold">8.3%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search speakers, roles, expertise..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Role
            </Button>
            <Button variant="outline" size="sm">
              <TrendingUp className="w-4 h-4 mr-2" />
              Performance
            </Button>
            <Button variant="outline" size="sm">
              <Calendar className="w-4 h-4 mr-2" />
              Activity
            </Button>
          </div>
        </div>

        {/* Speaker Tabs */}
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Speakers</TabsTrigger>
            <TabsTrigger value="top-performers">Top Performers</TabsTrigger>
            <TabsTrigger value="recent">Recently Active</TabsTrigger>
            <TabsTrigger value="trending">Trending</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {speakers.map((speaker) => (
                <Card
                  key={speaker.id}
                  className="overflow-hidden bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-0 shadow-lg"
                >
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          {speaker.avatar ? (
                            <Image
                              src={speaker.avatar || "/placeholder.svg"}
                              alt={speaker.name}
                              width={40}
                              height={40}
                              className="rounded-full ring-2 ring-gray-200 dark:ring-gray-700"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                              <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                            </div>
                          )}
                          <div>
                            <h3 className="font-semibold text-sm text-gray-900 dark:text-white">{speaker.name}</h3>
                            <p className="text-xs text-gray-600 dark:text-gray-400">{speaker.role}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          {getTrendIcon(speaker.trend)}
                          <Button size="sm" variant="ghost">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Status */}
                      <div className="flex items-center gap-2">
                        {speaker.lastSeen === "Live now" && (
                          <Badge className="bg-red-500/20 text-red-400 dark:bg-red-500/20 dark:text-red-400">
                            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse mr-1"></div>
                            Live
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-xs text-gray-600 dark:text-gray-400">
                          {speaker.followers} followers
                        </Badge>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600 dark:text-gray-400">Debates</p>
                          <p className="font-semibold text-gray-900 dark:text-white">{speaker.totalDebates}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 dark:text-gray-400">Accuracy</p>
                          <p className="font-semibold text-green-600">{speaker.factCheckScore}%</p>
                        </div>
                        <div>
                          <p className="text-gray-600 dark:text-gray-400">Speak Time</p>
                          <p className="font-semibold text-gray-900 dark:text-white">{speaker.totalSpeakTime}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 dark:text-gray-400">Contradictions</p>
                          <p className="font-semibold text-red-600">{speaker.contradictionRate}%</p>
                        </div>
                      </div>

                      {/* Expertise */}
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Expertise</p>
                        <div className="flex flex-wrap gap-1">
                          {speaker.expertise.map((topic, index) => (
                            <Badge key={index} variant="outline" className="text-xs text-gray-600 dark:text-gray-400">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Star className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="flex items-center gap-1">
                          <Button size="sm" variant="ghost">
                            <Share className="w-4 h-4" />
                          </Button>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Last seen: {speaker.lastSeen}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="top-performers">
            <div className="text-center py-12">
              <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Top performing speakers will be displayed here</p>
            </div>
          </TabsContent>

          <TabsContent value="recent">
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Recently active speakers will be displayed here</p>
            </div>
          </TabsContent>

          <TabsContent value="trending">
            <div className="text-center py-12">
              <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Trending speakers will be displayed here</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  )
}
