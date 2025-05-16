"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import dynamic from "next/dynamic"
import { EditorState } from "draft-js"
import type { EditorProps } from "react-draft-wysiwyg"
import { convertToHTML, convertFromHTML } from "draft-convert"
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"

// Dynamically import the editor to avoid SSR issues
const Editor = dynamic<EditorProps>(() => import("react-draft-wysiwyg").then((mod) => mod.Editor), { ssr: false })

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  readOnly?: boolean
  minHeight?: number
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Start typing...",
  readOnly = false,
  minHeight = 200,
}: RichTextEditorProps) {
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty())
  const [isClient, setIsClient] = useState(false)
  const editorRef = useRef<any>(null)

  // Initialize editor with HTML content
  useEffect(() => {
    setIsClient(true)
    if (value && value !== convertToHTML(editorState.getCurrentContent())) {
      const contentState = convertFromHTML(value)
      setEditorState(EditorState.createWithContent(contentState))
    }
  }, [])

  // Convert editor content to HTML when it changes
  const handleEditorChange = useCallback(
    (state: EditorState) => {
      setEditorState(state)
      const html = convertToHTML(state.getCurrentContent())
      onChange(html)
    },
    [onChange],
  )

  if (!isClient) {
    return (
      <div
        className="min-h-[200px] rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        style={{ minHeight }}
      >
        Loading editor...
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Editor
        editorState={editorState}
        onEditorStateChange={handleEditorChange}
        wrapperClassName="wrapper-class"
        editorClassName="editor-class"
        toolbarClassName="toolbar-class"
        toolbar={{
          options: [
            "inline",
            "blockType",
            "fontSize",
            "list",
            "textAlign",
            "link",
            "embedded",
            "emoji",
            "image",
            "history",
          ],
          inline: { inDropdown: false },
          list: { inDropdown: true },
          textAlign: { inDropdown: true },
          link: { inDropdown: true },
          history: { inDropdown: false },
        }}
        placeholder={placeholder}
        readOnly={readOnly}
        ref={editorRef}
        editorStyle={{ minHeight, padding: "0 1rem" }}
      />
    </div>
  )
}
