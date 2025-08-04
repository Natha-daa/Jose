import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function nodeStreamToWeb(nodeStream:any) {
  return new ReadableStream({
    async pull(controller) {
      for await (const chunk of nodeStream) {
        controller.enqueue(chunk);
      }
      controller.close();
    },
    cancel() {
      nodeStream.destroy();
    },
  });
}
