"use client"

import { Label } from "@/components/ui/label"

import { Badge } from "@/components/ui/badge"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { ArrowLeft, Plus, Save, Trash2, Upload, TrendingUp, TrendingDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const simulationSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  type: z.string().min(1, "Type is required"),
  difficulty: z.string().min(1, "Difficulty is required"),
  duration: z.coerce.number().int().min(1, "Duration must be at least 1 day"),
  initialCapital: z.coerce.number().min(1000, "Initial capital must be at least 1000"),
  status: z.string().min(1, "Status is required"),
  showLeaderboard: z.boolean().default(true),
  allowShortSelling: z.boolean().default(false),
})

export default function AdminSimulationEditPage() {
  const { id } = useParams()
  const isNew = id === "new"
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(!isNew)
  const [stocks, setStocks] = useState([])
  const [scenarios, setScenarios] = useState([])
  const [uploadingStocks, setUploadingStocks] = useState(false)

  const form = useForm({
    resolver: zodResolver(simulationSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "historical",
      difficulty: "beginner",
      duration: 30,
      initialCapital: 10000,
      status: "draft",
      showLeaderboard: true,
      allowShortSelling: false,
    },
  })

  useEffect(() => {
    if (!isNew) {
      fetchSimulationData()
    }
  }, [id, isNew])

  const fetchSimulationData = async () => {
    try {
      const response = await fetch(`/api/admin/simulations/${id}`)
      if (!response.ok) throw new Error("Failed to fetch simulation")

      const data = await response.json()
      const simulation = data.simulation

      form.reset({
        title: simulation.title,
        description: simulation.description,
        type: simulation.type,
        difficulty: simulation.difficulty,
        duration: simulation.duration,
        initialCapital: simulation.initialCapital,
        status: simulation.status,
        showLeaderboard: simulation.showLeaderboard !== false,
        allowShortSelling: simulation.allowShortSelling || false,
      })

      setStocks(simulation.stocks || [])
      setScenarios(simulation.scenarios || [])
    } catch (error) {
      console.error("Error fetching simulation:", error)
      toast({
        title: "Error",
        description: "Failed to load simulation data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = async (data) => {
    try {
      setIsLoading(true)

      if (stocks.length === 0) {
        toast({
          title: "Error",
          description: "You must add at least one stock to the simulation.",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      const simulationData = {
        ...data,
        stocks,
        scenarios,
      }

      const url = isNew ? "/api/admin/simulations" : `/api/admin/simulations/${id}`
      const method = isNew ? "POST" : "PUT"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(simulationData),
      })

      if (!response.ok) throw new Error(`Failed to ${isNew ? "create" : "update"} simulation`)

      toast({
        title: "Success",
        description: `Simulation ${isNew ? "created" : "updated"} successfully.`,
      })

      router.push("/dashboard/admin/simulations")
    } catch (error) {
      console.error("Error saving simulation:", error)
      toast({
        title: "Error",
        description: `Failed to ${isNew ? "create" : "update"} simulation. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleUploadStocks = async (e) => {
    e.preventDefault()
    setUploadingStocks(true)

    try {
      // In a real implementation, you would upload a CSV file with stock data
      // and process it. For this example, we'll simulate that.
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const sampleStocks = [
        {
          id: `stock-${Date.now()}-1`,
          symbol: "AAPL",
          name: "Apple Inc.",
          sector: "Technology",
          initialPrice: 150.25,
          volatility: "medium",
        },
        {
          id: `stock-${Date.now()}-2`,
          symbol: "MSFT",
          name: "Microsoft Corporation",
          sector: "Technology",
          initialPrice: 290.75,
          volatility: "low",
        },
        {
          id: `stock-${Date.now()}-3`,
          symbol: "AMZN",
          name: "Amazon.com Inc.",
          sector: "Consumer Cyclical",
          initialPrice: 135.5,
          volatility: "high",
        },
        {
          id: `stock-${Date.now()}-4`,
          symbol: "GOOGL",
          name: "Alphabet Inc.",
          sector: "Communication Services",
          initialPrice: 125.3,
          volatility: "medium",
        },
        {
          id: `stock-${Date.now()}-5`,
          symbol: "TSLA",
          name: "Tesla Inc.",
          sector: "Automotive",
          initialPrice: 245.8,
          volatility: "very-high",
        },
      ]

      setStocks(sampleStocks)

      toast({
        title: "Stocks Added",
        description: "Sample stocks have been added to the simulation.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add stocks. Please try again.",
        variant: "destructive",
      })
    } finally {
      setUploadingStocks(false)
    }
  }

  const addScenario = () => {
    const newScenario = {
      id: `scenario-${Date.now()}`,
      title: "New Market Scenario",
      description: "Description of the market scenario",
      day: scenarios.length + 1,
      impact: "medium",
      affectedSectors: ["Technology"],
      priceChange: {
        min: -5,
        max: 5,
      },
    }

    setScenarios([...scenarios, newScenario])
  }

  const removeScenario = (scenarioId) => {
    setScenarios(scenarios.filter((s) => s.id !== scenarioId))
  }

  const updateScenario = (scenarioId, field, value) => {
    setScenarios(scenarios.map((s) => (s.id === scenarioId ? { ...s, [field]: value } : s)))
  }

  const removeStock = (stockId) => {
    setStocks(stocks.filter((s) => s.id !== stockId))
  }

  if (isLoading && !isNew) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <a href="/dashboard/admin/simulations">
              <ArrowLeft className="h-5 w-5" />
            </a>
          </Button>
          <h1 className="text-2xl font-bold">{isNew ? "Create New Simulation" : "Edit Simulation"}</h1>
        </div>
        <Button onClick={form.handleSubmit(onSubmit)} disabled={isLoading}>
          <Save className="mr-2 h-4 w-4" />
          {isNew ? "Create Simulation" : "Save Changes"}
        </Button>
      </div>

      <Tabs defaultValue="basic">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="stocks">Stocks</TabsTrigger>
          <TabsTrigger value="scenarios">Market Scenarios</TabsTrigger>
        </TabsList>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <TabsContent value="basic" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>Enter the basic information about the market simulation.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Simulation Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter simulation title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Brief description of the simulation"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Simulation Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="historical">Historical Data</SelectItem>
                              <SelectItem value="scenario">Scenario-Based</SelectItem>
                              <SelectItem value="realtime">Real-time Simulation</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>The type of market simulation</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="difficulty"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Difficulty Level</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a difficulty" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="beginner">Beginner</SelectItem>
                              <SelectItem value="intermediate">Intermediate</SelectItem>
                              <SelectItem value="advanced">Advanced</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="duration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Duration (days)</FormLabel>
                          <FormControl>
                            <Input type="number" min="1" {...field} />
                          </FormControl>
                          <FormDescription>Number of trading days in the simulation</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="initialCapital"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Initial Capital ($)</FormLabel>
                          <FormControl>
                            <Input type="number" min="1000" step="1000" {...field} />
                          </FormControl>
                          <FormDescription>Starting amount for each student</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="published">Published</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>Only published simulations are visible to students</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="showLeaderboard"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Show Leaderboard</FormLabel>
                            <FormDescription>Display student rankings during the simulation</FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="allowShortSelling"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Allow Short Selling</FormLabel>
                            <FormDescription>Enable short selling of stocks</FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="stocks" className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Stocks</CardTitle>
                    <CardDescription>Add stocks to the simulation.</CardDescription>
                  </div>
                  <Button onClick={handleUploadStocks} type="button" disabled={uploadingStocks}>
                    {uploadingStocks ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Stocks
                      </>
                    )}
                  </Button>
                </CardHeader>
                <CardContent>
                  {stocks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-8">
                      <h3 className="text-lg font-medium">No Stocks Yet</h3>
                      <p className="text-sm text-muted-foreground mb-4">Upload a list of stocks for the simulation.</p>
                      <Button onClick={handleUploadStocks} type="button" disabled={uploadingStocks}>
                        {uploadingStocks ? (
                          <>
                            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="mr-2 h-4 w-4" />
                            Upload Stocks
                          </>
                        )}
                      </Button>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Symbol</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Sector</TableHead>
                          <TableHead>Initial Price</TableHead>
                          <TableHead>Volatility</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {stocks.map((stock) => (
                          <TableRow key={stock.id}>
                            <TableCell className="font-medium">{stock.symbol}</TableCell>
                            <TableCell>{stock.name}</TableCell>
                            <TableCell>{stock.sector}</TableCell>
                            <TableCell>${stock.initialPrice.toFixed(2)}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  stock.volatility === "low"
                                    ? "outline"
                                    : stock.volatility === "medium"
                                      ? "secondary"
                                      : stock.volatility === "high"
                                        ? "default"
                                        : "destructive"
                                }
                              >
                                {stock.volatility}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm" onClick={() => removeStock(stock.id)} type="button">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="scenarios" className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Market Scenarios</CardTitle>
                    <CardDescription>Create market events that affect stock prices.</CardDescription>
                  </div>
                  <Button onClick={addScenario} type="button">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Scenario
                  </Button>
                </CardHeader>
                <CardContent className="space-y-6">
                  {scenarios.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-8">
                      <h3 className="text-lg font-medium">No Scenarios Yet</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Add market scenarios to make the simulation more realistic.
                      </p>
                      <Button onClick={addScenario} type="button">
                        <Plus className="mr-2 h-4 w-4" />
                        Add First Scenario
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {scenarios.map((scenario, index) => (
                        <Card key={scenario.id} className="border-2">
                          <CardHeader className="flex flex-row items-center justify-between bg-muted/50 py-3">
                            <div className="flex items-center gap-2">
                              <CardTitle className="text-base">Scenario {index + 1}</CardTitle>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => removeScenario(scenario.id)} type="button">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </CardHeader>
                          <CardContent className="space-y-4 pt-4">
                            <div className="space-y-2">
                              <Label>Scenario Title</Label>
                              <Input
                                value={scenario.title}
                                onChange={(e) => updateScenario(scenario.id, "title", e.target.value)}
                                placeholder="Enter scenario title"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label>Description</Label>
                              <Textarea
                                value={scenario.description}
                                onChange={(e) => updateScenario(scenario.id, "description", e.target.value)}
                                placeholder="Describe the market scenario"
                              />
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                              <div className="space-y-2">
                                <Label>Day</Label>
                                <Input
                                  type="number"
                                  min="1"
                                  value={scenario.day}
                                  onChange={(e) => updateScenario(scenario.id, "day", Number.parseInt(e.target.value))}
                                />
                              </div>

                              <div className="space-y-2">
                                <Label>Impact</Label>
                                <Select
                                  value={scenario.impact}
                                  onValueChange={(value) => updateScenario(scenario.id, "impact", value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label>Price Change Range (%)</Label>
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                  <TrendingDown className="h-4 w-4 text-destructive" />
                                  <Input
                                    type="number"
                                    value={scenario.priceChange.min}
                                    onChange={(e) =>
                                      updateScenario(scenario.id, "priceChange", {
                                        ...scenario.priceChange,
                                        min: Number.parseFloat(e.target.value),
                                      })
                                    }
                                    className="w-20"
                                  />
                                </div>
                                <span>to</span>
                                <div className="flex items-center gap-2">
                                  <TrendingUp className="h-4 w-4 text-green-500" />
                                  <Input
                                    type="number"
                                    value={scenario.priceChange.max}
                                    onChange={(e) =>
                                      updateScenario(scenario.id, "priceChange", {
                                        ...scenario.priceChange,
                                        max: Number.parseFloat(e.target.value),
                                      })
                                    }
                                    className="w-20"
                                  />
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </form>
        </Form>
      </Tabs>
    </div>
  )
}
