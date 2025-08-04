'use client'
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Download, Mic, Pause, Play, Square, Volume2, VolumeX } from "lucide-react"
import { useAudioRecorder } from "react-use-audio-recorder";
import { toast } from "sonner";

function formatTime(seconds: number) {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`
}
export default function AudioRecorder() {
    const [isRecording, setIsRecording] = useState(false)
    const [isPaused, setIsPaused] = useState(false)
    const [isMuted, setIsMuted] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [volume, setVolume] = useState(1)
    const {
        recordingStatus,
        recordingTime,
        startRecording,
        stopRecording,
        pauseRecording,
        resumeRecording,
        getBlob,
        saveRecording,
      } = useAudioRecorder();
    
    return (
        <>
        <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
         
          <Button
            variant={isRecording ? "destructive" : "default"}
            size="sm"
            onClick={() => {
              if (isRecording) {
                stopRecording();
              } else {
                startRecording();
              }
              setIsRecording(!isRecording)
            }}
          >
            {isRecording ? <Square className="w-4 h-4"  /> :<Mic />}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (isPaused) {
                resumeRecording();
              } else {
                pauseRecording();
              }
              setIsPaused(!isPaused)
            }}
            disabled={!isRecording}
          >
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          </Button>

          <Button variant="outline" size="sm" onClick={() => {
            setIsMuted(!isMuted)
            if (isMuted) {
              setVolume(0);
            } else {
              setVolume(1);
            }
          }}>
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </Button>
        </div>

        <div className="flex items-center gap-2">
          {isRecording && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
              <span className="text-red-600 dark:text-red-400 font-medium uppercase text-sm">{recordingStatus}</span>
            </div>
          )}
          <span className="text-sm mx-4 text-gray-600 dark: font-mono">{formatTime(recordingTime)}</span>
        </div>
        
      </div>
      <div>
            <Button
                variant="outline"
                size="sm"
                onClick={() => {
                    saveRecording()
                    toast.success("Audio saved successfully")
                }}
                disabled={!(recordingStatus === "stopped")}
            >
                <Download className="w-4 h-4" />
            </Button>
        </div>
      </>
    )       
}