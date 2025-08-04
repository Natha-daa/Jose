import { cn } from "@/lib/utils"
import { User, TrendingUp, AlertTriangle, MessageSquare, ArrowRight } from "lucide-react"
import Image from "next/image"

interface Speaker {
  id: string
  name: string
  role: string
  avatar?: string
  totalDebates: number
  factCheckScore: number
  contradictionRate: number
  lastSeen: string
  trend: "up" | "down" | "stable"
}

interface SpeakerProfilesProps {
  speakers?: Speaker[]
  className?: string
}

const SPEAKERS: Speaker[] = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    role: "Climate Scientist",
    avatar: "https://ferf1mheo22r9ira.public.blob.vercel-storage.com/avatar-01-n0x8HFv8EUetf9z6ht0wScJKoTHqf8.png",
    totalDebates: 23,
    factCheckScore: 92,
    contradictionRate: 3,
    lastSeen: "2 hours ago",
    trend: "up",
  },
  {
    id: "2",
    name: "Senator Mike Davis",
    role: "Politician",
    avatar: "https://ferf1mheo22r9ira.public.blob.vercel-storage.com/avatar-02-albo9B0tWOSLXCVZh9rX9KFxXIVWMr.png",
    totalDebates: 45,
    factCheckScore: 67,
    contradictionRate: 15,
    lastSeen: "Live now",
    trend: "down",
  },
  {
    id: "3",
    name: "Prof. Elena Rodriguez",
    role: "Economist",
    totalDebates: 18,
    factCheckScore: 88,
    contradictionRate: 7,
    lastSeen: "Yesterday",
    trend: "stable",
  },
  {
    id: "4",
    name: "Dr. James Wilson",
    role: "Healthcare Expert",
    totalDebates: 31,
    factCheckScore: 85,
    contradictionRate: 9,
    lastSeen: "3 days ago",
    trend: "up",
  },
]

export default function SpeakerProfiles({ speakers = SPEAKERS, className }: SpeakerProfilesProps) {
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
            Top Speakers
            <span className="text-xs font-normal text-zinc-600 dark:text-zinc-400 ml-1">
              ({speakers.length} tracked)
            </span>
          </h3>
          <span className="text-xs text-zinc-600 dark:text-zinc-400">This Month</span>
        </div>

        <div className="space-y-2">
          {speakers.map((speaker) => (
            <div
              key={speaker.id}
              className={cn(
                "group flex items-center gap-3 p-3 rounded-lg",
                "hover:bg-zinc-100 dark:hover:bg-zinc-800/50",
                "transition-all duration-200 cursor-pointer",
              )}
            >
              <div className="relative">
                {speaker.avatar ? (
                  <Image
                    src={speaker.avatar || "/placeholder.svg"}
                    alt={speaker.name}
                    width={40}
                    height={40}
                    className="rounded-full ring-2 ring-zinc-200 dark:ring-zinc-700"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center">
                    <User className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                  </div>
                )}
                {speaker.lastSeen === "Live now" && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white dark:border-zinc-900" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">{speaker.name}</h4>
                  <div className="flex items-center gap-1">
                    <TrendingUp
                      className={cn("w-3 h-3", {
                        "text-green-500": speaker.trend === "up",
                        "text-red-500": speaker.trend === "down",
                        "text-zinc-400": speaker.trend === "stable",
                      })}
                    />
                  </div>
                </div>

                <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-2">{speaker.role}</p>

                <div className="flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-1 text-zinc-600 dark:text-zinc-400">
                    <MessageSquare className="w-3 h-3" />
                    {speaker.totalDebates} debates
                  </span>
                  <span
                    className={cn("flex items-center gap-1", {
                      "text-green-600 dark:text-green-400": speaker.factCheckScore >= 80,
                      "text-amber-600 dark:text-amber-400": speaker.factCheckScore >= 60 && speaker.factCheckScore < 80,
                      "text-red-600 dark:text-red-400": speaker.factCheckScore < 60,
                    })}
                  >
                    {speaker.factCheckScore}% accuracy
                  </span>
                  <span className="flex items-center gap-1 text-red-600 dark:text-red-400">
                    <AlertTriangle className="w-3 h-3" />
                    {speaker.contradictionRate}% contradictions
                  </span>
                </div>

                <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-1">Last seen: {speaker.lastSeen}</p>
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
          <span>View All Speakers</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
