"use client"

import { AdminLayout } from "@/components/AdminLayout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Edit, CheckCircle } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import React, { useState } from "react"
import { useToast } from "@/hooks/use-toast"


const patientJourneyData = [
  { id: "p-001", name: "Alice Johnson", nationality: "Turkish", currentStep: "Waiting for Doctor", details: "Assigned to Healthcare Queue", issues: 0 },
  { id: "p-002", name: "Bob Williams", nationality: "Iraqi", currentStep: "In Consultation", details: "With Dr. Smith", issues: 1 },
  { id: "p-003", name: "Carol White", nationality: "Pakistani", currentStep: "Waiting for Lab", details: "Code LB9901", issues: 0 },
  { id: "p-004", name: "David Green", nationality: "Iranian", currentStep: "Completed", details: "Feedback requested", issues: 0 },
  { id: "p-005", name: "Eve Black", nationality: "Turkish", currentStep: "Registration", details: "New patient", issues: 2 },
];

export default function ChairmanPage() {
    const { toast } = useToast();
    const [journeys, setJourneys] = useState(patientJourneyData);
    const [selectedPatient, setSelectedPatient] = useState<(typeof patientJourneyData)[0] | null>(null);

    const handleEdit = (patient: (typeof patientJourneyData)[0]) => {
        setSelectedPatient(patient);
    }
    
    const handleResolveIssue = (patientId: string) => {
        setJourneys(journeys.map(p => p.id === patientId ? {...p, issues: 0} : p));
        toast({
            title: "Issue Resolved",
            description: "The issue has been marked as resolved.",
        })
    }

    const handleSaveChanges = () => {
        if (!selectedPatient) return;
        setJourneys(journeys.map(p => p.id === selectedPatient.id ? selectedPatient : p));
        toast({
            title: "Changes Saved",
            description: `Details for ${selectedPatient.name} have been updated.`,
        });
        setSelectedPatient(null);
    }


  return (
    <AdminLayout>
      <div className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Chairman's Dashboard</h1>
        <Card>
            <CardHeader>
                <CardTitle>Patient Journey Overview</CardTitle>
                <CardDescription>Monitor and manage patient progress through the system.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Patient</TableHead>
                            <TableHead>Nationality</TableHead>
                            <TableHead>Current Step</TableHead>
                            <TableHead>Details</TableHead>
                             <TableHead>Issues</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {journeys.map(patient => (
                            <TableRow key={patient.id} className={patient.issues > 0 ? "bg-destructive/10" : ""}>
                                <TableCell className="font-medium">{patient.name}</TableCell>
                                <TableCell>{patient.nationality}</TableCell>
                                <TableCell><Badge variant="outline">{patient.currentStep}</Badge></TableCell>
                                <TableCell className="text-muted-foreground">{patient.details}</TableCell>
                                <TableCell>
                                    {patient.issues > 0 
                                        ? <Badge variant="destructive">{patient.issues} Flag(s)</Badge> 
                                        : <Badge variant="secondary">None</Badge>}
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => handleEdit(patient)}>
                                                <Edit className="mr-2 h-4 w-4" /> Edit Details
                                            </DropdownMenuItem>
                                             {patient.issues > 0 && (
                                                <DropdownMenuItem onClick={() => handleResolveIssue(patient.id)}>
                                                    <CheckCircle className="mr-2 h-4 w-4" /> Resolve Issues
                                                </DropdownMenuItem>
                                            )}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
      </div>

       <Dialog open={!!selectedPatient} onOpenChange={(isOpen) => !isOpen && setSelectedPatient(null)}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Patient Journey</DialogTitle>
                    <DialogDescription>
                       Manually adjust the details for {selectedPatient?.name}.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">Name</Label>
                        <Input id="name" value={selectedPatient?.name} onChange={(e) => setSelectedPatient(p => p ? {...p, name: e.target.value} : null)} className="col-span-3" />
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="currentStep" className="text-right">Current Step</Label>
                        <Input id="currentStep" value={selectedPatient?.currentStep}  onChange={(e) => setSelectedPatient(p => p ? {...p, currentStep: e.target.value} : null)} className="col-span-3" />
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="details" className="text-right">Details</Label>
                        <Input id="details" value={selectedPatient?.details}  onChange={(e) => setSelectedPatient(p => p ? {...p, details: e.target.value} : null)} className="col-span-3" />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setSelectedPatient(null)}>Cancel</Button>
                    <Button onClick={handleSaveChanges}>Save Changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

    </AdminLayout>
  )
}
