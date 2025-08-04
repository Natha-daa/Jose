import { Video, Users, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react"
import DebateList from "./debate-list"
import SpeakerProfiles from "./speaker-profiles"
import AnalysisInsights from "./analysis-insights"

export default function VerbaLensContent() {
  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#0F0F12] rounded-xl p-6 border border-gray-200 dark:border-[#1F1F23]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active Debates</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">12</p>
            </div>
            <Video className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
        </div>

        <div className="bg-white dark:bg-[#0F0F12] rounded-xl p-6 border border-gray-200 dark:border-[#1F1F23]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Speakers Tracked</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">847</p>
            </div>
            <Users className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
        </div>

        <div className="bg-white dark:bg-[#0F0F12] rounded-xl p-6 border border-gray-200 dark:border-[#1F1F23]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Fact Checks</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">1,234</p>
            </div>
            <CheckCircle className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          </div>
        </div>

        <div className="bg-white dark:bg-[#0F0F12] rounded-xl p-6 border border-gray-200 dark:border-[#1F1F23]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Contradictions</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">89</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-[#0F0F12] rounded-xl p-6 flex flex-col border border-gray-200 dark:border-[#1F1F23]">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 text-left flex items-center gap-2">
            <Video className="w-4 h-4 text-zinc-900 dark:text-zinc-50" />
            Recent Debates
          </h2>
          <div className="flex-1">
            <DebateList className="h-full" />
          </div>
        </div>

        <div className="bg-white dark:bg-[#0F0F12] rounded-xl p-6 flex flex-col border border-gray-200 dark:border-[#1F1F23]">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 text-left flex items-center gap-2">
            <Users className="w-4 h-4 text-zinc-900 dark:text-zinc-50" />
            Speaker Profiles
          </h2>
          <div className="flex-1">
            <SpeakerProfiles className="h-full" />
          </div>
        </div>
      </div>

      {/* Analysis Insights */}
      <div className="bg-white dark:bg-[#0F0F12] rounded-xl p-6 flex flex-col items-start justify-start border border-gray-200 dark:border-[#1F1F23]">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 text-left flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-zinc-900 dark:text-zinc-50" />
          Analysis Insights
        </h2>
        <AnalysisInsights />
      </div>
    </div>
  )
}
