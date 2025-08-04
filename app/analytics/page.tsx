"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart3,
  TrendingUp,
  Users,
  Clock,
  Download,
  Filter,
  Calendar,
  Eye,
  MessageSquare,
  Target,
} from "lucide-react"
import Layout from "@/components/kokonutui/layout"

export default function AnalyticsPage() {
  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h1>
            <p className="text-gray-600 dark:text-gray-400">Comprehensive debate analysis and insights</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              Date Range
            </Button>
            <Button size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Debates</CardTitle>
              <BarChart3 className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">156</div>
              <p className="text-xs text-blue-600 dark:text-blue-400">+23% from last month</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">Avg. Accuracy</CardTitle>
              <Target className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900 dark:text-green-100">94.2%</div>
              <p className="text-xs text-green-600 dark:text-green-400">+2.1% improvement</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">Total Hours</CardTitle>
              <Clock className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">2,847</div>
              <p className="text-xs text-purple-600 dark:text-purple-400">Analysis time logged</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">Active Users</CardTitle>
              <Users className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">89</div>
              <p className="text-xs text-orange-600 dark:text-orange-400">Currently online</p>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-0">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="speakers">Speakers</TabsTrigger>
            <TabsTrigger value="topics">Topics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    Debate Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { topic: "Climate Change", count: 45, trend: "+12%" },
                      { topic: "Healthcare", count: 38, trend: "+8%" },
                      { topic: "Economy", count: 32, trend: "-3%" },
                      { topic: "Education", count: 28, trend: "+15%" },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{item.topic}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{item.count} debates</p>
                        </div>
                        <Badge variant={item.trend.startsWith("+") ? "default" : "secondary"}>{item.trend}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5 text-green-600" />
                    Engagement Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Average View Time</span>
                      <span className="text-gray-900 dark:text-white">45:32</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Completion Rate</span>
                      <span className="text-gray-900 dark:text-white">68%</span>
                    </div>
                    <Progress value={68} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Interaction Rate</span>
                      <span className="text-gray-900 dark:text-white">82%</span>
                    </div>
                    <Progress value={82} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle>System Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">99.9%</div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Uptime</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">1.2s</div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Avg Response</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">94.2%</div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Accuracy</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="speakers" className="space-y-6">
            <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  Top Speakers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Dr. Sarah Johnson", debates: 23, accuracy: "96.5%", specialty: "Climate Science" },
                    { name: "Prof. Michael Chen", debates: 19, accuracy: "94.2%", specialty: "Economics" },
                    { name: "Dr. Emily Rodriguez", debates: 17, accuracy: "95.8%", specialty: "Healthcare" },
                    { name: "James Wilson", debates: 15, accuracy: "93.1%", specialty: "Technology" },
                  ].map((speaker, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-50/50 dark:bg-gray-700/50 rounded-lg border-0"
                    >
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{speaker.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{speaker.specialty}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{speaker.debates} debates</p>
                        <p className="text-sm text-green-600 dark:text-green-400">{speaker.accuracy} accuracy</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="topics" className="space-y-6">
            <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-purple-600" />
                  Popular Topics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { topic: "Climate Change", debates: 45, engagement: 89 },
                    { topic: "Healthcare Reform", debates: 38, engagement: 76 },
                    { topic: "Economic Policy", debates: 32, engagement: 82 },
                    { topic: "Education System", debates: 28, engagement: 71 },
                    { topic: "Technology Ethics", debates: 24, engagement: 94 },
                    { topic: "Social Justice", debates: 21, engagement: 87 },
                  ].map((item, index) => (
                    <div key={index} className="p-4 bg-gray-50/50 dark:bg-gray-700/50 rounded-lg border-0">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-gray-900 dark:text-white">{item.topic}</h3>
                        <Badge variant="outline">{item.debates}</Badge>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Engagement</span>
                          <span className="text-gray-900 dark:text-white">{item.engagement}%</span>
                        </div>
                        <Progress value={item.engagement} className="h-1" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  )
}
