"use client"

import { AdminLayout } from "@/components/AdminLayout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const newPatients = [
  { id: "p-001", name: "Alice Johnson", phone: "555-0101", time: "2 minutes ago", nationality: "Turkish" },
  { id: "p-002", name: "Bob Williams", phone: "555-0102", time: "5 minutes ago", nationality: "Iraqi" },
  { id: "p-003", name: "Carol White", phone: "555-0103", time: "8 minutes ago", nationality: "Pakistani" },
]

const queue = [
  { id: "p-004", name: "David Green", service: "Healthcare", status: "Waiting for Doctor", time: "10:32 AM", nationality: "Iranian" },
  { id: "p-005", name: "Eve Black", service: "Dentistry", status: "Waiting for Doctor", time: "10:35 AM", nationality: "Turkish" },
]

export default function ReceptionPage() {
  return (
    <AdminLayout>
      <div className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Reception Dashboard</h1>
        <div className="grid gap-8 pt-4">
            <Card>
                <CardHeader>
                    <CardTitle>New Registrations</CardTitle>
                    <CardDescription>Patients who just registered and need to be assigned a service.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Nationality</TableHead>
                                <TableHead className="hidden sm:table-cell">Registered</TableHead>
                                <TableHead>Service</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {newPatients.map(patient => (
                                <TableRow key={patient.id}>
                                    <TableCell className="font-medium">{patient.name}</TableCell>
                                    <TableCell>{patient.nationality}</TableCell>
                                    <TableCell className="hidden sm:table-cell text-muted-foreground">{patient.time}</TableCell>
                                    <TableCell>
                                        <Select>
                                            <SelectTrigger className="w-full sm:w-[180px]">
                                                <SelectValue placeholder="Select service" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="healthcare">Healthcare</SelectItem>
                                                <SelectItem value="dentistry">Dentistry</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button size="sm">Add to Queue</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Active Queue</CardTitle>
                    <CardDescription>Patients currently waiting for services.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Nationality</TableHead>
                                <TableHead>Service</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {queue.map(patient => (
                                <TableRow key={patient.id}>
                                    <TableCell className="font-medium">{patient.name}</TableCell>
                                    <TableCell>{patient.nationality}</TableCell>
                                    <TableCell>{patient.service}</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary">{patient.status}</Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
      </div>
    </AdminLayout>
  )
}
