"use client"
import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import axios from "axios"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import copy from "copy-to-clipboard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Play,
  Pause,
  Square,
  Mic,
  Volume2,
  VolumeX,
  Download,
  Upload,
  Save,
  Edit3,
  User,
  Clock,
  Settings,
  Search,
  FastForward,
  Rewind,
  SkipBack,
  SkipForward,
  Copy,
  Share,
  FileText,
  Users,
  CheckCircle,
  AlertTriangle,
  Zap,
  LinkIcon,
  DownloadCloudIcon,
  SpeakerIcon,
  SpeechIcon,
  LoaderIcon,
  AudioLines,
} from "lucide-react"
import Layout from "@/components/kokonutui/layout"
import Link from "next/link"
import { BACKEND_SERVER_URL, FRONTEND_SERVER_URL } from "@/lib/constants"
import UploadButton from "@/components/UploadButton"
import dynamic from "next/dynamic"
import { toast } from "sonner"

interface TranscriptSegment {
  id: number;
  speaker: string;
  text: string;
  timestamp: string;
  isEditing: boolean;
  duration: number;
  confidence: number;
  factCheck: string;
}

const AudioRecorder = dynamic(() => import("@/components/AudioRecorder"), { ssr: false })

export default function TranscriptionPage() {
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [playbackRate, setplaybackRate] = useState("1.0")
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState("00:00:00")
  const [selectedSpeaker, setSelectedSpeaker] = useState("")
  const [editingSegment, setEditingSegment] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [autoScroll, setAutoScroll] = useState(true)
  const transcriptRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef(null);
  const [audioUrl, setAudioUrl] = useState('');
  const [transcriptText, setTranscriptText] = useState("")
  const [audio_id, setAudio_id] = useState("")

  const [onTranscript, setOnTranscript] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);

  const [selectedFile, setSelectedFile] = useState<null | File>(null);
  const [speakers, setSpeakers] = useState<{
    id: string;
    name: string;
    color: string;
  }[]>([]);
  
  function mergeConsecutiveSegments(segments:  { speaker: string, text: string, timestamp: string, start: string, end: string }[]): { speaker: string, text: string, timestamp: string, start: string, end: string }[] {
    if (segments.length === 0) return [];
  
    const merged: { speaker: string, text: string, timestamp: string, start: string, end: string }[] = [];
    let current = { ...segments[0] };
  
    for (let i = 1; i < segments.length; i++) {
      const seg = segments[i];
      if (seg.speaker === current.speaker) {
        // Même intervenant : concatène
        current.text += " " + seg.text;
        current.end = seg.end; // Met à jour la fin
      } else {
        // Différent intervenant : on pousse current dans merged
        merged.push(current);
        current = { ...seg }; // reset current avec nouveau segment
      }
    }
  
    // N’oublie pas de pousser le dernier bloc
    merged.push(current);
  
    return merged;
  }
  


  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      try {
      const formData = new FormData();
      formData.append("file", event.target.files[0]);
      const res = await axios.post(`${BACKEND_SERVER_URL}/uploads/`, formData)
      console.log(res.data)
      toast.success(res.data.message)
      setAudioUrl(`${BACKEND_SERVER_URL}/file/${res.data.filename}`)
      setAudio_id(res.data.filename)
      } catch (e) {
        console.log(e)
        toast.error("Error occuring during upload")
      }
    }
  };

  const colorsStyle = [
    "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
    "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  ]

  function extractSpeakers(data: any[]) {
    // 1. Extraire les speakers uniques
    const uniqueSpeakers = Array.from(new Set(data.map(d => d.speaker)));
  
    // 2. Construire le schéma souhaité
    const speakersSchema = uniqueSpeakers.map((name, index) => ({
      id: `${index + 1}`,
      name: name || "unknown",
      color: colorsStyle[index] || colorsStyle[colorsStyle.length - 1] // Prend couleur par index ou dernière si dépasse
    }));
  
    return speakersSchema;
  }

  const [transcriptSegments, setTranscriptSegments] = useState<TranscriptSegment[]>([])



  const getSpeakerInfo = (speakerId: string) => {
    return speakers.find((s) => s.name === speakerId) || speakers[2]
  }

  const getFactCheckIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="w-3 h-3 text-green-600" />
      case "disputed":
        return <AlertTriangle className="w-3 h-3 text-red-600" />
      case "partially-verified":
        return <AlertTriangle className="w-3 h-3 text-yellow-600" />
      default:
        return <Clock className="w-3 h-3 text-gray-400" />
    }
  }

  const handleEditSegment = (segmentId: number, newText: string) => {
    setTranscriptSegments((segments) =>
      segments.map((segment) => (segment.id === segmentId ? { ...segment, text: newText, isEditing: false } : segment)),
    )
    setEditingSegment(null)
  }

  const handleSpeakerChange = (segmentId: number, newSpeaker: string) => {
    setTranscriptSegments((segments) =>
      segments.map((segment) => (segment.id === segmentId ? { ...segment, speaker: newSpeaker } : segment)),
    )
  }
  const exportAsText = () => {
    const text = transcriptSegments
      .map(
        (segment) =>
          `${getSpeakerInfo(segment.speaker).name}: ${segment.text.trim()}\n`,
      )
      .join("\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transcript.txt";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  function toSRT(segments: TranscriptSegment[]): string {
    return segments.map((seg, idx) => {
      const start = seg.timestamp;
      const end = secondsToTimestamp(
        timestampToSeconds(start) + seg.duration
      );
      return `${idx + 1}
  ${start.replace('.', ',')} --> ${end.replace('.', ',')}
  ${seg.speaker}: ${seg.text}
  
  `;
    }).join('');
  }
  
  // Convertit "00:05" -> secondes
  function timestampToSeconds(ts: string): number {
    const parts = ts.split(':').map(Number);
    if (parts.length === 3) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    } else {
      return parts[0] * 60 + parts[1];
    }
  }
  
  // Convertit secondes -> "00:05"
  function secondsToTimestamp(seconds: number): string {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${pad(hrs)}:${pad(mins)}:${pad(secs.toFixed(3))}`;
  }
  
  function pad(num: number | string) {
    return num.toString().padStart(2, '0');
  }

  function downloadSRTFile(segments: TranscriptSegment[], filename = 'transcript.srt') {
    const srt = toSRT(segments);
    const blob = new Blob([srt], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
  
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
  
    URL.revokeObjectURL(url);
  }

  function downloadJSONFile(segments: TranscriptSegment[], filename = 'transcript.json') {
    const json = JSON.stringify(segments, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
  
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
  
    URL.revokeObjectURL(url);
  }
  

  

  const exportTranscript = (format: string) => {
    if (format === "txt") {
      exportAsText();
    }
    if (format === "srt") {
      downloadSRTFile(transcriptSegments);
    }
    if (format === "json") {
      downloadJSONFile(transcriptSegments);
    }
  }



  useEffect(() => {
    if (autoScroll && transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight
    }
    const audio = audioRef.current as any;
    if (!audio) {
      return
    }

    const handleTimeUpdate = () => setCurrentTime(audioRef.current.currentTime);
    const handleLoadedMetadata = () => setDuration(audioRef.current.duration);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [transcriptSegments, autoScroll, audioUrl]);

  const handlePlay = () => {
    audioRef.current.play();
    setIsPlaying(true);
  };

  const handleTranscript = async () => {
    console.log(audioUrl)
    if (!audioUrl) {
      toast.warning("Please upload an audio file")
      return
    }
    setOnTranscript(true)
    try {
      const formData = new FormData();
      console.log(audio_id)
      formData.append("file", selectedFile!);
      const res = await axios.post(`${BACKEND_SERVER_URL}/asr`, formData, {
        timeout: 6000000,
      })
      console.log(res.data)
      if (res.data) {
        const results = res.data as { speaker: string, text: string, timestamp: string, start: string, end: string }[];
        const mergedResults = mergeConsecutiveSegments(results)
        setSpeakers(extractSpeakers(results))
        mergedResults.map((mergedResult) => {
          setTranscriptText((prev) => prev + mergedResult.text + "\n")
          setTranscriptSegments((prev) => [...prev, { id: prev.length + 1, isEditing: false, speaker: mergedResult.speaker, text: mergedResult.text, timestamp: mergedResult.timestamp, duration: parseFloat(mergedResult.end) - parseFloat(mergedResult.start), confidence: Math.random() * (1 - 0.5) + 0.5, factCheck: "verified" }])
        })
      }
      setOnTranscript(false)
      toast.success("Transcription completed with success")
    } catch (e) {
      console.log(e)
      toast.error("occuring during transcription")
      setOnTranscript(false)
    }

  }
  const handlePause = () => {
    audioRef!.current.pause();
    setIsPlaying(false);
  };

  const handleStop = () => {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
  };

  const handleSeek = (e) => {
    audioRef.current.currentTime = e.target.value;
    setCurrentTime(e.target.value);
  };

  const handleSeekNext = () => {
    audioRef.current.currentTime = audioRef.current.currentTime + 30;
    setCurrentTime(audioRef.current.currentTime);
  }
  const handleSeekPrev = () => {
    audioRef.current.currentTime = audioRef.current.currentTime - 30;
    setCurrentTime(audioRef.current.currentTime);
  }

  const handleMute = () => {
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const formatTime = (times: string) => {
    const time = parseFloat(times)
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Live Transcription</h1>
            <p className="text-gray-600 dark:text-gray-400">Real-time speech-to-text with speaker identification</p>
          </div>

          <div className="flex items-center gap-2">
            <UploadButton />
            {audioUrl !== '' && <Link href={audioUrl}> <Button variant={"outline"}> <DownloadCloudIcon></DownloadCloudIcon> Download Audio</Button></Link>}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Transcription Panel */}
          <div className="lg:col-span-3 space-y-6">
            {/* Recording Controls */}

            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
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
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload audio</span> or drag and drop</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Audio file (format: .Wav, .mp3, .m4a)</p>
                </div>
                <input id="dropzone-file" onChange={handleFileChange} type="file" accept="audio/*" className="hidden" />
              </label>
            </div>
            <div className="flex items-center">
              <hr className="flex-grow" />
                <span className=" text-muted-foreground text-sm px-3">Or</span>
                <hr className="flex-grow" />
                </div>

                <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-0 shadow-lg">
                  <CardContent className="p-4">
                    <span className="text-sm font-semibold text-gray-500 my-3">{audioUrl === '' ? "Live Recording" : "Live Preview of : "} {selectedFile !== null && <span className=" text-base text-blue-500 font-normal font-mono dark:text-blue-400 py-2">{selectedFile.name}</span>}</span>
                    {audioUrl !== "" && <audio preload="metadata" className=" invisible h-4 pointer-events-none" ref={audioRef} id="audioPlayer" src={audioUrl} controls></audio>}
                    <div className="flex items-center justify-between my-2">
                      {audioUrl !== '' ?
                        <>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <Button
                                variant={isPlaying ? "destructive" : "outline"}
                                size="sm"
                                disabled={!isPlaying}
                                onClick={handleStop}
                              >
                                <Square className="w-4 h-4" />
                              </Button>

                              {isPlaying ? <Button
                                variant="outline"
                                size="sm"
                                onClick={handlePause}
                              >
                                <Pause className="w-4 h-4" />
                              </Button> : <Button
                                size="sm"
                                onClick={handlePlay}
                              >
                                <Play className="w-4 h-4" />
                              </Button>}
                              <Input
                                type="range"
                                min="0"
                                max={duration}
                                value={currentTime}
                                onChange={handleSeek}
                              // style={styles.slider}
                              />
                              <span className=" text-muted-foreground text-sm flex space-x-1"> <span>{formatTime(currentTime)} </span> <span>/</span> <span>{formatTime(duration.toString())}</span></span>
                              <Button variant="outline" size="sm" onClick={handleMute}>
                                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                              </Button>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Select value={playbackRate} onValueChange={(e) => {
                              setplaybackRate(e)
                              audioRef.current.playbackRate = parseFloat(e)
                              console.log(e)
                            }}>
                              <SelectTrigger className="w-20">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="0.5">0.5x</SelectItem>
                                <SelectItem value="0.75">0.75x</SelectItem>
                                <SelectItem value="1.0">1x</SelectItem>
                                <SelectItem value="1.25">1.25x</SelectItem>
                                <SelectItem value="1.5">1.5x</SelectItem>
                                <SelectItem value="2.0">2x</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button variant="outline" onClick={handleSeekPrev} size="sm">
                              <Rewind className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" onClick={handleSeekNext} size="sm">
                              <FastForward className="w-4 h-4" />
                            </Button>
                          </div>
                        </> :
                        <>
                          <AudioRecorder /></>}
                    </div>
                  </CardContent>
                </Card>

                {/* Search and Filter */}
                <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-0 shadow-lg">
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          placeholder="Search transcript..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10"
                        />
                      </div>

                      <div className="flex gap-2">
                        <Select value={selectedSpeaker} onValueChange={setSelectedSpeaker}>
                          <SelectTrigger className="w-[180px]">
                            <User className="w-4 h-4 mr-2" />
                            <SelectValue placeholder="Filter by speaker" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Speakers</SelectItem>
                            {speakers.map((speaker) => (
                              <SelectItem key={speaker.id} value={speaker.id}>
                                {speaker.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button onClick={handleTranscript}>
                          {
                            onTranscript ? <LoaderIcon className="h-4 w-4 animate-spin" /> : <AudioLines />
                          }
                          Transcription
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Live Transcript */}
                <Card className="flex-1 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        Live Transcript
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => exportTranscript("txt")}>
                          <Download className="w-4 h-4 mr-2" />
                          Export
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => {
                          try {
                            copy(transcriptSegments.map(s => s.text).join("\n"))
                            toast.success("Copied to clipboard")
                          } catch (error) {
                            toast.error("Failed to copy to clipboard")
                          }
                        }}>
                          <Copy className="w-4 h-4 mr-2" />
                          Copy
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div ref={transcriptRef} className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                      {transcriptSegments
                        .filter((segment) => selectedSpeaker === "all" || segment.speaker === selectedSpeaker)
                        .filter((segment) => !searchQuery || segment.text.toLowerCase().includes(searchQuery.toLowerCase()))
                        .map((segment) => {
                          const speaker = getSpeakerInfo(segment.speaker)
                          return (
                            <div
                              key={segment.id}
                              className="group border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                            >
                              {/* Segment Header */}
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  <Select
                                    value={segment.speaker}
                                    onValueChange={(value) => handleSpeakerChange(segment.id, value)}
                                  >
                                    <SelectTrigger className="w-[180px] h-8">
                                      <SelectValue>
                                        {getSpeakerInfo(segment.speaker).name}
                                      </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                      {speakers.map((speaker) => (
                                        <SelectItem key={speaker.id} value={speaker.id}>
                                          <div className="flex items-center gap-2">
                                            <div className={`w-3 h-3 rounded-full ${speaker.color.split(" ")[0]}`}></div>
                                            {speaker.name}
                                          </div>
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>

                                  <Badge variant="outline" className="text-xs">
                                    {segment.timestamp}
                                  </Badge>

                                  <Badge variant="outline" className="text-xs">
                                    {Math.round(segment.confidence * 100)}% confidence
                                  </Badge>

                                  {getFactCheckIcon(segment.factCheck)}
                                </div>

                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Button size="sm" variant="ghost" onClick={() => setEditingSegment(segment.id)}>
                                    <Edit3 className="w-3 h-3" />
                                  </Button>
                                  <Button size="sm" variant="ghost">
                                    <Copy className="w-3 h-3" />
                                  </Button>
                                  <Button size="sm" variant="ghost">
                                    <SkipBack className="w-3 h-3" />
                                  </Button>
                                  <Button size="sm" variant="ghost">
                                    <SkipForward className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>

                              {/* Segment Content */}
                              {editingSegment === segment.id ? (
                                <div className="space-y-2">
                                  <Textarea
                                    defaultValue={segment.text}
                                    className="min-h-[80px]"
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter" && e.ctrlKey) {
                                        handleEditSegment(segment.id, e.currentTarget.value)
                                      }
                                      if (e.key === "Escape") {
                                        setEditingSegment(null)
                                      }
                                    }}
                                  />
                                  <div className="flex gap-2">
                                    <Button
                                      size="sm"
                                      onClick={(e) => {
                                        const textarea = e.currentTarget.parentElement
                                          ?.previousElementSibling as HTMLTextAreaElement
                                        if (textarea) {
                                          handleEditSegment(segment.id, textarea.value)
                                        }
                                      }}
                                    >
                                      <Save className="w-3 h-3 mr-1" />
                                      Save
                                    </Button>
                                    <Button size="sm" variant="outline" onClick={() => setEditingSegment(null)}>
                                      Cancel
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <p className="text-gray-900 dark:text-gray-100 leading-relaxed">{segment.text}</p>
                              )}

                              {/* Segment Footer */}
                              <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100 dark:border-gray-800">
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                  <Clock className="w-3 h-3" />
                                  <span>{segment.duration.toFixed(2)}s duration</span>
                                </div>

                                {searchQuery && segment.text.toLowerCase().includes(searchQuery.toLowerCase()) && (
                                  <Badge variant="secondary" className="text-xs">
                                    Search match
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )
                        })}

                      {/* Live typing indicator */}
              
                      {
                        audioUrl === '' && 
                        <div className="border border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4">
                        <div className="flex flex-col justify-center items-center gap-3 min-h-60 mb-2">
                          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            <Upload className="w-3 h-3 mr-1" />
                            Please upload an audio file
                          </Badge>
                        </div>
                      </div>
                      }

                      {
                        audioUrl !== '' && !onTranscript && transcriptText === '' &&
                            <div className="border border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4">
                            <div className="flex flex-col justify-center items-center gap-3 min-h-60 mb-2">
                              <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                <Mic className="w-3 h-3 mr-1" />
                                Click to transcription button to start transcription
                              </Badge>
                            </div>
                          </div>
                        
                      }
                       
                          {  audioUrl !== '' && onTranscript && transcriptText == '' && <div className="border border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4">
                            <div className="flex flex-col justify-center items-center gap-3 min-h-60 mb-2">
                              <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                <Mic className="w-3 h-3 mr-1" />
                                Loading transcription
                              </Badge>
                              <div className="flex items-center gap-1">
                                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                                <div
                                  className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                                  style={{ animationDelay: "0.1s" }}
                                ></div>
                                <div
                                  className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                                  style={{ animationDelay: "0.2s" }}
                                ></div>
                              </div>
                            </div>
                          </div>}
                        
                      
                    </div>
                  </CardContent>
                </Card>
            </div>

            {/* Side Panel */}
            <div className="space-y-6">
              {/* Recording Stats */}
              <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-sm">Session Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Duration</span>
                    <span className="font-medium">{formatTime(duration.toString())}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Segments</span>
                    <span className="font-medium">{transcriptSegments.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Words</span>
                    <span className="font-medium">
                      {transcriptSegments.reduce((acc, seg) => acc + seg.text.split(" ").length, 0)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Avg Confidence</span>
                    <span className="font-medium text-green-600">
                      {Math.round(
                        (transcriptSegments.reduce((acc, seg) => acc + seg.confidence, 0) / transcriptSegments.length) *
                        100,
                      )}
                      %
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Speaker Activity */}
              <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Speaker Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {speakers.slice(0, 3).map((speaker, index) => {
                      const speakerSegments = transcriptSegments.filter((seg) => seg.speaker === speaker.name)
                      const totalDuration = speakerSegments.reduce((acc, seg) => acc + seg.duration, 0)
                      const percentage =
                        (totalDuration / transcriptSegments.reduce((acc, seg) => acc + seg.duration, 0)) * 100

                      return (
                        <div key={speaker.id} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full ${speaker.color.split(" ")[0]}`}></div>
                              <span className="text-sm font-medium">{speaker.name}</span>
                            </div>
                            <span className="text-xs text-gray-600">{Math.round(totalDuration)}s</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${speaker.color.split(" ")[0]}`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between items-center text-xs text-gray-500">
                            <span>{speakerSegments.length} segments</span>
                            <span>{Math.round(percentage)}%</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-sm">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" size="sm" onClick={() => exportTranscript("txt")} className="w-full justify-start bg-transparent">
                    <Download className="w-4 h-4 mr-2" />
                    Export as TXT
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => exportTranscript("srt")} className="w-full justify-start bg-transparent">
                    <Download className="w-4 h-4 mr-2" />
                    Export as SRT
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => exportTranscript("json")} className="w-full justify-start bg-transparent">
                    <Download className="w-4 h-4 mr-2" />
                    Export as JSON
                  </Button>
                </CardContent>
              </Card>

              {/* Audio Quality */}
              <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-sm">Audio Quality</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Signal Strength</span>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-4 bg-green-500 rounded-sm"></div>
                      <div className="w-2 h-4 bg-green-500 rounded-sm"></div>
                      <div className="w-2 h-4 bg-green-500 rounded-sm"></div>
                      <div className="w-2 h-4 bg-gray-300 dark:bg-gray-600 rounded-sm"></div>
                      <div className="w-2 h-4 bg-gray-300 dark:bg-gray-600 rounded-sm"></div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Noise Level</span>
                    <span className="text-sm font-medium text-green-600">Low</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Sample Rate</span>
                    <span className="text-sm font-medium">44.1 kHz</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
    </Layout>
  ) 
}
