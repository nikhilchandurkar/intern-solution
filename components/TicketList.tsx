import type React from "react"
import { useEffect, useState } from "react"
import { collection, query, where, onSnapshot } from "firebase/firestore"
import { db } from "../lib/firebase"
import { useAuth } from "../contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Ticket {
  id: string
  title: string
  description: string
  priority: string
  status: string
  createdBy: string
  assignedTo: string
}

const TicketList: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const { user } = useAuth()

  useEffect(() => {
    if (!user) return

    const q = user.email?.endsWith("@support.com")
      ? query(collection(db, "tickets"))
      : query(collection(db, "tickets"), where("createdBy", "==", user.email))

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const ticketsData: Ticket[] = []
      querySnapshot.forEach((doc) => {
        ticketsData.push({ id: doc.id, ...doc.data() } as Ticket)
      })
      setTickets(ticketsData)
    })

    return () => unsubscribe()
  }, [user])

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Support Tickets</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ticket ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created By</TableHead>
            <TableHead>Assigned To</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets.map((ticket) => (
            <TableRow key={ticket.id}>
              <TableCell>{ticket.id}</TableCell>
              <TableCell>{ticket.title}</TableCell>
              <TableCell>{ticket.description}</TableCell>
              <TableCell>{ticket.priority}</TableCell>
              <TableCell>{ticket.status}</TableCell>
              <TableCell>{ticket.createdBy}</TableCell>
              <TableCell>{ticket.assignedTo}</TableCell>
              <TableCell>
                <Button variant="outline" size="sm" className="mr-2">
                  View
                </Button>
                <Button variant="outline" size="sm" className="mr-2">
                  Edit
                </Button>
                {!user.email?.endsWith("@support.com") && (
                  <Button variant="outline" size="sm">
                    Delete
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default TicketList

