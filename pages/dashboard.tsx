import type React from "react"
import { useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import Layout from "../components/Layout"
import TicketList from "../components/TicketList"
import TicketForm from "../components/TicketForm"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

const Dashboard: React.FC = () => {
  const { user } = useAuth()
  const [isFormOpen, setIsFormOpen] = useState(false)

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <Layout>
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Support Dashboard</h1>
        {!user.email?.endsWith("@support.com") && (
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button>Raise New Ticket</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Ticket</DialogTitle>
              </DialogHeader>
              <TicketForm />
            </DialogContent>
          </Dialog>
        )}
        <TicketList />
      </div>
    </Layout>
  )
}

export default Dashboard

