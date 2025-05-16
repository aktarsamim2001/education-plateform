import { type NextRequest, NextResponse } from "next/server"

export function GET(req: NextRequest) {
  // This route is just a placeholder for the socket.io connection
  // The actual socket.io server is initialized in pages/api/socket.ts
  return NextResponse.json({ message: "Socket.io server is running" })
}
