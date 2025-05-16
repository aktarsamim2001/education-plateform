"use client"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function StudentModulesPage() {
  const [modules, setModules] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const { toast } = useToast()

  useEffect(() => {
    fetchModules()
  }, [])

  const fetchModules = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/student/modules")
      if (!response.ok) throw new Error("Failed to fetch modules")
      const data = await response.json()
      setModules(data.modules)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load modules. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Filter modules based on search term and category
  const filteredModules = modules.filter((module) => {
    const matchesSearch = module.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || module.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  // Group modules by status
  const inProgressModules = filteredModules.filter((module) => module.progress > 0 && module.progress < 100)
  const completedModules = filteredModules.filter((module) => module.progress === 100)
  const notStartedModules = filteredModules.filter((module) => module.progress === 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Learning Modules</h1>
        <p className="text-muted-foreground">Access your learning materials and track your progress</p>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search modules..."
            className="w-full pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="technical-analysis">Technical Analysis</SelectItem>
            <SelectItem value="fundamental-analysis">Fundamental Analysis</SelectItem>
            <SelectItem value="trading-psychology">Trading Psychology</SelectItem>
            <SelectItem value="risk-management">Risk Management</SelectItem>
            <SelectItem value="options-trading">Options Trading</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Modules</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
            </div>
          ) : filteredModules.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-8">
              <h1></h1>
            </div>\
