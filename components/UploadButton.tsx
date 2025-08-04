"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Upload, Link as LinkIcon, Cloud, FolderOpen } from "lucide-react";
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
import { Input } from "@/components/ui/input"

export default function UploadVideoDropdown() {
  const [ytlink, setYtlink] = useState("");
  const handleUploadOption = (option: string) => {
    switch (option) {
      case "link":
        // Logique pour ouvrir une modal ou input de lien
        console.log("Uploader via lien direct");
        break;
      case "gdrive":
        // Logique pour intégrer Google Drive Picker
        console.log("Uploader via Google Drive");
        break;
      case "dropbox":
        // Logique pour intégrer Dropbox Chooser
        console.log("Uploader via Dropbox");
        break;
      default:
        break;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Upload className="mr-2 h-4 w-4" />
          Import from provider
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem onClick={() => handleUploadOption("link")}>
          <LinkIcon className="mr-2 h-4 w-4" />
          Import using link
          {/* <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline"><LinkIcon className="w-4 h-4 mr-2" />
                  Import using link</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Link</DialogTitle>
                  <DialogDescription>
                    Enter a short url video youtube link
                  </DialogDescription>
                </DialogHeader>
                <div className="flex items-center gap-2">
                  <div className="grid flex-1 gap-2">
                    <Label htmlFor="link" className="sr-only">
                      Link
                    </Label>
                    <Input
                      id="link"
                      placeholder="paste youtube video link here"
                      value={ytlink}
                      onChange={(e:any) => setYtlink(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter className="sm:justify-center">
                  <DialogClose asChild>
                    <Button type="button" onClick={(e) => setYtlink("")} variant="destructive">
                      Cancel
                    </Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button type="button" variant="secondary" className="my-2">
                      Import
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog> */}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleUploadOption("gdrive")}>
          <Cloud className="mr-2 h-4 w-4" />
          Using Google Drive
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleUploadOption("dropbox")}>
          <FolderOpen className="mr-2 h-4 w-4" />
          Using Dropbox
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
