"use client"

import { AdminLayout } from "@/components/AdminLayout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import React from "react"
import { useToast } from "@/hooks/use-toast"

const waitingPatientsData = [
  { id: "p-003", name: "Charlie Brown", service: "Healthcare", time: "10:32 AM", waitingFor: "15 mins" },
  { id: "p-004", name: "Diana Prince", service: "Dentistry", time: "10:35 AM", waitingFor: "12 mins" },
]

export default function DoctorPage() {
    const { toast } = useToast()
    const [waitingPatients, setWaitingPatients] = React.useState(waitingPatientsData)
    const [selectedPatient, setSelectedPatient] = React.useState<(typeof waitingPatientsData)[0] | null>(null);

    const handleAccept = (patient: (typeof waitingPatientsData)[0]) => {
        setSelectedPatient(patient);
    }
    
    const handleSubmitPrescription = () => {
        if (!selectedPatient) return;
        
        // In a real app, this would trigger backend operations.
        // Here, we'll just simulate the frontend changes.
        setWaitingPatients(prev => prev.filter(p => p.id !== selectedPatient.id));
        
        toast({
          title: "Patient Processed",
          description: `${selectedPatient.name} has been notified for their next service.`,
        })

        setSelectedPatient(null);
    }

  return (
    <AdminLayout>
        <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-tight">Doctor's Dashboard</h1>
            <div className="grid gap-8 pt-4">
                <Card>
                    <CardHeader>
                        <CardTitle>My Consultation Queue</CardTitle>
                        <CardDescription>Patients waiting to be seen.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Service</TableHead>
                                    <TableHead className="hidden sm:table-cell">Waiting Time</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {waitingPatients.length > 0 ? waitingPatients.map(patient => (
                                    <TableRow key={patient.id}>
                                        <TableCell className="font-medium">{patient.name}</TableCell>
                                        <TableCell><Badge variant="secondary">{patient.service}</Badge></TableCell>
                                        <TableCell className="hidden sm:table-cell text-muted-foreground">{patient.waitingFor}</TableCell>
                                        <TableCell className="text-right">
                                            <Button size="sm" onClick={() => handleAccept(patient)}>Accept Patient</Button>
                                        </TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center h-24">No patients waiting</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>

        <Dialog open={!!selectedPatient} onOpenChange={(isOpen) => !isOpen && setSelectedPatient(null)}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Consultation: {selectedPatient?.name}</DialogTitle>
                    <DialogDescription>
                       Record diagnosis and prescribe the next steps for the patient.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="prescription">Details & Prescription</Label>
                        <Textarea id="prescription" placeholder="e.g., Patient reports headache, prescribe Paracetamol..." rows={4} />
                    </div>
                    <div className="grid gap-3">
                         <Label>Required Service</Label>
                        <RadioGroup defaultValue="pharmacy" className="gap-2">
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="pharmacy" id="r1" />
                                <Label htmlFor="r1">Pharmacy (Drugs)</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="lab" id="r2" />
                                <Label htmlFor="r2">Lab Test</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="none" id="r4" />
                                <Label htmlFor="r4">None / Discharge</Label>
                            </div>
                        </RadioGroup>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setSelectedPatient(null)}>Cancel</Button>
                    <Button onClick={handleSubmitPrescription}>Submit & Notify Service</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </AdminLayout>
  )
}
