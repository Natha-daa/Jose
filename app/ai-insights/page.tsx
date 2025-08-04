"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, Lightbulb, TrendingUp, MessageSquare, Users, Target, Download, Filter, Calendar, UploadCloud, Mic, ExternalLink, PlusCircleIcon, ChevronRight } from "lucide-react"
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
import { useState } from "react"
import { HeaderFackCheck } from "@/components/HeaderFackCheck"
import { toast } from "sonner"
import axios from "axios"
import { NewStructure, OldItem } from "../fact-check/page"
import { BACKEND_SERVER_URL } from "@/lib/constants"
import Typewriter from 'typewriter-effect';
import Image from "next/image"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"


export interface SpeakerAnalysis {
  speaker: string;
  dominant_traits: string[];
  tone: string;
  intentions: string[];
  confidence: number;
}

export default function AIInsightsPage() {
  const [open, setOpen] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [typeFile, setTypeFile] = useState("local")
  const [summary, setSummary] = useState<{
    global_summary: string,
    by_speaker: Record<string, string>,
  }>({
    global_summary: "",
    by_speaker: {}
  })
  const regex = /^([^\(]+)\(([^\)]+)\)$/

  const [speakerAnalysis, setSpeakerAnalysis] = useState<SpeakerAnalysis[]>([])
  const [allSpeakerIdeology, setAllSpeakerIdeology] = useState<{ speaker: string, orientation: string, justification: string, confidence: number }[]>([])


  const getSummary = async (transformed: NewStructure) => {
    try {
      const res = await axios.post(`${BACKEND_SERVER_URL}/summarize`, transformed)
      const data = res.data
      console.log(data)
      setSummary(data)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }
  const handleImport = async () => {
    if (!file) {
      toast.error("Please select a file")
      return
    }

    if (typeFile === "local") {
      toast.loading("Importing file...")
      setLoading(true)
    }
    if (typeFile === "library") {
      toast.loading("Importing file...")
      setLoading(true)
    }
    if (typeFile === "transcript") {
      const text = await file!.text();
      const data: OldItem[] = JSON.parse(text);
      console.log(data)

      const transformed: NewStructure = {
        transcript: data.map(item => ({
          speaker: item.speaker,
          start_time: item.timestamp,
          text: item.text
        }))
      }
      try {
        toast.promise(
          getSummary(transformed),
          {
            loading: "Generating summary...",
            success: "Summary generated successfully",
            error: "Failed to generate summary"
          }
        )
        console.log(transformed)
      } catch (error) {
        console.log(error)
        toast.error("Failed to generate summary")
      }

      try {
        const res = await axios.post(`${BACKEND_SERVER_URL}/psych-profile`, transformed)
        const data = res.data as { speaker: string, dominant_traits: string[], tone: string, intentions: string[], confidence: number }[]
        setSpeakerAnalysis(data)
        console.log(data)
        toast.success("Psychology analysis generated successfully")
      } catch (error) {
        console.log(error)
        toast.error("Error occuring during psychology analysis")
      }

      try {
        const resw = await axios.post(`${BACKEND_SERVER_URL}/ideology`, transformed)
        const data = resw.data as { speaker: string, orientation: string, justification: string, confidence: number }[]
        console.log(data)
        setAllSpeakerIdeology(data)
        toast.success("Ideology analysis generated successfully")
      } catch (error) {
        console.log(error)
        toast.error("Error occuring during ideology analysis")
      }
    }

  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Cognitive System</h1>
            <p className="text-gray-600 mt-3 dark:text-gray-400">Advanced AI-powered analysis and insights</p>
          </div>
          <div className="flex items-center gap-3">

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <button type="button" className="text-white flex gap-2 items-center bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 "><Download className="h-4 w-4 mr-2" />
                  Import data</button>
              </DialogTrigger>
              <DialogContent className="text-start flex flex-col gap-4">
                <DialogHeader>
                  <DialogTitle>Import file</DialogTitle>
                  <div className="text-sm text-gray-500">
                    <HeaderFackCheck typeFile={typeFile} setTypeFile={setTypeFile} file={file} setFile={setFile} />
                  </div>
                </DialogHeader>
                <DialogFooter className="grid gap-3">
                  <DialogClose asChild>
                    <Button onClick={handleImport} className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 "> <UploadCloud />  Import</Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button variant="destructive">Cancel</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Speakers</CardTitle>
              <Lightbulb className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{Object.keys(summary.by_speaker).length == 0 ? 0 : Object.keys(summary.by_speaker).length}</div>
              <p className="text-xs text-blue-600 dark:text-blue-400">+{summary.global_summary.length} Tokens</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">Avg. Ideology</CardTitle>
              <MessageSquare className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900 dark:text-green-100">{allSpeakerIdeology.length == 0 ? 0 : (allSpeakerIdeology.reduce((acc, ideology) => acc + ideology.confidence, 0) / allSpeakerIdeology.length).toFixed(2)} %</div>
              <p className="text-xs text-green-600 dark:text-green-400">Overall</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">Avg. Sentiment</CardTitle>
              <Target className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">{speakerAnalysis.length == 0 ? 0 : (speakerAnalysis.reduce((acc, analysis) => acc + analysis.confidence, 0) / speakerAnalysis.length).toFixed(2)} %</div>
              <p className="text-xs text-purple-600 dark:text-purple-400">Identified</p>
            </CardContent>
          </Card>

        </div>

        {/* AI Insights Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-0">
            <TabsTrigger value="overview">Summary</TabsTrigger>
            <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
            <TabsTrigger value="topics">Ideology</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mic className="h-5 w-5 text-blue-600" />
                    Speaker Summary                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {Object.entries(summary.by_speaker).length === 0 ? (
                    <p className="text-gray-500">Aucun résumé par intervenant.</p>
                  ) : (
                    Object.entries(summary.by_speaker).map(([speaker, speakerSummary]) => (
                      <div key={speaker} className="p-3 bg-gray-50/50 dark:bg-gray-700/50 rounded-lg border-0">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-medium text-gray-900 dark:text-white">{speaker}</h3>
                          <Badge variant="outline" className="text-xs">
                            Fack Check
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{speakerSummary}</p>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>

              <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    Global Summary {summary.global_summary.length !== 0 && <span className="text-xs text-green-600">{summary.global_summary.length} Tokens</span>}
                  </CardTitle>

                </CardHeader>
                <CardContent className="space-y-4">
                  {summary.global_summary.length === 0 ? <span className="text-gray-600 dark:text-gray-400">
                    Unavailable global summary            </span> : <Typewriter options={{
                      strings: summary.global_summary,
                      delay: 25,
                      loop: false,
                      autoStart: true,
                      cursor: "|",
                      cursorClassName: "typewriter-cursor",
                    }} />}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="sentiment" className="space-y-6">
            <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Psychology Analysis</CardTitle>
              </CardHeader>
              {speakerAnalysis.length === 0 && <CardContent className="flex flex-col items-center justify-center">
                <Image src="/notfound.jpg" alt="Psychology Analysis" width={500} height={500} />
                <span className="text-gray-600 dark:text-gray-400">Unavailable psychology analysis</span>
              </CardContent>}
              {speakerAnalysis.length !== 0 && <CardContent className="space-y-4">
                <CardContent className="mx-4">
                  <Carousel>
                    <CarouselContent>
                      {speakerAnalysis.map((analysis) =>

                        <CarouselItem key={analysis.speaker} className="border-1 border-gray-600">
                          <h4 className="text-base font-semibold text-blue-600 my-3">Psychology Profile</h4>
                          <div className="flex items-center justify-between">
                            <div className="flex space-x-2 items-center mb-2">
                              <span className="text-sm font-light">Speaker Name :</span>
                              <h4 className="text-base font-bold text-green-600">{analysis.speaker}</h4>
                            </div>
                            <Badge className="text-xs bg-blue-500 text-primary-foreground">
                              Confidence : {analysis.confidence} %
                            </Badge>
                          </div>
                          <h5 className="text-base font-semibold text-cyan-600 mt-3 flex items-center">  <ChevronRight className="w-4 h-4 mr-2 " /> <span> Dominant Character</span></h5>
                          <Accordion type="single" collapsible className="w-full text-start gap-4 items-start">
                            {analysis.dominant_traits.map((trait, index) => (
                              <AccordionItem key={index + trait} value={trait}>
                                <AccordionTrigger className=" text-start  text-sm">{trait.match(regex)?.[1]}</AccordionTrigger>
                                <AccordionContent className="flex flex-col text-muted-foreground gap-4 text-balance">
                                  <p>{trait.match(regex)?.[2]}</p>
                                </AccordionContent>
                              </AccordionItem>
                            ))}
                          </Accordion>
                          <h5 className="text-base font-semibold text-purple-600 mt-3 flex items-center"> <ChevronRight className="w-4 h-4 mr-2 " /> <span>Intentions</span> </h5>
                          <Accordion type="single" collapsible className="w-full text-start gap-4 items-start">
                            {analysis.intentions.map((trait, index) => (
                              <AccordionItem key={index + trait} value={trait}>
                                <AccordionTrigger className=" text-start  text-sm">{trait.split(":")[0].match(regex)?.[1]}</AccordionTrigger>
                                <AccordionContent className="flex flex-col text-muted-foreground gap-4 text-balance">
                                  <p>{trait.split(":")[0].match(regex)?.[2]}</p>
                                </AccordionContent>
                              </AccordionItem>
                            ))}
                          </Accordion>
                          <h5 className="text-base font-semibold text-orange-600 mt-3 flex items-center"><ChevronRight className="w-4 h-4 mr-2 " /> <span>Tone of Voice</span></h5>
                          <Accordion type="single" collapsible className="w-full text-start gap-4 items-start">

                            <AccordionItem value="Tone of Voice">
                              <AccordionTrigger className=" text-start  text-sm">{analysis.tone.split(" ")[0]}</AccordionTrigger>
                              <AccordionContent>
                                <p>{analysis.tone.split(" ").slice(1).join(" ")}</p>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        </CarouselItem>
                      )}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                  </Carousel>
                </CardContent>
              </CardContent>}
            </Card>
          </TabsContent>

          <TabsContent value="topics" className="space-y-6">
            <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Ideology profile</CardTitle>
              </CardHeader>
              {allSpeakerIdeology.length === 0 && <CardContent className="flex flex-col items-center justify-center">
                <Image src="/notfound.jpg" alt="Psychology Analysis" width={500} height={500} />
                <span className="text-destructive dark:text-destructive">Unavailable Ideology profile</span>
              </CardContent>}
              {
                allSpeakerIdeology.length !== 0 && allSpeakerIdeology.map((ideology) => <CardContent key={ideology.speaker} className="w-full">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-purple-50/50 dark:bg-purple-900/20 rounded-lg border-0">
                      <h4 className="font-bold text-purple-900 dark:text-purple-100 mb-2">{ideology.speaker}</h4>
                       <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3 justify-between">
                          <Badge variant="outline">orientation</Badge> <span>{ideology.orientation}</span>
                        </div>
                        <div className="flex items-start flex-col gap-3">
                          <h3 className="text-sm font-medium text-orange-500 mt-3 ">Justification</h3> <span className="text-muted-foreground text-sm">{ideology.justification}</span>
                        </div>
                        <div className="flex items-center gap-3 justify-between">
                          <Badge className="text-xs bg-blue-600">confidence</Badge> <span>{ideology.confidence}</span>
                        </div>

                      </div>
                    </div>
                  </div>
                </CardContent>)
              }

            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  )
}
