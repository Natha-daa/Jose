"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import axios from "axios"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Mic,
  UserPlus,
  Users,
  Settings,
  Upload,
  Download,
  Search,
  CheckCircle,
  AlertTriangle,
  User,
  Volume2,
  VolumeX,
  Trash2,
  Edit3,
  Loader2,
} from "lucide-react"
import Image from "next/image"
import Layout from "@/components/kokonutui/layout"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { toast } from "sonner"
import { BACKEND_SERVER_URL } from "@/lib/constants"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"


export default function VoiceRecognitionPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()
  const [editingProfile, setEditingProfile] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [totalProfiles, setTotalProfiles] = useState(0)
  const [speakerName, setSpeakerName]=useState("")
  const [voiceFile, setVoiceFile]=useState<File | null>(null)
  const [pendingProfiles, setPendingProfiles] = useState(0)
  const [audioSamples, setAudioSamples] = useState(0)
  const [voiceProfiles, setVoiceProfiles] = useState<{ id: number, name: string, avatar: string, enrollments: number, accuracy: number, lastUsed: string, status: string, audioSamples: number, enrollmentDate: string }[]>([])

  const listAvatars = ["https://ferf1mheo22r9ira.public.blob.vercel-storage.com/avatar-01-n0x8HFv8EUetf9z6ht0wScJKoTHqf8.png", "https://ferf1mheo22r9ira.public.blob.vercel-storage.com/avatar-02-albo9B0tWOSLXCVZh9rX9KFxXIVWMr.png",
    "https://avatar.iran.liara.run/public/boy"
  ]

  const handleEditProfile = (profileId: number, newName: string) => {
    setVoiceProfiles((prevProfiles) =>
      prevProfiles.map((profile) => (profile.id === profileId ? { ...profile, name: newName } : profile)),
    )
    setEditingProfile(null)
  }

  const getProfile = async () => {
    try {
      setLoading(true)
      setVoiceProfiles([])
      const response = await axios.get(`${BACKEND_SERVER_URL}/all-speakers-voice`)
      const data = response.data as { id: number, speaker_name: string, avatar: string, enrollments: number, accuracy: number, lastUsed: string, status: string, audioSamples: number, enrollmentDate: string }[]
      setAudioSamples(data.length)
      setTotalProfiles(data.length)
      setLoading(false)
      data.map((profile) => {
        if (!voiceProfiles.find((p) => p.name === profile.speaker_name)) {
          setVoiceProfiles((prevProfiles) => [...prevProfiles, { id: profile.id, name: profile.speaker_name, avatar: listAvatars[profile.id % listAvatars.length], enrollments: 1, accuracy: parseFloat((Math.random() * (88 - 70) + 70).toFixed(2)), lastUsed: "--//--", status: "inactive", audioSamples: 12, enrollmentDate: "2025-07-29" }])
        }
      })
    } catch (error) {
      toast.error("Failed to fetch profiles")
      setLoading(false)
    }
  }

  function getAvgAccuracy() {
    let total = 0
    voiceProfiles.map((profile) => total += profile.accuracy)
    return (total / voiceProfiles.length).toFixed(0)
  }

  async function enrollVoice() {
    console.log("speakerName", speakerName)
    console.log("voiceFile", voiceFile)
    try {
      setLoading(true)
      const formData = new FormData()
      formData.append("speaker_name", speakerName)
      formData.append("file", voiceFile!)

      const response = await axios.post(`${BACKEND_SERVER_URL}/add-speaker-voice`, formData)

      const data = response.data as { message: string }
      setLoading(false)
      toast.success(data.message)
      toast.success(`${speakerName} Voice enrolled successfully`)
      window.location.reload()
    } catch (error) {
      toast.error("Failed to enroll voice")
      setLoading(false)
    }
  }

  useEffect(() => {
    getProfile()
  }, [totalProfiles])

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Voice Recognition</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage and train speaker voice profiles</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => router.push("/settings")} className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800">
              <span className="relative flex items-center px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                <Settings className="h-4 w-4 mr-2" /> Settings
              </span>
            </button>
            <Dialog>
              <DialogTrigger asChild>
                <button type="button" className="text-white items-center bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 flex"> <UserPlus className="h-4 w-4 mr-2" /> Enroll New Voice</button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Enroll New Voice</DialogTitle>
                  <DialogDescription>
                    Add a new voice to the system. Please provide the name of the speaker and an audio file.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4">
                  <div className="grid gap-3">
                    <Label htmlFor="name-1">Name</Label>
                    <Input onChange={(e) => setSpeakerName(e.target.value)} name="speaker name" defaultValue="" />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="audio-file-1">Audio File</Label>

                    <div className="flex items-center justify-center w-full">
                      <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg
                            className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 20 16"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                            />
                          </svg>
                          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                        
                          {voiceFile ? <span className="bg-blue-100 my-3 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">{voiceFile.name}</span> :   <p className="text-xs text-gray-500 dark:text-gray-400">.wav, .mp3 (MAX. 30 secondes)</p>}
                        </div>
                        <input id="dropzone-file" onChange={(e) => setVoiceFile(e.target.files![0])} type="file" className="hidden" />
                      </label>
                    </div>

                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline" >Discard</Button>
                  </DialogClose>
                 {loading ? <Button disabled> <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading...</Button> : <Button onClick={enrollVoice}>Save</Button>}
                </DialogFooter>
              </DialogContent>

            </Dialog>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Profiles</p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{totalProfiles}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700 dark:text-green-300">Avg. Accuracy</p>
                  <p className="text-2xl font-bold text-green-900 dark:text-green-100">{getAvgAccuracy()}%</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-700 dark:text-orange-300">Pending Enrollments</p>
                  <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">{pendingProfiles}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Audio Samples</p>
                  <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{audioSamples}</p>
                </div>
                <Mic className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search voice profiles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-0 shadow-sm"
            />
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Status
            </Button>
            <Button variant="outline" size="sm">
              Last Used
            </Button>
            <Button variant="outline" size="sm">
              Accuracy
            </Button>
          </div>
        </div>

        {/* Voice Profiles List */}
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-0">
            <TabsTrigger value="all">All Profiles</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="inactive">Inactive</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchQuery !== "" ? voiceProfiles.filter((profile) => profile.name.toLowerCase().includes(searchQuery.toLowerCase())).map((profile) => (
                <Card
                key={`unfiltered ${profile.id}`}
                  className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {profile.avatar ? (
                          <Image
                            src={profile.avatar || "/placeholder.svg"}
                            alt={profile.name}
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
                          {editingProfile === profile.id ? (
                            <Input
                              defaultValue={profile.name}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  handleEditProfile(profile.id, e.currentTarget.value)
                                }
                                if (e.key === "Escape") {
                                  setEditingProfile(null)
                                }
                              }}
                              className="h-8 text-base font-semibold"
                            />
                          ) : (
                            <h3 className="font-semibold text-gray-900 dark:text-white">{profile.name}</h3>
                          )}
                          <p className="text-sm text-gray-600 dark:text-gray-400">Voice Profile</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        {profile.status === "active" && (
                          <Badge className="bg-green-500/20 text-green-400 dark:bg-green-500/20 dark:text-green-400">
                            Active
                          </Badge>
                        )}
                        {profile.status === "inactive" && (
                          <Badge variant="secondary" className="text-gray-600 dark:text-gray-400">
                            Inactive
                          </Badge>
                        )}
                        <Button variant="ghost" size="sm" onClick={() => setEditingProfile(profile.id)}>
                          <Edit3 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400 mb-4">
                      <div className="flex justify-between items-center">
                        <span>Enrollments</span>
                        <span className="font-medium text-gray-900 dark:text-white">{profile.enrollments}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Accuracy</span>
                        <span className="font-medium text-green-600">{profile.accuracy}%</span>
                      </div>
                      <Progress value={profile.accuracy} className="h-2" />
                      <div className="flex justify-between items-center">
                        <span>Last Used</span>
                        <span className="font-medium text-gray-900 dark:text-white">{profile.lastUsed}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" onClick={() => toast.info("Add Samples as soon as possible")}>
                          <Upload className="w-4 h-4 mr-1" />
                          Add Samples
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="ghost">
                          <Volume2 className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )) : voiceProfiles.map((profile,index) => (
                <Card
                  key={`filtered ${profile.id} + ${index}`}
                  className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {profile.avatar ? (
                          <Image
                            src={profile.avatar || "/placeholder.svg"}
                            alt={profile.name}
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
                          {editingProfile === profile.id ? (
                            <Input
                              defaultValue={profile.name}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  handleEditProfile(profile.id, e.currentTarget.value)
                                }
                                if (e.key === "Escape") {
                                  setEditingProfile(null)
                                }
                              }}
                              className="h-8 text-base font-semibold"
                            />
                          ) : (
                            <h3 className="font-semibold text-gray-900 dark:text-white">{profile.name}</h3>
                          )}
                          <p className="text-sm text-gray-600 dark:text-gray-400">Voice Profile</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        {profile.status === "active" && (
                          <Badge className="bg-green-500/20 text-green-400 dark:bg-green-500/20 dark:text-green-400">
                            Active
                          </Badge>
                        )}
                        {profile.status === "inactive" && (
                          <Badge variant="secondary" className="text-gray-600 dark:text-gray-400">
                            Inactive
                          </Badge>
                        )}
                        <Button variant="ghost" size="sm" onClick={() => setEditingProfile(profile.id)}>
                          <Edit3 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400 mb-4">
                      <div className="flex justify-between items-center">
                        <span>Enrollments</span>
                        <span className="font-medium text-gray-900 dark:text-white">{profile.enrollments}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Accuracy</span>
                        <span className="font-medium text-green-600">{profile.accuracy}%</span>
                      </div>
                      <Progress value={profile.accuracy} className="h-2" />
                      <div className="flex justify-between items-center">
                        <span>Last Used</span>
                        <span className="font-medium text-gray-900 dark:text-white">{profile.lastUsed}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">
                          <Upload className="w-4 h-4 mr-1" />
                          Add Samples
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="ghost">
                          <Volume2 className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="active">
            <div className="text-center py-12">
              <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Active voice profiles will be displayed here</p>
            </div>
          </TabsContent>

          <TabsContent value="inactive">
            <div className="text-center py-12">
              <VolumeX className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Inactive voice profiles will be displayed here</p>
            </div>
          </TabsContent>

          <TabsContent value="pending">
            <div className="text-center py-12">
              <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Pending voice enrollments will be displayed here</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  )
}
