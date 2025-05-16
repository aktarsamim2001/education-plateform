"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { ArrowLeft, Plus, Save, Trash2, GripVertical, Check, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

const quizSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  moduleId: z.string().min(1, "Module is required"),
  timeLimit: z.coerce.number().int().min(0, "Time limit must be a positive number or 0 for no limit"),
  passingScore: z.coerce.number().int().min(0).max(100, "Passing score must be between 0 and 100"),
  status: z.string().min(1, "Status is required"),
  showCorrectAnswers: z.boolean().default(true),
  randomizeQuestions: z.boolean().default(false),
})

export default function AdminQuizEditPage() {
  const { id } = useParams()
  const isNew = id === "new"
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(!isNew)
  const [modules, setModules] = useState([])
  const [questions, setQuestions] = useState([])

  const form = useForm({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      title: "",
      description: "",
      moduleId: "",
      timeLimit: 0,
      passingScore: 70,
      status: "draft",
      showCorrectAnswers: true,
      randomizeQuestions: false,
    },
  })

  useEffect(() => {
    fetchModules()
    if (!isNew) {
      fetchQuizData()
    }
  }, [id, isNew])

  const fetchModules = async () => {
    try {
      const response = await fetch("/api/admin/modules")
      if (!response.ok) throw new Error("Failed to fetch modules")
      const data = await response.json()
      setModules(data.modules)
    } catch (error) {
      console.error("Error fetching modules:", error)
      toast({
        title: "Error",
        description: "Failed to load modules. Please try again.",
        variant: "destructive",
      })
    }
  }

  const fetchQuizData = async () => {
    try {
      const response = await fetch(`/api/admin/quizzes/${id}`)
      if (!response.ok) throw new Error("Failed to fetch quiz")

      const data = await response.json()
      const quiz = data.quiz

      form.reset({
        title: quiz.title,
        description: quiz.description,
        moduleId: quiz.moduleId,
        timeLimit: quiz.timeLimit || 0,
        passingScore: quiz.passingScore || 70,
        status: quiz.status,
        showCorrectAnswers: quiz.showCorrectAnswers !== false,
        randomizeQuestions: quiz.randomizeQuestions || false,
      })

      setQuestions(quiz.questions || [])
    } catch (error) {
      console.error("Error fetching quiz:", error)
      toast({
        title: "Error",
        description: "Failed to load quiz data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = async (data) => {
    try {
      setIsLoading(true)

      if (questions.length === 0) {
        toast({
          title: "Error",
          description: "You must add at least one question to the quiz.",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      const quizData = {
        ...data,
        questions,
      }

      const url = isNew ? "/api/admin/quizzes" : `/api/admin/quizzes/${id}`
      const method = isNew ? "POST" : "PUT"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(quizData),
      })

      if (!response.ok) throw new Error(`Failed to ${isNew ? "create" : "update"} quiz`)

      toast({
        title: "Success",
        description: `Quiz ${isNew ? "created" : "updated"} successfully.`,
      })

      router.push("/dashboard/admin/quizzes")
    } catch (error) {
      console.error("Error saving quiz:", error)
      toast({
        title: "Error",
        description: `Failed to ${isNew ? "create" : "update"} quiz. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const addQuestion = () => {
    const newQuestion = {
      id: `question-${Date.now()}`,
      text: "New question",
      type: "multiple-choice",
      options: [
        { id: `option-${Date.now()}-1`, text: "Option 1", isCorrect: true },
        { id: `option-${Date.now()}-2`, text: "Option 2", isCorrect: false },
        { id: `option-${Date.now()}-3`, text: "Option 3", isCorrect: false },
        { id: `option-${Date.now()}-4`, text: "Option 4", isCorrect: false },
      ],
      explanation: "",
      points: 10,
    }

    setQuestions([...questions, newQuestion])
  }

  const removeQuestion = (questionId) => {
    setQuestions(questions.filter((q) => q.id !== questionId))
  }

  const updateQuestion = (questionId, field, value) => {
    setQuestions(questions.map((q) => (q.id === questionId ? { ...q, [field]: value } : q)))
  }

  const addOption = (questionId) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId) {
          return {
            ...q,
            options: [...q.options, { id: `option-${Date.now()}`, text: "New option", isCorrect: false }],
          }
        }
        return q
      }),
    )
  }

  const removeOption = (questionId, optionId) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId) {
          return {
            ...q,
            options: q.options.filter((o) => o.id !== optionId),
          }
        }
        return q
      }),
    )
  }

  const updateOption = (questionId, optionId, field, value) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId) {
          return {
            ...q,
            options: q.options.map((o) => (o.id === optionId ? { ...o, [field]: value } : o)),
          }
        }
        return q
      }),
    )
  }

  const setCorrectOption = (questionId, optionId) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId) {
          return {
            ...q,
            options: q.options.map((o) => ({ ...o, isCorrect: o.id === optionId })),
          }
        }
        return q
      }),
    )
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
            <a href="/dashboard/admin/quizzes">
              <ArrowLeft className="h-5 w-5" />
            </a>
          </Button>
          <h1 className="text-2xl font-bold">{isNew ? "Create New Quiz" : "Edit Quiz"}</h1>
        </div>
        <Button onClick={form.handleSubmit(onSubmit)} disabled={isLoading}>
          <Save className="mr-2 h-4 w-4" />
          {isNew ? "Create Quiz" : "Save Changes"}
        </Button>
      </div>

      <Tabs defaultValue="basic">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="questions">Questions</TabsTrigger>
        </TabsList>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <TabsContent value="basic" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>Enter the basic information about the quiz.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quiz Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter quiz title" {...field} />
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
                          <Textarea placeholder="Brief description of the quiz" className="resize-none" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="moduleId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Module</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a module" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {modules.map((module) => (
                              <SelectItem key={module.id} value={module.id}>
                                {module.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>The module this quiz belongs to</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="timeLimit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Time Limit (minutes)</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" {...field} />
                          </FormControl>
                          <FormDescription>Set to 0 for no time limit</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="passingScore"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Passing Score (%)</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" max="100" {...field} />
                          </FormControl>
                          <FormDescription>Minimum percentage to pass the quiz</FormDescription>
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
                        <FormDescription>Only published quizzes are visible to students</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="showCorrectAnswers"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Show Correct Answers</FormLabel>
                            <FormDescription>Show correct answers after quiz completion</FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="randomizeQuestions"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Randomize Questions</FormLabel>
                            <FormDescription>Show questions in random order</FormDescription>
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

            <TabsContent value="questions" className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Questions</CardTitle>
                    <CardDescription>Create and manage quiz questions.</CardDescription>
                  </div>
                  <Button onClick={addQuestion} type="button">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Question
                  </Button>
                </CardHeader>
                <CardContent className="space-y-6">
                  {questions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-8">
                      <h3 className="text-lg font-medium">No Questions Yet</h3>
                      <p className="text-sm text-muted-foreground mb-4">Add questions to your quiz.</p>
                      <Button onClick={addQuestion} type="button">
                        <Plus className="mr-2 h-4 w-4" />
                        Add First Question
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {questions.map((question, index) => (
                        <Card key={question.id} className="border-2">
                          <CardHeader className="flex flex-row items-center justify-between bg-muted/50 py-3">
                            <div className="flex items-center gap-2">
                              <GripVertical className="h-5 w-5 text-muted-foreground" />
                              <CardTitle className="text-base">Question {index + 1}</CardTitle>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => removeQuestion(question.id)} type="button">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </CardHeader>
                          <CardContent className="space-y-4 pt-4">
                            <div className="space-y-2">
                              <Label>Question Text</Label>
                              <Textarea
                                value={question.text}
                                onChange={(e) => updateQuestion(question.id, "text", e.target.value)}
                                placeholder="Enter your question"
                                className="min-h-[80px]"
                              />
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                              <div className="space-y-2">
                                <Label>Question Type</Label>
                                <Select
                                  value={question.type}
                                  onValueChange={(value) => updateQuestion(question.id, "type", value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                                    <SelectItem value="true-false">True/False</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="space-y-2">
                                <Label>Points</Label>
                                <Input
                                  type="number"
                                  min="1"
                                  value={question.points}
                                  onChange={(e) =>
                                    updateQuestion(question.id, "points", Number.parseInt(e.target.value))
                                  }
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <Label>Options</Label>
                                {question.type === "multiple-choice" && question.options.length < 6 && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => addOption(question.id)}
                                    type="button"
                                  >
                                    <Plus className="mr-2 h-3 w-3" />
                                    Add Option
                                  </Button>
                                )}
                              </div>

                              {question.type === "true-false" ? (
                                <RadioGroup
                                  value={question.options.find((o) => o.isCorrect)?.text === "True" ? "true" : "false"}
                                  onValueChange={(value) => {
                                    const newOptions = [
                                      { id: `option-${Date.now()}-1`, text: "True", isCorrect: value === "true" },
                                      { id: `option-${Date.now()}-2`, text: "False", isCorrect: value === "false" },
                                    ]
                                    updateQuestion(question.id, "options", newOptions)
                                  }}
                                  className="flex flex-col space-y-2"
                                >
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="true" id={`${question.id}-true`} />
                                    <Label htmlFor={`${question.id}-true`}>True</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="false" id={`${question.id}-false`} />
                                    <Label htmlFor={`${question.id}-false`}>False</Label>
                                  </div>
                                </RadioGroup>
                              ) : (
                                <div className="space-y-2">
                                  {question.options.map((option) => (
                                    <div key={option.id} className="flex items-center gap-2">
                                      <Button
                                        type="button"
                                        variant={option.isCorrect ? "default" : "outline"}
                                        size="icon"
                                        className="h-8 w-8 rounded-full"
                                        onClick={() => setCorrectOption(question.id, option.id)}
                                      >
                                        {option.isCorrect ? <Check className="h-4 w-4" /> : <div className="h-4 w-4" />}
                                      </Button>
                                      <Input
                                        value={option.text}
                                        onChange={(e) => updateOption(question.id, option.id, "text", e.target.value)}
                                        className="flex-1"
                                      />
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeOption(question.id, option.id)}
                                        disabled={question.options.length <= 2}
                                      >
                                        <X className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>

                            <div className="space-y-2">
                              <Label>Explanation (Optional)</Label>
                              <Textarea
                                value={question.explanation || ""}
                                onChange={(e) => updateQuestion(question.id, "explanation", e.target.value)}
                                placeholder="Explain the correct answer"
                              />
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
