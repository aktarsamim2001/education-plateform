import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"

// Student courses queries
export const useStudentCourses = () => {
  return useQuery({
    queryKey: ["studentCourses"],
    queryFn: async () => {
      const { data } = await axios.get("/api/student/courses")
      return data.courses
    },
  })
}

export const useStudentCourseDetail = (slug: string) => {
  return useQuery({
    queryKey: ["studentCourse", slug],
    queryFn: async () => {
      const { data } = await axios.get(`/api/student/courses/${slug}`)
      return data.course
    },
    enabled: !!slug,
  })
}

// Student webinars queries
export const useStudentWebinars = () => {
  return useQuery({
    queryKey: ["studentWebinars"],
    queryFn: async () => {
      const { data } = await axios.get("/api/student/webinars")
      return data.webinars
    },
  })
}

export const useStudentWebinarDetail = (slug: string) => {
  return useQuery({
    queryKey: ["studentWebinar", slug],
    queryFn: async () => {
      const { data } = await axios.get(`/api/student/webinars/${slug}`)
      return data.webinar
    },
    enabled: !!slug,
  })
}

// Student progress query
export const useStudentProgress = () => {
  return useQuery({
    queryKey: ["studentProgress"],
    queryFn: async () => {
      const { data } = await axios.get("/api/student/progress")
      return data.progress
    },
  })
}

// Student instructor query
export const useStudentInstructor = () => {
  return useQuery({
    queryKey: ["studentInstructor"],
    queryFn: async () => {
      const { data } = await axios.get("/api/student/instructor")
      return data.instructor
    },
  })
}

// Student profile query and mutation
export const useStudentProfile = () => {
  return useQuery({
    queryKey: ["studentProfile"],
    queryFn: async () => {
      const { data } = await axios.get("/api/student/profile")
      return data.profile
    },
  })
}

export const useUpdateStudentProfile = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (profileData: any) => {
      const { data } = await axios.put("/api/student/profile", profileData)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["studentProfile"] })
    },
  })
}

// Student settings query and mutation
export const useStudentSettings = () => {
  return useQuery({
    queryKey: ["studentSettings"],
    queryFn: async () => {
      const { data } = await axios.get("/api/student/settings")
      return data.settings
    },
  })
}

export const useUpdateStudentSettings = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (settingsData: any) => {
      const { data } = await axios.put("/api/student/settings", settingsData)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["studentSettings"] })
    },
  })
}

// Blog queries
export const useBlogs = () => {
  return useQuery({
    queryKey: ["blogs"],
    queryFn: async () => {
      const { data } = await axios.get("/api/blogs")
      return data.blogs
    },
  })
}

export const useBlogDetail = (slug: string) => {
  return useQuery({
    queryKey: ["blog", slug],
    queryFn: async () => {
      const { data } = await axios.get(`/api/blogs/${slug}`)
      return data.blog
    },
    enabled: !!slug,
  })
}

// Payment mutations
export const useCreateOrder = () => {
  return useMutation({
    mutationFn: async (orderData: { amount: number; currency: string; receipt: string; notes: any }) => {
      const { data } = await axios.post("/api/payments/create-order", orderData)
      return data
    },
  })
}

export const useVerifyPayment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (paymentData: {
      razorpay_order_id: string
      razorpay_payment_id: string
      razorpay_signature: string
    }) => {
      const { data } = await axios.post("/api/payments/verify", paymentData)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["studentCourses"] })
      queryClient.invalidateQueries({ queryKey: ["studentWebinars"] })
    },
  })
}
