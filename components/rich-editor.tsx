"use client"

import { useEditor, EditorContent, BubbleMenu, FloatingMenu } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Highlight from "@tiptap/extension-highlight"
import Typography from "@tiptap/extension-typography"
import Image from "@tiptap/extension-image"
import Link from "@tiptap/extension-link"
import TextAlign from "@tiptap/extension-text-align"
import Underline from "@tiptap/extension-underline"
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight"
import { lowlight } from "lowlight"
import Table from "@tiptap/extension-table"
import TableRow from "@tiptap/extension-table-row"
import TableCell from "@tiptap/extension-table-cell"
import TableHeader from "@tiptap/extension-table-header"
import { useState, useCallback, useEffect } from "react"
import {
  Bold,
  Italic,
  UnderlineIcon,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  ImageIcon,
  LinkIcon,
  Unlink,
  TableIcon,
  Undo,
  Redo,
  Quote,
  FileCode,
  Highlighter,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

interface RichEditorProps {
  initialValue: string
  onChange: (content: string) => void
  placeholder?: string
  editable?: boolean
}

export default function RichEditor({
  initialValue = "",
  onChange,
  placeholder = "Start writing...",
  editable = true,
}: RichEditorProps) {
  const [imageUrl, setImageUrl] = useState("")
  const [linkUrl, setLinkUrl] = useState("")
  const [linkText, setLinkText] = useState("")
  const [showLinkForm, setShowLinkForm] = useState(false)
  const [showImageForm, setShowImageForm] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Highlight,
      Typography,
      Underline,
      Image,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: initialValue,
    editable,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose dark:prose-invert focus:outline-none max-w-full",
      },
    },
  })

  useEffect(() => {
    if (editor && initialValue !== editor.getHTML()) {
      editor.commands.setContent(initialValue)
    }
  }, [initialValue, editor])

  const addImage = useCallback(() => {
    if (editor && imageUrl) {
      editor.chain().focus().setImage({ src: imageUrl }).run()
      setImageUrl("")
      setShowImageForm(false)
    }
  }, [editor, imageUrl])

  const setLink = useCallback(() => {
    if (editor && linkUrl) {
      // If text is selected, update the link on the selection
      if (editor.state.selection.content().size > 0) {
        editor.chain().focus().extendMarkRange("link").setLink({ href: linkUrl }).run()
      }
      // If no text is selected but linkText is provided, insert new text with link
      else if (linkText) {
        editor.chain().focus().insertContent(`<a href="${linkUrl}">${linkText}</a>`).run()
      }
      // Otherwise just set the link on the current position
      else {
        editor.chain().focus().extendMarkRange("link").setLink({ href: linkUrl }).run()
      }

      setLinkUrl("")
      setLinkText("")
      setShowLinkForm(false)
    }
  }, [editor, linkUrl, linkText])

  const addTable = useCallback(() => {
    if (editor) {
      editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
    }
  }, [editor])

  if (!editor) {
    return null
  }

  return (
    <div className="border rounded-md">
      <div className="bg-muted p-2 flex flex-wrap gap-1 items-center border-b">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={cn(editor.isActive("bold") ? "bg-muted-foreground/20" : "")}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={cn(editor.isActive("italic") ? "bg-muted-foreground/20" : "")}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={cn(editor.isActive("underline") ? "bg-muted-foreground/20" : "")}
        >
          <UnderlineIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={cn(editor.isActive("strike") ? "bg-muted-foreground/20" : "")}
        >
          <Strikethrough className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          className={cn(editor.isActive("highlight") ? "bg-muted-foreground/20" : "")}
        >
          <Highlighter className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="mx-1 h-6" />

        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={cn(editor.isActive("heading", { level: 1 }) ? "bg-muted-foreground/20" : "")}
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={cn(editor.isActive("heading", { level: 2 }) ? "bg-muted-foreground/20" : "")}
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={cn(editor.isActive("heading", { level: 3 }) ? "bg-muted-foreground/20" : "")}
        >
          <Heading3 className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="mx-1 h-6" />

        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={cn(editor.isActive("bulletList") ? "bg-muted-foreground/20" : "")}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={cn(editor.isActive("orderedList") ? "bg-muted-foreground/20" : "")}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={cn(editor.isActive("blockquote") ? "bg-muted-foreground/20" : "")}
        >
          <Quote className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="mx-1 h-6" />

        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={cn(editor.isActive({ textAlign: "left" }) ? "bg-muted-foreground/20" : "")}
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={cn(editor.isActive({ textAlign: "center" }) ? "bg-muted-foreground/20" : "")}
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={cn(editor.isActive({ textAlign: "right" }) ? "bg-muted-foreground/20" : "")}
        >
          <AlignRight className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          className={cn(editor.isActive({ textAlign: "justify" }) ? "bg-muted-foreground/20" : "")}
        >
          <AlignJustify className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="mx-1 h-6" />

        <Popover open={showImageForm} onOpenChange={setShowImageForm}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon">
              <ImageIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-2">
              <h4 className="font-medium">Insert Image</h4>
              <Input
                type="url"
                placeholder="Image URL"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => setShowImageForm(false)}>
                  Cancel
                </Button>
                <Button size="sm" onClick={addImage}>
                  Insert
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <Popover open={showLinkForm} onOpenChange={setShowLinkForm}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className={cn(editor.isActive("link") ? "bg-muted-foreground/20" : "")}>
              <LinkIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-2">
              <h4 className="font-medium">Insert Link</h4>
              <Input type="url" placeholder="URL" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} />
              <Input
                type="text"
                placeholder="Text (optional)"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => setShowLinkForm(false)}>
                  Cancel
                </Button>
                <Button size="sm" onClick={setLink}>
                  Insert
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {editor.isActive("link") && (
          <Button variant="ghost" size="icon" onClick={() => editor.chain().focus().unsetLink().run()}>
            <Unlink className="h-4 w-4" />
          </Button>
        )}

        <Button variant="ghost" size="icon" onClick={addTable}>
          <TableIcon className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={cn(editor.isActive("codeBlock") ? "bg-muted-foreground/20" : "")}
        >
          <FileCode className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="mx-1 h-6" />

        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>

      <div className="p-4 min-h-[300px]">
        <EditorContent editor={editor} />
      </div>

      {editor.isActive("table") && (
        <div className="bg-muted p-2 border-t flex gap-2">
          <Button variant="outline" size="sm" onClick={() => editor.chain().focus().addColumnBefore().run()}>
            Add Column Before
          </Button>
          <Button variant="outline" size="sm" onClick={() => editor.chain().focus().addColumnAfter().run()}>
            Add Column After
          </Button>
          <Button variant="outline" size="sm" onClick={() => editor.chain().focus().deleteColumn().run()}>
            Delete Column
          </Button>
          <Button variant="outline" size="sm" onClick={() => editor.chain().focus().addRowBefore().run()}>
            Add Row Before
          </Button>
          <Button variant="outline" size="sm" onClick={() => editor.chain().focus().addRowAfter().run()}>
            Add Row After
          </Button>
          <Button variant="outline" size="sm" onClick={() => editor.chain().focus().deleteRow().run()}>
            Delete Row
          </Button>
          <Button variant="outline" size="sm" onClick={() => editor.chain().focus().deleteTable().run()}>
            Delete Table
          </Button>
        </div>
      )}

      {/* Bubble menu for selected text */}
      {editor && (
        <BubbleMenu
          editor={editor}
          tippyOptions={{ duration: 100 }}
          className="bg-background rounded-md shadow-md p-1 flex gap-1 border"
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={cn(editor.isActive("bold") ? "bg-muted-foreground/20" : "")}
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={cn(editor.isActive("italic") ? "bg-muted-foreground/20" : "")}
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={cn(editor.isActive("underline") ? "bg-muted-foreground/20" : "")}
          >
            <UnderlineIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={cn(editor.isActive("strike") ? "bg-muted-foreground/20" : "")}
          >
            <Strikethrough className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            className={cn(editor.isActive("highlight") ? "bg-muted-foreground/20" : "")}
          >
            <Highlighter className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={cn(editor.isActive("code") ? "bg-muted-foreground/20" : "")}
          >
            <Code className="h-4 w-4" />
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(editor.isActive("link") ? "bg-muted-foreground/20" : "")}
              >
                <LinkIcon className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-2">
                <h4 className="font-medium">Insert Link</h4>
                <Input type="url" placeholder="URL" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} />
                <div className="flex justify-end gap-2">
                  <Button size="sm" onClick={setLink}>
                    Insert
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </BubbleMenu>
      )}

      {/* Floating menu for empty lines */}
      {editor && (
        <FloatingMenu
          editor={editor}
          tippyOptions={{ duration: 100 }}
          className="bg-background rounded-md shadow-md p-1 flex flex-col gap-1 border"
        >
          <Button
            variant="ghost"
            size="sm"
            className="justify-start"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          >
            <Heading1 className="h-4 w-4 mr-2" />
            Heading 1
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="justify-start"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          >
            <Heading2 className="h-4 w-4 mr-2" />
            Heading 2
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="justify-start"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            <List className="h-4 w-4 mr-2" />
            Bullet List
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="justify-start"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            <ListOrdered className="h-4 w-4 mr-2" />
            Numbered List
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="justify-start"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          >
            <FileCode className="h-4 w-4 mr-2" />
            Code Block
          </Button>
        </FloatingMenu>
      )}
    </div>
  )
}
