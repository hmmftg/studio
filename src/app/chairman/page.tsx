"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Edit, CheckCircle, AlertTriangle } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
import { getCountryFlag } from "@/components/CountryFlag"
import { Textarea } from "@/components/ui/textarea"

const patientJourneyData = [
  { id: "p-001", name: "Alice Johnson", nationality: "Turkish", currentStep: "Waiting for Doctor", details: "Assigned to Healthcare Queue", issues: 0, doctorId: "d-001", notes: "", emergency: false },
  { id: "p-002", name: "Bob Williams", nationality: "Iraqi", currentStep: "In Consultation", details: "With Dr. Smith", issues: 1, doctorId: "d-001", notes: "Patient is anxious.", emergency: false },
  { id: "p-003", name: "Carol White", nationality: "Pakistani", currentStep: "Waiting for Lab", details: "Code LB9901", issues: 0, doctorId: "d-002", notes: "", emergency: true },
  { id: "p-004", name: "David Green", nationality: "Iranian", currentStep: "Completed", details: "Feedback requested", issues: 0, doctorId: "d-002", notes: "", emergency: false },
  { id: "p-005", name: "Eve Black", nationality: "Turkish", currentStep: "Registration", details: "New patient", issues: 2, doctorId: null, notes: "", emergency: false },
];

const initialDoctors = [
    { id: "d-001", name: "Dr. Smith", status: "Available" },
    { id: "d-002", name: "Dr. Jones", status: "Busy" },
    { id: "d-003", name: "Dr. Taylor", status: "Away" },
];


export default function SupervisorPage() {
    const { toast } = useToast();
    const [journeys, setJourneys] = useState(patientJourneyData);
    const [doctors, setDoctors] = useState(initialDoctors);
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
    
    const handleDoctorChange = (patientId: string, doctorId: string) => {
        setJourneys(journeys.map(p => p.id === patientId ? {...p, doctorId} : p));
        toast({
            title: "Doctor Assigned",
            description: `Re-assigned doctor for patient ${patientId}.`,
        });
    };

    const handleDoctorStatusChange = (doctorId: string, status: string) => {
        setDoctors(doctors.map(d => d.id === doctorId ? {...d, status} : d));
    };

    const handleToggleEmergency = (patientId: string) => {
        setJourneys(journeys.map(p => p.id === patientId ? {...p, emergency: !p.emergency} : p));
        toast({
            title: "Emergency Status Updated",
            description: `Patient ${patientId} emergency status changed.`,
        });
    };

  return (
    <>
      <div className="space-y-8">
        <h1 className="text-3xl font-bold tracking-tight">Supervisor's Dashboard</h1>
        
        <Card>
            <CardHeader>
                <CardTitle>Doctor Availability</CardTitle>
                <CardDescription>Monitor and manage doctor statuses.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Doctor</TableHead>
                            <TableHead className="w-[200px]">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {doctors.map(doctor => (
                            <TableRow key={doctor.id}>
                                <TableCell className="font-medium">{doctor.name}</TableCell>
                                <TableCell>
                                    <Select value={doctor.status} onValueChange={(status) => handleDoctorStatusChange(doctor.id, status)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Available">Available</SelectItem>
                                            <SelectItem value="Busy">Busy</SelectItem>
                                            <SelectItem value="Away">Away</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>

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
                            <TableHead>Doctor</TableHead>
                            <TableHead>Issues</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {journeys.map(patient => (
                            <TableRow key={patient.id} className={patient.emergency ? "bg-red-100/50" : (patient.issues > 0 ? "bg-destructive/10" : "")}>
                                <TableCell className="font-medium">{patient.name}</TableCell>
                                <TableCell>{getCountryFlag(patient.nationality)}</TableCell>
                                <TableCell><Badge variant="outline">{patient.currentStep}</Badge></TableCell>
                                 <TableCell>
                                    <Select value={patient.doctorId || ""} onValueChange={(docId) => handleDoctorChange(patient.id, docId)}>
                                        <SelectTrigger className="w-[150px]">
                                            <SelectValue placeholder="Assign..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {doctors.filter(d => d.status === 'Available').map(d => (
                                                <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </TableCell>
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
                                                <Edit className="mr-2 h-4 w-4" /> Edit & Add Notes
                                            </DropdownMenuItem>
                                             <DropdownMenuItem onClick={() => handleToggleEmergency(patient.id)}>
                                                <AlertTriangle className="mr-2 h-4 w-4" /> Toggle Emergency
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
                        <Label htmlFor="currentStep" className="text-right">Current Step</Label>
                        <Input id="currentStep" value={selectedPatient?.currentStep || ""}  onChange={(e) => setSelectedPatient(p => p ? {...p, currentStep: e.target.value} : null)} className="col-span-3" />
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="details" className="text-right">Details</Label>
                        <Input id="details" value={selectedPatient?.details || ""}  onChange={(e) => setSelectedPatient(p => p ? {...p, details: e.target.value} : null)} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-start gap-4">
                        <Label htmlFor="notes" className="text-right pt-2">Special Notes</Label>
                        <Textarea id="notes" value={selectedPatient?.notes || ""} onChange={(e) => setSelectedPatient(p => p ? {...p, notes: e.target.value} : null)} className="col-span-3" placeholder="Add special notes for the doctor or pharmacy regarding this patient's prescription or care." />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setSelectedPatient(null)}>Cancel</Button>
                    <Button onClick={handleSaveChanges}>Save Changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

    </>
  )
}
