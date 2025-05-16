"use client"

import { useState } from "react"
import { Accessibility, Eye, ZoomIn, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useA11y } from "@/components/a11y-provider"

export function A11ySettings() {
  const [open, setOpen] = useState(false)
  const { highContrast, toggleHighContrast, largeText, toggleLargeText, reducedMotion, toggleReducedMotion } = useA11y()

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="fixed bottom-4 right-4 z-50 rounded-full">
          <Accessibility className="h-5 w-5" />
          <span className="sr-only">Accessibility Settings</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Accessibility Settings</DialogTitle>
          <DialogDescription>
            Customize your experience to make the site more accessible for your needs.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-between space-x-2">
            <div className="flex items-center space-x-2">
              <Eye className="h-4 w-4" />
              <Label htmlFor="high-contrast">High Contrast</Label>
            </div>
            <Switch id="high-contrast" checked={highContrast} onCheckedChange={toggleHighContrast} />
          </div>
          <div className="flex items-center justify-between space-x-2">
            <div className="flex items-center space-x-2">
              <ZoomIn className="h-4 w-4" />
              <Label htmlFor="large-text">Large Text</Label>
            </div>
            <Switch id="large-text" checked={largeText} onCheckedChange={toggleLargeText} />
          </div>
          <div className="flex items-center justify-between space-x-2">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-4 w-4" />
              <Label htmlFor="reduced-motion">Reduced Motion</Label>
            </div>
            <Switch id="reduced-motion" checked={reducedMotion} onCheckedChange={toggleReducedMotion} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
