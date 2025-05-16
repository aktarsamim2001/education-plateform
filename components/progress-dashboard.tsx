"use client"

import { useState, useEffect } from "react"

interface ProgressStats {
  modules: {
    total: number
    completed: number
    percentage: number
  }
  quizzes: {
    total: number
    completed: number
    percentage: number
  }
  simulations: {
    total: number
    completed: number
    percentage: number
  }
  overall: number
}

interface ProgressData {
  modules: any[]
  quizzes: any[]
  simulations: any[]
}

export function ProgressDashboard() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<ProgressStats | null>(null)
  const [progressData, setProgressData] = useState<ProgressData | null>(null)

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await fetch('/api/student/progress')
        const data = await response.json()
        
        setStats(data.stats)
        setProgressData({
          modules: data.progress.modules,
          quizzes: data.progress.quizzes,\
