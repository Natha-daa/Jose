'use client'

import { LinkIcon, ScanText, UploadCloud } from 'lucide-react';
import { useState } from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import Link from 'next/link';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useEffect } from "react";
import axios from "axios"
export function HeaderFackCheck({ typeFile, setTypeFile, file, setFile }: { typeFile: string, setTypeFile: (typeFile: string) => void, file: File | null, setFile: (file: File | null) => void }) {
    const tabs = [
        {
            label: 'From local file',
            icon: (
                <UploadCloud className='w-4 h-4 me-2' />
            ),
        },
        {
            label: 'From Content Library',
            icon: (
                <svg
                    className="w-4 h-4 me-2"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 18 18"
                >
                    <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z" />
                </svg>
            ),
        },
        {
            label: 'From Transcript',
            icon: (
                <ScanText className='w-4 h-4 me-2' />
            ),
        }
    ];
    const [activeTab, setActiveTab] = useState(tabs[0].label);
    const [content, setContent] = useState<{
        id: string;
        name: string;
        description: string;
        audioLink: string;
        videoLink: string;
        fileSize: string;
        numberSpeaker: string;
        createdAt: string;
    }[]>([])


    useEffect(() => {
        const fetchdata = async () => {
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
                setContent(dat)
            } catch (error) {
                console.log(error)
            }
        }
        fetchdata()
    }, [])

    return (
        <div className="border-b border-gray-200 dark:border-gray-700">
            <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400">
                {tabs.map((tab) => (
                    <li key={tab.label} className="me-2">
                        <button
                            onClick={() => {
                                setActiveTab(tab.label)
                                if(tab.label === 'From local file') {
                                    setTypeFile("local")
                                } else if(tab.label === 'From Content Library') {
                                    setTypeFile("library")
                                } else {
                                    setTypeFile("transcript")
                                }
                            }}
                            className={`inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg group ${activeTab === tab.label
                                ? 'text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500'
                                : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
                                }`}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    </li>
                ))}
            </ul>

            <div className="mt-4 p-4">
                {activeTab === 'From local file' && (
                    <div className="flex items-center justify-center w-full">
                        <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                </svg>
                                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">MP3, WAV, M4A, MP4   (MAX. 30min)</p>
                            </div>
                            <input id="dropzone-file" onChange={(e) => setFile(e.target.files![0])} type="file" className="hidden" accept="audio/mp3, audio/wav, audio/m4a, video/mp4" />
                        </label>
                    </div>
                )}
                {activeTab === 'From Content Library' && (
                    <div className='-translate-y-8'>
                        <Label className='pb-2'>Select Content :</Label>
                        <Select>
                             <SelectTrigger className="w-[20rem] mt-2">
                                <SelectValue placeholder="Select content from library" />
                            </SelectTrigger>
                            <SelectContent>
                                { content.map((item) => (
                                    <SelectItem key={item.id} value={item.id}><span>{item.name}</span> {item.audioLink !== null && <span className='text-gray-400 ml-3'>({item.audioLink})</span>} {item.videoLink !== null && <span className='text-gray-400'>({item.videoLink})</span>}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}
                {activeTab === 'From Transcript' && (
                    <div className='flex flex-col gap-3'>
                        <Label>Upload transcript file (JSON)</Label>
                        <Input onChange={(e) => setFile(e.target.files![0])} type="file" className='mt-2' />
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-300" id="file_input_help">You can have json from <Link href='/transcription' className='font-semibold text-blue-600 underline'>transcription </Link>page</p>
                    </div>
                )}
            </div>
        </div>
    );
}
