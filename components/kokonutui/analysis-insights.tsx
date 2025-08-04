import { cn } from "@/lib/utils"
import { BarChart3, TrendingUp, AlertTriangle, CheckCircle, Users, Clock, ArrowRight } from "lucide-react"

interface Insight {
  id: string
  title: string
  description: string
  value: string
  change: string
  trend: "up" | "down" | "stable"
  category: "accuracy" | "engagement" | "contradictions" | "speakers"
  priority: "high" | "medium" | "low"
}

interface AnalysisInsightsProps {
  insights?: Insight[]
  className?: string
}

const INSIGHTS: Insight[] = [
  {
    id: "1",
    title: "Fact-Check Accuracy Improved",
    description: "Overall accuracy rate increased across all debates this week",
    value: "87%",
    change: "+5.2%",
    trend: "up",
    category: "accuracy",
    priority: "high",
  },
  {
    id: "2",
    title: "Speaker Contradiction Rate",
    description: "Notable increase in contradictory statements during political debates",
    value: "23%",
    change: "+8.1%",
    trend: "up",
    category: "contradictions",
    priority: "high",
  },
  {
    id: "3",
    title: "New Speaker Profiles",
    description: "AI identified and catalogued new speakers this month",
    value: "47",
    change: "+12",
    trend: "up",
    category: "speakers",
    priority: "medium",
  },
  {
    id: "4",
    title: "Average Debate Duration",
    description: "Debates are running longer with more detailed discussions",
    value: "2h 15m",
    change: "+18m",
    trend: "up",
    category: "engagement",
    priority: "low",
  },
  {
    id: "5",
    title: "Real-time Processing Speed",
    description: "Improved AI processing latency for live debate analysis",
    value: "1.2s",
    change: "-0.8s",
    trend: "down",
    category: "accuracy",
    priority: "medium",
  },
]

const categoryIcons = {
  accuracy: CheckCircle,
  engagement: BarChart3,
  contradictions: AlertTriangle,
  speakers: Users,
}

const categoryColors = {
  accuracy: "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30",
  engagement: "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30",
  contradictions: "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30",
  speakers: "text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30",
}

const priorityColors = {
  high: "border-l-red-500",
  medium: "border-l-amber-500",
  low: "border-l-green-500",
}

export default function AnalysisInsights({ insights = INSIGHTS, className }: AnalysisInsightsProps) {
  return (
    <div className={cn("w-full overflow-x-auto scrollbar-none", className)}>
      <div className="flex gap-4 min-w-full p-1">
        {insights.map((insight) => {
          const IconComponent = categoryIcons[insight.category]
          return (
            <div
              key={insight.id}
              className={cn(
                "flex flex-col w-[320px] shrink-0",
                "bg-white dark:bg-zinc-900/70 rounded-xl",
                "border border-zinc-100 dark:border-zinc-800",
                "border-l-4",
                priorityColors[insight.priority],
                "hover:border-zinc-200 dark:hover:border-zinc-700",
                "transition-all duration-200 shadow-sm backdrop-blur-xl",
              )}
            >
              <div className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className={cn("p-2 rounded-lg", categoryColors[insight.category])}>
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{insight.value}</div>
                    <div
                      className={cn("text-sm font-medium flex items-center gap-1", {
                        "text-green-600 dark:text-green-400":
                          insight.trend === "up" && insight.category !== "contradictions",
                        "text-red-600 dark:text-red-400":
                          insight.trend === "up" && insight.category === "contradictions",
                        "text-green-600 dark:text-green-400":
                          insight.trend === "down" && insight.category === "contradictions",
                        "text-red-600 dark:text-red-400":
                          insight.trend === "down" && insight.category !== "contradictions",
                        "text-zinc-600 dark:text-zinc-400": insight.trend === "stable",
                      })}
                    >
                      <TrendingUp
                        className={cn("w-3 h-3", {
                          "rotate-180": insight.trend === "down",
                        })}
                      />
                      {insight.change}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-1">{insight.title}</h3>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2">{insight.description}</p>
                </div>

                <div className="flex items-center justify-between">
                  <span
                    className={cn("px-2 py-1 rounded-full text-xs font-medium capitalize", {
                      "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400": insight.priority === "high",
                      "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400":
                        insight.priority === "medium",
                      "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400":
                        insight.priority === "low",
                    })}
                  >
                    {insight.priority} priority
                  </span>
                  <span className="text-xs text-zinc-500 dark:text-zinc-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Updated 2h ago
                  </span>
                </div>
              </div>

              <div className="mt-auto border-t border-zinc-100 dark:border-zinc-800">
                <button
                  className={cn(
                    "w-full flex items-center justify-center gap-2 py-2.5 px-3",
                    "text-xs font-medium text-zinc-600 dark:text-zinc-400",
                    "hover:text-zinc-900 dark:hover:text-zinc-100",
                    "hover:bg-zinc-100 dark:hover:bg-zinc-800/50",
                    "transition-colors duration-200",
                  )}
                >
                  View Details
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
