import type { Server as NetServer } from "http"
import { Server as SocketIOServer } from "socket.io"
import type { NextApiRequest } from "next"
import type { NextApiResponse } from "next"

export type NextApiResponseWithSocket = NextApiResponse & {
  socket: {
    server: NetServer & {
      io?: SocketIOServer
    }
  }
}

export const initSocket = (req: NextApiRequest, res: NextApiResponseWithSocket) => {
  if (!res.socket.server.io) {
    const io = new SocketIOServer(res.socket.server)
    res.socket.server.io = io

    io.on("connection", (socket) => {
      console.log("Client connected:", socket.id)

      // Join webinar room
      socket.on("join-webinar", (webinarId: string) => {
        socket.join(`webinar-${webinarId}`)
        console.log(`Socket ${socket.id} joined webinar-${webinarId}`)
      })

      // Leave webinar room
      socket.on("leave-webinar", (webinarId: string) => {
        socket.leave(`webinar-${webinarId}`)
        console.log(`Socket ${socket.id} left webinar-${webinarId}`)
      })

      // Send chat message
      socket.on("send-message", (data: { webinarId: string; message: string; user: any }) => {
        io.to(`webinar-${data.webinarId}`).emit("new-message", {
          id: new Date().getTime(),
          message: data.message,
          user: data.user,
          timestamp: new Date(),
        })
      })

      // Handle disconnect
      socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id)
      })
    })
  }

  return res.socket.server.io
}
