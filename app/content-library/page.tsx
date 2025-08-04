"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Filter,
  Upload,
  Play,
  Download,
  Share,
  Video,
  FileAudio,
  FileText,
  Calendar,
  Clock,
  Users,
  Eye,
  MoreHorizontal,
  CloudUpload,
  SaveIcon,
  LoaderIcon,
} from "lucide-react"
import axios from "axios"
import Layout from "@/components/kokonutui/layout"
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
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { FRONTEND_SERVER_URL } from "@/lib/constants"

export default function ContentLibraryPage() {
  const [totalAudio, setTotalAudio] = useState(0)
  const [totalVideo, setTotalVideo] = useState(0)
  const [totalFiles, setTotalFiles] = useState(0)
  const [filesSize, setFilesSize] = useState(0)

  const [uploadData, setUploadData] = useState<{ name: string, description: string, type: string, numberOfSpeaker: string, file: File | null }>({
    name: '',
    description: '',
    type: '',
    numberOfSpeaker: '',
    file: null,
  });

  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<{
    title: string,
    type: string,
    duration: string,
    videoLink: string | null,
    audioLink: string | null,
    size: string,
    date: string,
    views: number,
    speakers: number,
  }[]>([])

  const uploadContent = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', uploadData.name);
    formData.append('description', uploadData.description);
    formData.append('type', uploadData.type);
    formData.append('numberSpeaker', uploadData.numberOfSpeaker);
    if (uploadData.type === "audio") {
      formData.append('audio', uploadData.file!);
    } else {
      formData.append('video', uploadData.file!);
    }
    try {
      setLoading(true);
      const response = await axios.post('/api/media', formData);
      toast.success("Content uploaded successfully");
      console.log(response.data);
      setUploadData({
        name: '',
        description: '',
        type: '',
        numberOfSpeaker: '',
        file: null,
      });
      window.location.reload()
    } catch (error) {
      toast.error("Failed to upload content");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const fetchdata = async () => {
      setContent([])
      try {
        const res = await axios.get('/api/media')
        const dat = res.data as {
          id: string;
          name: string;
          description: string;
          audioLink: string;
          videoLink: string;
          fileSize: string;
          numberSpeaker: string;
          createdAt: string;
        }[]
        setTotalFiles(dat.length)
        console.log(dat)
        dat.map(async (item) => {
          if (item.audioLink !== null && item.audioLink !== "") {
            setTotalAudio((prev) => prev + 1)
          }

          if (item.videoLink !== null && item.videoLink !== "") {
            setTotalVideo((prev) => prev + 1)
          }
        })

        for (let index = 0; index < dat.length; index++) {
          const element = dat[index];

          if (element.audioLink !== null && element.audioLink !== "") {
            const tempFileMetadata = await axios.get(`/api/getinfo?url=${encodeURIComponent(`${FRONTEND_SERVER_URL}/${element.audioLink}`)}`)
            setFilesSize((prev) => prev + (tempFileMetadata.data.fileSize / (1024 ** 2)))
            setContent((prev) => {
              return [...prev, {
                title: element.name,
                type: "audio",
                audioLink: element.audioLink,
                duration: tempFileMetadata.data.duration,
                size: tempFileMetadata.data.fileSize,
                date: element.createdAt,
                views: 1,
                speakers: parseInt(element.numberSpeaker)
              }]
            })
          } else if (element.videoLink !== null && element.videoLink !== "") {
            const tempFileMetadata = await axios.get(`/api/getinfo?url=${encodeURIComponent(`${FRONTEND_SERVER_URL}/${element.videoLink}`)}`)
            setFilesSize((prev) => prev + (tempFileMetadata.data.fileSize / (1024 ** 2)))
            setContent((prev) => {
              return [...prev, {
                title: element.name,
                type: "video",
                videoLink: element.videoLink,
                duration: tempFileMetadata.data.duration,
                size: tempFileMetadata.data.fileSize,
                date: element.createdAt,
                views: 1,
                speakers: parseInt(element.numberSpeaker)
              }]
            })
          }
        }
      } catch (error) {
        console.log(error)
      }
    }

    fetchdata()
  }, [])
  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Content Library</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage your debate recordings and transcripts</p>
          </div>
          <div className="flex items-center gap-3">
            <Dialog>
              <form>
                <DialogTrigger asChild>
                  <button type="button" className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 flex gap-2"> <CloudUpload /> Upload Content</button>
                </DialogTrigger>
                <DialogContent className=" sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Upload Content</DialogTitle>
                    <DialogDescription>
                      Add an interview, podcast, dialogue, or any other format of video or audio to your content library
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4">
                    <div className="grid gap-3">
                      <Label htmlFor="name-1">Name</Label>
                      <Input id="name-1" value={uploadData.name} onChange={(e) => setUploadData({ ...uploadData, name: e.target.value })} name="name" placeholder="Interview with president of ..." />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="description-1">Description</Label>
                      <Textarea id="description-1" value={uploadData.description} onChange={(e) => setUploadData({ ...uploadData, description: e.target.value })} name="description" placeholder="This is presidential interview between president of ..." />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="type-1">Type of file</Label>
                        <Select value={uploadData.type} onValueChange={(value) => setUploadData({ ...uploadData, type: value })}>
                          <SelectTrigger className="">
                            <SelectValue placeholder="Select a type of file" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Audio</SelectLabel>
                              <SelectItem value="audio">Audio</SelectItem>
                              <SelectItem value="video">Video</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="number-of-speaker-1">Number of speaker</Label>
                        <Input type="number" id="number-of-speaker-1" value={uploadData.numberOfSpeaker} onChange={(e) => setUploadData({ ...uploadData, numberOfSpeaker: e.target.value })} name="number-of-speaker" placeholder="1" min={1} />
                      </div>
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="file-1">File</Label>
                      <div className="flex items-center justify-center w-full">
                        <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 vmdark:hover:bg-gray-600">
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
                                strokeWidth="2"
                                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                              />
                            </svg>
                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                            {uploadData.file ? <Badge>{uploadData.file.name}</Badge> : <p className="text-xs text-gray-500 dark:text-gray-400">Audio or Video file</p>}
                          </div>
                          <input id="dropzone-file" type="file" onChange={(e) => setUploadData({ ...uploadData, file: e.target.files![0] })} accept="audio/*,video/*" className="hidden" />
                        </label>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    {loading ? <Button disabled={loading}><LoaderIcon className="mr-2 h-4 w-4 animate-spin" /> Loading...</Button> : <Button onClick={uploadContent}> <SaveIcon className="mr-2 h-4 w-4" /> Save changes </Button>}
                  </DialogFooter>
                </DialogContent>
              </form>
            </Dialog>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search content..."
              className="pl-10 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-0 shadow-sm"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              All Types
            </Button>
            <Button variant="outline" size="sm">
              Recent
            </Button>
            <Button variant="outline" size="sm">
              Favorites
            </Button>
          </div>
        </div>

        {/* Content Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Videos</p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{totalVideo}</p>
                </div>
                <Video className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700 dark:text-green-300">Audio Files</p>
                  <p className="text-2xl font-bold text-green-900 dark:text-green-100">{totalAudio}</p>
                </div>
                <FileAudio className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-700 dark:text-purple-300">All Files </p>
                  <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{totalFiles}</p>
                </div>
                <FileText className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-  between">
                <div>
                  <p className="text-sm font-medium text-orange-700 dark:text-orange-300">Storage Used</p>
                  <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">{filesSize.toFixed(3)} GB</p>
                </div>
                <div className="h-8 w-8 rounded-full mx-4 bg-orange-600 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">78%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-0">
            <TabsTrigger value="all">All Content</TabsTrigger>
            <TabsTrigger value="videos">Videos</TabsTrigger>
            <TabsTrigger value="audio">Audio</TabsTrigger>
            <TabsTrigger value="transcripts">Transcripts</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {content.length > 0 && content.map((item, index) => (
                <Card
                  key={index}
                  className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {item.type === "video" && <Video className="h-5 w-5 text-blue-600" />}
                        {item.type === "audio" && <FileAudio className="h-5 w-5 text-green-600" />}
                        {item.type === "transcript" && <FileText className="h-5 w-5 text-purple-600" />}
                        <Badge variant="outline" className="text-xs">
                          {item.type}
                        </Badge>
                      </div>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>

                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 capitalize line-clamp-2">{item.title}</h3>

                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {parseFloat(item.duration).toFixed(0)} s
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {item.speakers}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDateFR(item.date)}
                        </div>
                      </div>
                      <p className="text-xs">{parseFloat(item.size).toFixed(2)} KB</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => {
                        if (item.type === "video") {
                          window.open(`${FRONTEND_SERVER_URL}/${item.videoLink}`, '_blank');
                        } else if (item.type === "audio") {
                          window.open(`${FRONTEND_SERVER_URL}/${item.audioLink}`, '_blank');
                        }

                      }}  className="text-white bg-gradient-to-r from-cyan-400 via-cyan-500 items-center flex gap-3 w-full to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 shadow-lg shadow-cyan-500/50 dark:shadow-lg dark:shadow-cyan-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"><Play className="h-4 w-4 mr-1" /> Play </button>
                      <Button variant="outline" size="sm">
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="videos">
            <div className="text-center py-12">
              <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Video content will be displayed here</p>
            </div>
          </TabsContent>

          <TabsContent value="audio">
            <div className="text-center py-12">
              <FileAudio className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Audio content will be displayed here</p>
            </div>
          </TabsContent>

          <TabsContent value="transcripts">
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Transcript content will be displayed here</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  )
}


export function formatDateFR(isoString: string): string {
  const date = new Date(isoString);

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'UTC',
  }).format(date);
}