import React from "react"
import { cn } from "@/lib/utils"
import { Play, Clock, Users, AlertTriangle, CheckCircle, ArrowRight } from "lucide-react"

interface Debate {
  id: string
  title: string
  status: "live" | "processing" | "completed"
  duration: string
  speakers: number
  factChecks: number
  contradictions: number
  timestamp: string
  thumbnail?: string
}

interface DebateListProps {
  debates?: Debate[]
  className?: string
}

const DEBATES: Debate[] = [
  {
    id: "1",
    title: "Presidential Debate 2024",
    status: "live",
    duration: "1h 23m",
    speakers: 3,
    factChecks: 45,
    contradictions: 8,
    timestamp: "Live now",
  },
  {
    id: "2",
    title: "Climate Change Panel",
    status: "processing",
    duration: "2h 15m",
    speakers: 5,
    factChecks: 67,
    contradictions: 12,
    timestamp: "2 hours ago",
  },
  {
    id: "3",
    title: "Economic Policy Discussion",
    status: "completed",
    duration: "1h 45m",
    speakers: 4,
    factChecks: 34,
    contradictions: 5,
    timestamp: "Yesterday",
  },
  {
    id: "4",
    title: "Healthcare Reform Debate",
    status: "completed",
    duration: "1h 30m",
    speakers: 6,
    factChecks: 52,
    contradictions: 9,
    timestamp: "2 days ago",
  },
]

const statusConfig = {
  live: {
    icon: Play,
    class: "text-red-600 dark:text-red-400",
    bg: "bg-red-100 dark:bg-red-900/30",
    label: "Live",
  },
  processing: {
    icon: Clock,
    class: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-100 dark:bg-amber-900/30",
    label: "Processing",
  },
  completed: {
    icon: CheckCircle,
    class: "text-green-600 dark:text-green-400",
    bg: "bg-green-100 dark:bg-green-900/30",
    label: "Completed",
  },
}

export default function DebateList({ debates = DEBATES, className }: DebateListProps) {
  return (
    <div
      className={cn(
        "w-full max-w-xl mx-auto",
        "bg-white dark:bg-zinc-900/70",
        "border border-zinc-100 dark:border-zinc-800",
        "rounded-xl shadow-sm backdrop-blur-xl",
        className,
      )}
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Recent Analysis
            <span className="text-xs font-normal text-zinc-600 dark:text-zinc-400 ml-1">
              ({debates.length} debates)
            </span>
          </h3>
          <span className="text-xs text-zinc-600 dark:text-zinc-400">This Week</span>
        </div>

        <div className="space-y-2">
          {debates.map((debate) => (
            <div
              key={debate.id}
              className={cn(
                "group flex items-center gap-3 p-3 rounded-lg",
                "hover:bg-zinc-100 dark:hover:bg-zinc-800/50",
                "transition-all duration-200 cursor-pointer",
              )}
            >
              <div className={cn("p-2 rounded-lg", statusConfig[debate.status].bg)}>
                {React.createElement(statusConfig[debate.status].icon, {
                  className: cn("w-4 h-4", statusConfig[debate.status].class),
                })}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">{debate.title}</h4>
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded-full text-xs font-medium",
                      statusConfig[debate.status].bg,
                      statusConfig[debate.status].class,
                    )}
                  >
                    {statusConfig[debate.status].label}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs text-zinc-600 dark:text-zinc-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {debate.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {debate.speakers}
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    {debate.factChecks}
                  </span>
                  <span className="flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    {debate.contradictions}
                  </span>
                </div>

                <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-1">{debate.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-2 border-t border-zinc-100 dark:border-zinc-800">
        <button
          type="button"
          className={cn(
            "w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg",
            "text-xs font-medium bg-zinc-900 dark:bg-zinc-50",
            "text-zinc-50 dark:text-zinc-900",
            "hover:bg-zinc-800 dark:hover:bg-zinc-200",
            "transition-all duration-200",
          )}
        >
          <span>View All Debates</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
