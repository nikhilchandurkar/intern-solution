import type React from "react"
import { useState } from "react"
import { collection, addDoc } from "firebase/firestore"
import { db } from "../lib/firebase"
import { useAuth } from "../contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

const TicketForm: React.FC = () => {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "",
    category: "",
    contactEmail: "",
    phone: "",
    dueDate: "",
    attachmentUrl: "",
    isUrgent: false,
    preferredContact: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string) => (value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isUrgent: checked }))
  }

  const handleRadioChange = (value: string) => {
    setFormData((prev) => ({ ...prev, preferredContact: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await addDoc(collection(db, "tickets"), {
        ...formData,
        createdBy: user?.email,
        status: "Open",
        createdAt: new Date(),
      })
      // Reset form or show success message
    } catch (error) {
      console.error("Error adding ticket: ", error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" value={formData.description} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="priority">Priority</Label>
        <Select onValueChange={handleSelectChange("priority")}>
          <SelectTrigger>
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="category">Category</Label>
        <Select onValueChange={handleSelectChange("category")}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="technical">Technical</SelectItem>
            <SelectItem value="billing">Billing</SelectItem>
            <SelectItem value="general">General</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="contactEmail">Contact Email</Label>
        <Input
          id="contactEmail"
          name="contactEmail"
          type="email"
          value={formData.contactEmail}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} />
      </div>
      <div>
        <Label htmlFor="dueDate">Due Date</Label>
        <Input id="dueDate" name="dueDate" type="date" value={formData.dueDate} onChange={handleChange} />
      </div>
      <div>
        <Label htmlFor="attachmentUrl">Attachment URL</Label>
        <Input
          id="attachmentUrl"
          name="attachmentUrl"
          type="url"
          value={formData.attachmentUrl}
          onChange={handleChange}
        />
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="isUrgent" checked={formData.isUrgent} onCheckedChange={handleCheckboxChange} />
        <Label htmlFor="isUrgent">Is this ticket urgent?</Label>
      </div>
      <div>
        <Label>Preferred Contact Method</Label>
        <RadioGroup onValueChange={handleRadioChange} value={formData.preferredContact}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="email" id="email" />
            <Label htmlFor="email">Email</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="phone" id="phone" />
            <Label htmlFor="phone">Phone</Label>
          </div>
        </RadioGroup>
      </div>
      <Button type="submit">Submit Ticket</Button>
    </form>
  )
}

export default TicketForm

