import type React from "react"
import { useRouter } from "next/router"
import { signOut } from "firebase/auth"
import { auth } from "../lib/firebase"
import { useAuth } from "../contexts/AuthContext"
import { Button } from "@/components/ui/button"

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter()
  const { user } = useAuth()

  const handleLogout = async () => {
    try {
      await signOut(auth)
      router.push("/login")
    } catch (error) {
      console.error("Failed to log out", error)
    }
  }

  if (!user) {
    router.push("/login")
    return null
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-md">
        <nav className="mt-5">
          <Button variant="ghost" className="w-full justify-start" onClick={() => router.push("/dashboard")}>
            Tickets
          </Button>
          <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
            Logout
          </Button>
        </nav>
      </aside>
      <main className="flex-1 p-10">{children}</main>
    </div>
  )
}

export default Layout

