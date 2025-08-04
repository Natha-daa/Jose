"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  Filter,
  Plus,
  CheckCircle,
  AlertTriangle,
  MessageSquare,
  User,
  Clock,
  Share,
  Edit3,
  Eye,
  MoreHorizontal,
  Save,
  Calendar,
  ScrollText,
  Loader2Icon,
} from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import axios from "axios"
import Layout from "@/components/kokonutui/layout"
import { HeaderFackCheck } from "@/components/HeaderFackCheck"
import { BACKEND_SERVER_URL } from "@/lib/constants"
import { toast } from "sonner"
import Image from "next/image"
import { formatDateFR } from "../content-library/page"

export type OldItem = {
  id: number;
  isEditing: boolean;
  speaker: string;
  text: string;
  timestamp: string;
  duration: number;
  confidence: number;
  factCheck: string;
};

export type NewItem = {
  speaker: string;
  start_time: string;
  text: string;
};

export type NewStructure = {
  transcript: NewItem[];
};



const setClaims = (claims: any) => claims // Placeholder for setClaims function

export default function FactCheckPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [editingClaim, setEditingClaim] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [typeFile, setTypeFile] = useState("local")
  const [file, setFile] = useState<File | null>(null)
  const [allClaims, setAllClaims] = useState<{
    id: number;
    text: string;
    speaker: string;
    debate: string;
    timestamp: string;
    status: string;
    evidence: string;
    date: string;
    sources: string[];
    category: string;
    justification: string;
  }[]>([])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "True":
        return (
          <Badge className="bg-green-500/20 text-green-400 dark:bg-green-500/20 dark:text-green-400">
            <CheckCircle className="w-3 h-3 mr-1" />
            Verified
          </Badge>
        )
      case "False":
        return (
          <Badge className="bg-red-500/20 text-red-400 dark:bg-red-500/20 dark:text-red-400">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Disputed
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-yellow-500/20 text-yellow-400 dark:bg-yellow-500/20 dark:text-yellow-400">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        )
      case "Unverified":
        return (
          <Badge className="bg-orange-500/20 text-orange-400 dark:bg-orange-500/20 dark:text-orange-400">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Unverified
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const handleEditClaim = (claimId: number, newText: string, newEvidence: string) => {
    setClaims((prevClaims: any) =>
      prevClaims.map((claim: any) =>
        claim.id === claimId ? { ...claim, text: newText, evidence: newEvidence, isEditing: false } : claim,
      ),
    )
    setEditingClaim(null)
  }

  const filteredClaims = allClaims.filter(
    (claim) =>
      (filterStatus === "all" || claim.status === filterStatus) &&
      (searchQuery === "" ||
        claim.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        claim.speaker.toLowerCase().includes(searchQuery.toLowerCase()) ||
        claim.category.toLowerCase().includes(searchQuery.toLowerCase())),
  )
  const handleStartFactCheck = async () => {
    if (!file) {
      toast.error("Please select a file")
      return
    }

    if (typeFile === "local") {
      setLoading(true)
    }
    if (typeFile === "library") {
      setLoading(true)
    }
    if (typeFile === "transcript") {
      setLoading(true)
      const text = await file!.text();
      const data: OldItem[] = JSON.parse(text);

      const transformed: NewStructure = {
        transcript: data.map(item => ({
          speaker: item.speaker,
          start_time: item.timestamp,
          text: item.text
        }))
      };
      try {
        console.log(transformed)
        const res = await axios.post(`${BACKEND_SERVER_URL}/fact-checking`, transformed)
        const data = res.data as {statement: string, verdict: string, confidence: number, sources: string[], category: string, speaker: string, evidence: string, justification: string, start_time: string}[]
        console.log(data)
        data.forEach((claim, index) => {
          setAllClaims((prevClaims) => [...prevClaims, {
            id: index + 1,
            text: claim.statement,
            speaker: claim.speaker,
            debate: "Debate",
            timestamp: claim.start_time,
            status: claim.verdict,
            evidence: claim.evidence,
            date: new Date().toISOString(),
            category: claim.category,
            sources: claim.sources,
            justification: claim.justification,
          }])
        })
        toast.success("Fact check completed successfully")
      } catch (error) {
        console.log(error)
        toast.error("Failed to complete fact check")
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <Layout>
      {loading && <div className="fixed top-0 left-0 inset-0 z-50  w-full h-full bg-black/5 backdrop-blur-md flex items-center justify-center">
        <div className="flex items-center flex-col gap-3 justify-center">
          <div className="loader"></div>
          <p className="text-primary-inverted">Please wait...</p>
        </div>
      </div>}
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Fact Check</h1>
            <p className="text-gray-600 dark:text-gray-400">Verify claims and track accuracy in debates</p>
          </div>
          <div className="flex items-center gap-3">

            <button type="button" onClick={handleStartFactCheck} className="text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 shadow-lg shadow-cyan-500/50 dark:shadow-lg dark:shadow-cyan-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 flex gap-2 items-center"> <ScrollText className="w-4 h-4 mr-2" />  Start Fact Check</button>

          </div>
        </div>
        <HeaderFackCheck typeFile={typeFile} setTypeFile={setTypeFile} file={file} setFile={setFile} />
        {/* Search and Filters */}
        <h4 className="text-xl font-bold text-gray-900 capitalize dark:text-white">Analysis results</h4>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative w-full">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5v10M3 5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm12 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm0 0V6a3 3 0 0 0-3-3H9m1.5-2-2 2 2 2" />
              </svg>
            </div>
            <input type="text" value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search claims, speakers, debates..." required />
          </div>
          <div className="flex gap-2">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="True">Verified</SelectItem>
                <SelectItem value="False">Disputed</SelectItem>
                <SelectItem value="Unverified">Unverified</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Fact Check Stats */}
        {allClaims.length == 0 ? <div className="flex flex-col items-center justify-center">
          <Image src="/notfound.jpg" alt="No data" width={500} height={500} className="object-contain" />
          <p className="text-xl font-bold text-destructive dark:text-white">No claims found</p>
        </div> : <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Claims</p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{allClaims.length}</p>
                </div>
                <MessageSquare className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700 dark:text-green-300">Verified Claims</p>
                  <p className="text-2xl font-bold text-green-900 dark:text-green-100">{allClaims.filter((claim) => claim.status === "True").length}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-700 dark:text-red-300">Disputed Claims</p>
                  <p className="text-2xl font-bold text-red-900 dark:text-red-100">{allClaims.filter((claim) => claim.status === "False").length}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-700 dark:text-yellow-300">Unverified Claims</p>
                  <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">{allClaims.filter((claim) => claim.status === "Unverified").length}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>}

        {/* Claims List */}
        {allClaims.length > 0 && <Tabs defaultValue="all" className="space-y-4">
          <TabsList className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-0">
            <TabsTrigger value="all">All Claims</TabsTrigger>
            <TabsTrigger value="verified">Verified</TabsTrigger>
            <TabsTrigger value="disputed">Disputed</TabsTrigger>
            <TabsTrigger value="unverified">Unverified</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="grid grid-cols-1 gap-6">
              {filteredClaims.map((claim) => (
                <Card
                  key={claim.id}
                  className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        {editingClaim === claim.id ? (
                          <Textarea
                            defaultValue={claim.text}
                            className="min-h-[80px] mb-2"
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && e.ctrlKey) {
                                const newText = e.currentTarget.value
                                const newEvidence = (
                                  e.currentTarget.parentElement?.querySelector(
                                    "textarea:last-of-type",
                                  ) as HTMLTextAreaElement
                                )?.value
                                handleEditClaim(claim.id, newText, newEvidence || claim.evidence)
                              }
                              if (e.key === "Escape") {
                                setEditingClaim(null)
                              }
                            }}
                          />
                        ) : (
                          <p className="text-gray-900 dark:text-white font-medium mb-2 leading-relaxed">{claim.text}</p>
                        )}
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <User className="w-4 h-4" />
                          <span>{claim.speaker}</span>
                          <MessageSquare className="w-4 h-4 ml-2" />
                          <span>{claim.debate}</span>
                          <Clock className="w-4 h-4 ml-2" />
                          <span>{claim.timestamp}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        {getStatusBadge(claim.status)}
                        <Button variant="ghost" size="sm" onClick={() => setEditingClaim(claim.id)}>
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300 mb-4">
                      <p className="font-medium">Evidence:</p>
                      {editingClaim === claim.id ? (
                        <Textarea
                          defaultValue={claim.evidence}
                          className="min-h-[60px]"
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && e.ctrlKey) {
                              const newEvidence = e.currentTarget.value
                              const newText = (
                                e.currentTarget.parentElement?.previousElementSibling?.querySelector(
                                  "textarea",
                                ) as HTMLTextAreaElement
                              )?.value
                              handleEditClaim(claim.id, newText || claim.text, newEvidence)
                            }
                            if (e.key === "Escape") {
                              setEditingClaim(null)
                            }
                          }}
                        />
                      ) : (
                        <p className="italic">{claim.evidence}</p>
                      )}
                    </div>

                    {editingClaim === claim.id && (
                      <div className="flex gap-2 mt-4">
                        <Button
                          size="sm"
                          onClick={(e) => {
                            const parentDiv = e.currentTarget.parentElement?.parentElement as HTMLElement
                            const textInput = parentDiv.querySelector("textarea:first-of-type") as HTMLTextAreaElement
                            const evidenceInput = parentDiv.querySelector(
                              "textarea:last-of-type",
                            ) as HTMLTextAreaElement
                            handleEditClaim(claim.id, textInput.value, evidenceInput.value)
                          }}
                        >
                          <Save className="w-3 h-3 mr-1" />
                          Save
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setEditingClaim(null)}>
                          Cancel
                        </Button>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDateFR(claim.date)}</span>
                        <Badge variant="outline">{claim.category}</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <AlertDialog>
                          <AlertDialogTrigger asChild><Button size="sm" variant="outline">
                            <Eye className="w-3 h-3 mr-1" />
                            Justification
                          </Button></AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>{claim.text}</AlertDialogTitle>
                              <AlertDialogDescription>
                                {claim.justification}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogAction>OK</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                        <AlertDialog>
                          <AlertDialogTrigger asChild><Button size="sm" variant="ghost">
                            <Share className="w-3 h-3" />
                          </Button></AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Sources</AlertDialogTitle>
                              <AlertDialogDescription>
                                {claim.sources.slice(0,5).map((source) => (
                                  <li className="flex items-center mt-3 space-x-3 rtl:space-x-reverse">
                                    <svg className="shrink-0 w-3.5 h-3.5 text-green-500 dark:text-green-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
                                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5.917 5.724 10.5 15 1.5" />
                                    </svg>
                                    <a href={source} className="text-blue-500 hover:underline">{source}</a>
                                  </li>
                                ))}
                                {
                                  claim.sources.length == 0 && (
                                    <span className="text-gray-500 p-3">No sources available</span>
                                  )
                                }
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogAction asChild>
                              <button type="button" className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">OK</button>
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>

                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="verified">
            <div className="grid grid-cols-1 gap-6">
              {filteredClaims.map((claim) => (
                claim.status === "True" && (
                  <Card
                    key={claim.id}
                    className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          {editingClaim === claim.id ? (
                            <Textarea
                              defaultValue={claim.text}
                              className="min-h-[80px] mb-2"
                              onKeyDown={(e) => {
                                if (e.key === "Enter" && e.ctrlKey) {
                                  const newText = e.currentTarget.value
                                  const newEvidence = (
                                    e.currentTarget.parentElement?.querySelector(
                                      "textarea:last-of-type",
                                    ) as HTMLTextAreaElement
                                  )?.value
                                  handleEditClaim(claim.id, newText, newEvidence || claim.evidence)
                                }
                                if (e.key === "Escape") {
                                  setEditingClaim(null)
                                }
                              }}
                            />
                          ) : (
                            <p className="text-gray-900 dark:text-white font-medium mb-2 leading-relaxed">{claim.text}</p>
                          )}
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <User className="w-4 h-4" />
                            <span>{claim.speaker}</span>
                            <MessageSquare className="w-4 h-4 ml-2" />
                            <span>{claim.debate}</span>
                            <Clock className="w-4 h-4 ml-2" />
                            <span>{claim.timestamp}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          {getStatusBadge(claim.status)}
                          <Button variant="ghost" size="sm" onClick={() => setEditingClaim(claim.id)}>
                            <Edit3 className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300 mb-4">
                        <p className="font-medium">Evidence:</p>
                        {editingClaim === claim.id ? (
                          <Textarea
                            defaultValue={claim.evidence}
                            className="min-h-[60px]"
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && e.ctrlKey) {
                                const newEvidence = e.currentTarget.value
                                const newText = (
                                  e.currentTarget.parentElement?.previousElementSibling?.querySelector(
                                    "textarea",
                                  ) as HTMLTextAreaElement
                                )?.value
                                handleEditClaim(claim.id, newText || claim.text, newEvidence)
                              }
                              if (e.key === "Escape") {
                                setEditingClaim(null)
                              }
                            }}
                          />
                        ) : (
                          <p className="italic">{claim.evidence}</p>
                        )}
                      </div>

                      {editingClaim === claim.id && (
                        <div className="flex gap-2 mt-4">
                          <Button
                            size="sm"
                            onClick={(e) => {
                              const parentDiv = e.currentTarget.parentElement?.parentElement as HTMLElement
                              const textInput = parentDiv.querySelector("textarea:first-of-type") as HTMLTextAreaElement
                              const evidenceInput = parentDiv.querySelector(
                                "textarea:last-of-type",
                              ) as HTMLTextAreaElement
                              handleEditClaim(claim.id, textInput.value, evidenceInput.value)
                            }}
                          >
                            <Save className="w-3 h-3 mr-1" />
                            Save
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setEditingClaim(null)}>
                            Cancel
                          </Button>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDateFR(claim.date)}</span>
                          <Badge variant="outline">{claim.category}</Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <AlertDialog>
                            <AlertDialogTrigger asChild><Button size="sm" variant="outline">
                              <Eye className="w-3 h-3 mr-1" />
                              Justification
                            </Button></AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>{claim.text}</AlertDialogTitle>
                                <AlertDialogDescription>
                                  {claim.justification}
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogAction>OK</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>

                          <Button size="sm" variant="ghost">
                            <Share className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>)
              ))}
            </div>
          </TabsContent>

          <TabsContent value="disputed">
            {filteredClaims.filter((claim) => claim.status === "False").length === 0 ? (
              <div className="text-center py-12">
                <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">Disputed claims will be displayed here</p>
              </div>) : (
              <div className="grid grid-cols-1 gap-6">
                {filteredClaims.map((claim) => (
                  claim.status === "True" && (
                    <Card
                      key={claim.id}
                      className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            {editingClaim === claim.id ? (
                              <Textarea
                                defaultValue={claim.text}
                                className="min-h-[80px] mb-2"
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" && e.ctrlKey) {
                                    const newText = e.currentTarget.value
                                    const newEvidence = (
                                      e.currentTarget.parentElement?.querySelector(
                                        "textarea:last-of-type",
                                      ) as HTMLTextAreaElement
                                    )?.value
                                    handleEditClaim(claim.id, newText, newEvidence || claim.evidence)
                                  }
                                  if (e.key === "Escape") {
                                    setEditingClaim(null)
                                  }
                                }}
                              />
                            ) : (
                              <p className="text-gray-900 dark:text-white font-medium mb-2 leading-relaxed">{claim.text}</p>
                            )}
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                              <User className="w-4 h-4" />
                              <span>{claim.speaker}</span>
                              <MessageSquare className="w-4 h-4 ml-2" />
                              <span>{claim.debate}</span>
                              <Clock className="w-4 h-4 ml-2" />
                              <span>{claim.timestamp}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            {getStatusBadge(claim.status)}
                            <Button variant="ghost" size="sm" onClick={() => setEditingClaim(claim.id)}>
                              <Edit3 className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300 mb-4">
                          <p className="font-medium">Evidence:</p>
                          {editingClaim === claim.id ? (
                            <Textarea
                              defaultValue={claim.evidence}
                              className="min-h-[60px]"
                              onKeyDown={(e) => {
                                if (e.key === "Enter" && e.ctrlKey) {
                                  const newEvidence = e.currentTarget.value
                                  const newText = (
                                    e.currentTarget.parentElement?.previousElementSibling?.querySelector(
                                      "textarea",
                                    ) as HTMLTextAreaElement
                                  )?.value
                                  handleEditClaim(claim.id, newText || claim.text, newEvidence)
                                }
                                if (e.key === "Escape") {
                                  setEditingClaim(null)
                                }
                              }}
                            />
                          ) : (
                            <p className="italic">{claim.evidence}</p>
                          )}
                        </div>

                        {editingClaim === claim.id && (
                          <div className="flex gap-2 mt-4">
                            <Button
                              size="sm"
                              onClick={(e) => {
                                const parentDiv = e.currentTarget.parentElement?.parentElement as HTMLElement
                                const textInput = parentDiv.querySelector("textarea:first-of-type") as HTMLTextAreaElement
                                const evidenceInput = parentDiv.querySelector(
                                  "textarea:last-of-type",
                                ) as HTMLTextAreaElement
                                handleEditClaim(claim.id, textInput.value, evidenceInput.value)
                              }}
                            >
                              <Save className="w-3 h-3 mr-1" />
                              Save
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setEditingClaim(null)}>
                              Cancel
                            </Button>
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                            <Calendar className="w-3 h-3" />
                            <span>{formatDateFR(claim.date)}</span>
                            <Badge variant="outline">{claim.category}</Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <AlertDialog>
                              <AlertDialogTrigger asChild><Button size="sm" variant="outline">
                                <Eye className="w-3 h-3 mr-1" />
                                Justification
                              </Button></AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>{claim.text}</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    {claim.justification}
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogAction>OK</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>

                            <Button size="sm" variant="ghost">
                              <Share className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>)
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="unverified">
            {filteredClaims.filter((claim) => claim.status === "Unverified").length === 0 ? (
              <div className="text-center py-12">
                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">Unverified claims will be displayed here</p>
              </div>) : (
              <div className="grid grid-cols-1 gap-6">
                {filteredClaims.map((claim) => (
                  claim.status === "Unverified" && (
                    <Card
                      key={claim.id}
                      className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            {editingClaim === claim.id ? (
                              <Textarea
                                defaultValue={claim.text}
                                className="min-h-[80px] mb-2"
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" && e.ctrlKey) {
                                    const newText = e.currentTarget.value
                                    const newEvidence = (
                                      e.currentTarget.parentElement?.querySelector(
                                        "textarea:last-of-type",
                                      ) as HTMLTextAreaElement
                                    )?.value
                                    handleEditClaim(claim.id, newText, newEvidence || claim.evidence)
                                  }
                                  if (e.key === "Escape") {
                                    setEditingClaim(null)
                                  }
                                }}
                              />
                            ) : (
                              <p className="text-gray-900 dark:text-white font-medium mb-2 leading-relaxed">{claim.text}</p>
                            )}
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                              <User className="w-4 h-4" />
                              <span>{claim.speaker}</span>
                              <MessageSquare className="w-4 h-4 ml-2" />
                              <span>{claim.debate}</span>
                              <Clock className="w-4 h-4 ml-2" />
                              <span>{claim.timestamp}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            {getStatusBadge(claim.status)}
                            <Button variant="ghost" size="sm" onClick={() => setEditingClaim(claim.id)}>
                              <Edit3 className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300 mb-4">
                          <p className="font-medium">Evidence:</p>
                          {editingClaim === claim.id ? (
                            <Textarea
                              defaultValue={claim.evidence}
                              className="min-h-[60px]"
                              onKeyDown={(e) => {
                                if (e.key === "Enter" && e.ctrlKey) {
                                  const newEvidence = e.currentTarget.value
                                  const newText = (
                                    e.currentTarget.parentElement?.previousElementSibling?.querySelector(
                                      "textarea",
                                    ) as HTMLTextAreaElement
                                  )?.value
                                  handleEditClaim(claim.id, newText || claim.text, newEvidence)
                                }
                                if (e.key === "Escape") {
                                  setEditingClaim(null)
                                }
                              }}
                            />
                          ) : (
                            <p className="italic">{claim.evidence}</p>
                          )}
                        </div>

                        {editingClaim === claim.id && (
                          <div className="flex gap-2 mt-4">
                            <Button
                              size="sm"
                              onClick={(e) => {
                                const parentDiv = e.currentTarget.parentElement?.parentElement as HTMLElement
                                const textInput = parentDiv.querySelector("textarea:first-of-type") as HTMLTextAreaElement
                                const evidenceInput = parentDiv.querySelector(
                                  "textarea:last-of-type",
                                ) as HTMLTextAreaElement
                                handleEditClaim(claim.id, textInput.value, evidenceInput.value)
                              }}
                            >
                              <Save className="w-3 h-3 mr-1" />
                              Save
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setEditingClaim(null)}>
                              Cancel
                            </Button>
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                            <Calendar className="w-3 h-3" />
                            <span>{formatDateFR(claim.date)}</span>
                            <Badge variant="outline">{claim.category}</Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <AlertDialog>
                              <AlertDialogTrigger asChild><Button size="sm" variant="outline">
                                <Eye className="w-3 h-3 mr-1" />
                                Justification
                              </Button></AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>{claim.text}</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    {claim.justification}
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogAction>OK</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>

                            <Button size="sm" variant="ghost">
                              <Share className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>)
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>}
      </div>
    </Layout>
  )
}
