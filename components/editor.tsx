"use client"

import dynamic from "next/dynamic"

// Dynamically import the RichEditor to avoid SSR issues
const RichEditor = dynamic(() => import("./rich-editor"), {
  ssr: false,
  loading: () => <div className="border rounded-md p-4 min-h-[300px] animate-pulse bg-muted/20"></div>,
})

interface EditorProps {
  initialValue: string
  onChange: (content: string) => void
}

export default function Editor({ initialValue = "", onChange }: EditorProps) {
  return <RichEditor initialValue={initialValue} onChange={onChange} />
}
