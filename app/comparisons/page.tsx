"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  GitCompare,
  Users,
  BarChart3,
  TrendingUp,
  TrendingDown,
  MessageSquare,
  Target,
  Plus,
  Eye,
  Share,
} from "lucide-react"
import Layout from "@/components/kokonutui/layout"

export default function ComparisonsPage() {
  const [comparisonType, setComparisonType] = useState("speakers")
  const [timeRange, setTimeRange] = useState("30d")

  const speakerComparisons = [
    {
      id: 1,
      speaker1: {
        name: "Dr. Sarah Johnson",
        role: "Climate Scientist",
        accuracy: 94.2,
        contradictions: 3,
        speakingTime: "45m 23s",
        topics: ["Climate Change", "Environmental Policy"],
      },
      speaker2: {
        name: "Senator Mike Davis",
        role: "Politician",
        accuracy: 67.8,
        contradictions: 15,
        speakingTime: "52m 12s",
        topics: ["Economic Policy", "Healthcare"],
      },
      comparisonDate: "2024-01-15",
      debate: "Climate Policy Forum",
      winner: "speaker1",
    },
    {
      id: 2,
      speaker1: {
        name: "Prof. Elena Rodriguez",
        role: "Economist",
        accuracy: 88.5,
        contradictions: 7,
        speakingTime: "38m 45s",
        topics: ["Economic Theory", "Market Analysis"],
      },
      speaker2: {
        name: "Dr. James Wilson",
        role: "Healthcare Expert",
        accuracy: 85.3,
        contradictions: 9,
        speakingTime: "41m 18s",
        topics: ["Healthcare Policy", "Public Health"],
      },
      comparisonDate: "2024-01-12",
      debate: "Healthcare Reform Debate",
      winner: "speaker1",
    },
  ]

  const debateComparisons = [
    {
      id: 1,
      debate1: {
        title: "Presidential Debate 2024 - Round 1",
        date: "2024-01-15",
        duration: "1h 23m",
        speakers: 3,
        factChecks: 45,
        contradictions: 8,
        accuracy: 87.2,
      },
      debate2: {
        title: "Presidential Debate 2024 - Round 2",
        date: "2024-01-22",
        duration: "1h 31m",
        speakers: 3,
        factChecks: 52,
        contradictions: 12,
        accuracy: 82.1,
      },
      category: "Presidential",
      trend: "declining",
    },
  ]

  const topicComparisons = [
    {
      topic: "Climate Change",
      period1: { mentions: 234, sentiment: 0.72, accuracy: 91.2 },
      period2: { mentions: 189, sentiment: 0.68, accuracy: 89.7 },
      trend: "declining",
      change: "-19%",
    },
    {
      topic: "Healthcare",
      period1: { mentions: 156, sentiment: 0.45, accuracy: 85.3 },
      period2: { mentions: 203, sentiment: 0.58, accuracy: 87.9 },
      trend: "improving",
      change: "+30%",
    },
  ]

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "improving":
        return <TrendingUp className="w-4 h-4 text-green-600" />
      case "declining":
        return <TrendingDown className="w-4 h-4 text-red-600" />
      default:
        return <div className="w-4 h-4" />
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "improving":
        return "text-green-600"
      case "declining":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Comparisons</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Compare speakers, debates, and topics across different dimensions
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>

            <Button className="flex items-center gap-2" size="sm">
              <Plus className="w-4 h-4" />
              New Comparison
            </Button>
          </div>
        </div>

        {/* Comparison Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Speaker Comparisons</p>
                  <p className="text-xl font-bold">23</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Debate Comparisons</p>
                  <p className="text-xl font-bold">12</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Topic Comparisons</p>
                  <p className="text-xl font-bold">8</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Trend Analysis</p>
                  <p className="text-xl font-bold">156</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Comparison Tabs */}
        <Tabs defaultValue="speakers" className="space-y-4">
          <TabsList>
            <TabsTrigger value="speakers">Speaker vs Speaker</TabsTrigger>
            <TabsTrigger value="debates">Debate vs Debate</TabsTrigger>
            <TabsTrigger value="topics">Topic Trends</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="speakers" className="space-y-4">
            {speakerComparisons.map((comparison) => (
              <Card key={comparison.id} className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GitCompare className="w-5 h-5" />
                      Speaker Comparison
                    </div>
                    <Badge variant="outline">{comparison.debate}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Speaker 1 */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{comparison.speaker1.name}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{comparison.speaker1.role}</p>
                        </div>
                        {comparison.winner === "speaker1" && (
                          <Badge className="bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400">
                            Winner
                          </Badge>
                        )}
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Accuracy Rate</span>
                          <span className="font-medium text-green-600">{comparison.speaker1.accuracy}%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Contradictions</span>
                          <span className="font-medium text-red-600">{comparison.speaker1.contradictions}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Speaking Time</span>
                          <span className="font-medium">{comparison.speaker1.speakingTime}</span>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Key Topics</p>
                        <div className="flex flex-wrap gap-1">
                          {comparison.speaker1.topics.map((topic, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* VS Divider */}
                    <div className="hidden md:flex items-center justify-center">
                      <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-gray-600 dark:text-gray-400">VS</span>
                      </div>
                    </div>

                    {/* Speaker 2 */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{comparison.speaker2.name}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{comparison.speaker2.role}</p>
                        </div>
                        {comparison.winner === "speaker2" && (
                          <Badge className="bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400">
                            Winner
                          </Badge>
                        )}
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Accuracy Rate</span>
                          <span className="font-medium text-green-600">{comparison.speaker2.accuracy}%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Contradictions</span>
                          <span className="font-medium text-red-600">{comparison.speaker2.contradictions}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Speaking Time</span>
                          <span className="font-medium">{comparison.speaker2.speakingTime}</span>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Key Topics</p>
                        <div className="flex flex-wrap gap-1">
                          {comparison.speaker2.topics.map((topic, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-sm text-gray-600 dark:text-gray-400">{comparison.comparisonDate}</div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="w-3 h-3 mr-1" />
                        View Details
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Share className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="debates" className="space-y-4">
            {debateComparisons.map((comparison) => (
              <Card key={comparison.id} className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5" />
                      Debate Comparison
                    </div>
                    <div className="flex items-center gap-2">
                      {getTrendIcon(comparison.trend)}
                      <Badge variant="outline">{comparison.category}</Badge>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Debate 1 */}
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold mb-1">{comparison.debate1.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{comparison.debate1.date}</p>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Duration</span>
                          <span className="font-medium">{comparison.debate1.duration}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Speakers</span>
                          <span className="font-medium">{comparison.debate1.speakers}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Fact Checks</span>
                          <span className="font-medium text-green-600">{comparison.debate1.factChecks}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Contradictions</span>
                          <span className="font-medium text-red-600">{comparison.debate1.contradictions}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Overall Accuracy</span>
                          <span className="font-medium">{comparison.debate1.accuracy}%</span>
                        </div>
                      </div>
                    </div>

                    {/* VS Divider */}
                    <div className="hidden md:flex items-center justify-center">
                      <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-gray-600 dark:text-gray-400">VS</span>
                      </div>
                    </div>

                    {/* Debate 2 */}
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold mb-1">{comparison.debate2.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{comparison.debate2.date}</p>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Duration</span>
                          <span className="font-medium">{comparison.debate2.duration}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Speakers</span>
                          <span className="font-medium">{comparison.debate2.speakers}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Fact Checks</span>
                          <span className="font-medium text-green-600">{comparison.debate2.factChecks}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Contradictions</span>
                          <span className="font-medium text-red-600">{comparison.debate2.contradictions}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Overall Accuracy</span>
                          <span className="font-medium">{comparison.debate2.accuracy}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="topics" className="space-y-4">
            {topicComparisons.map((comparison, index) => (
              <Card key={index} className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    {comparison.topic} Trend Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold">Previous Period</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Mentions</span>
                          <span className="font-medium">{comparison.period1.mentions}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Sentiment Score</span>
                          <span className="font-medium">{comparison.period1.sentiment.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Accuracy Rate</span>
                          <span className="font-medium">{comparison.period1.accuracy}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold">Current Period</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Mentions</span>
                          <span className="font-medium">{comparison.period2.mentions}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Sentiment Score</span>
                          <span className="font-medium">{comparison.period2.sentiment.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Accuracy Rate</span>
                          <span className="font-medium">{comparison.period2.accuracy}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="performance">
            <div className="text-center py-12">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Performance comparisons will be displayed here</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  )
}
