"use client"

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
import { getCountryFlag } from "@/components/CountryFlag"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { PlusCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const initialNewPatients = [
  { id: "p-001", name: "Alice Johnson", phone: "555-0101", time: "2 minutes ago", nationality: "Turkish", service: "" },
  { id: "p-002", name: "Bob Williams", phone: "555-0102", time: "5 minutes ago", nationality: "Iraqi", service: "" },
  { id: "p-003", name: "Carol White", phone: "555-0103", time: "8 minutes ago", nationality: "Pakistani", service: "" },
]

const initialQueue = [
  { id: "p-004", name: "David Green", service: "Healthcare", status: "Waiting for Doctor", time: "10:32 AM", nationality: "Iranian" },
  { id: "p-005", name: "Eve Black", service: "Dentistry", status: "Waiting for Doctor", time: "10:35 AM", nationality: "Turkish" },
]

const nationalities = [
    { value: "iranian", label: "Iranian" },
    { value: "iraqi", label: "Iraqi" },
    { value: "turkish", label: "Turkish" },
    { value: "pakistani", label: "Pakistani" },
    { value: "english", label: "English" },
];


export default function ReceptionPage() {
    const [newPatients, setNewPatients] = useState(initialNewPatients)
    const [queue, setQueue] = useState(initialQueue)
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newPatientInfo, setNewPatientInfo] = useState({ name: '', phone: '', nationality: '' });
    const { toast } = useToast();

    const handleServiceChange = (patientId: string, service: string) => {
        setNewPatients(prev => prev.map(p => p.id === patientId ? { ...p, service } : p))
    };

    const handleAddToQueue = (patient: typeof newPatients[0]) => {
        if (!patient.service) {
            toast({
                variant: "destructive",
                title: "Service Not Selected",
                description: "Please select a service for the patient before adding them to the queue.",
            });
            return;
        }

        const newQueuedPatient = {
            id: patient.id,
            name: patient.name,
            service: patient.service.charAt(0).toUpperCase() + patient.service.slice(1),
            status: "Waiting for Doctor",
            time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            nationality: patient.nationality
        };

        setQueue(prev => [newQueuedPatient, ...prev]);
        setNewPatients(prev => prev.filter(p => p.id !== patient.id));
        toast({
            title: "Patient Added to Queue",
            description: `${patient.name} has been added to the ${newQueuedPatient.service} queue.`,
        });
    };

    const handleAddPatient = () => {
        if (!newPatientInfo.name || !newPatientInfo.phone || !newPatientInfo.nationality) return;

        const newPatient = {
            id: `p-${Math.random().toString(36).substr(2, 9)}`,
            name: newPatientInfo.name,
            phone: newPatientInfo.phone,
            time: "Just now",
            nationality: newPatientInfo.nationality,
            service: ""
        };

        setNewPatients(prev => [newPatient, ...prev]);
        setNewPatientInfo({ name: '', phone: '', nationality: '' });
        setIsDialogOpen(false);
    }


  return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Reception Dashboard</h1>
        <div className="grid gap-8 pt-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>New Registrations</CardTitle>
                        <CardDescription>Patients who just registered and need to be assigned a service.</CardDescription>
                    </div>
                     <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button><PlusCircle className="mr-2 h-4 w-4" /> Manual Registration</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Manually Register Patient</DialogTitle>
                                <DialogDescription>
                                    Use this form for special cases or for patients unable to use the kiosk.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="name" className="text-right">Name</Label>
                                    <Input id="name" value={newPatientInfo.name} onChange={(e) => setNewPatientInfo({...newPatientInfo, name: e.target.value})} className="col-span-3" />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="phone" className="text-right">Phone</Label>
                                    <Input id="phone" value={newPatientInfo.phone} onChange={(e) => setNewPatientInfo({...newPatientInfo, phone: e.target.value})} className="col-span-3" />
                                </div>
                                 <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="nationality" className="text-right">Nationality</Label>
                                    <Select onValueChange={(value) => setNewPatientInfo({...newPatientInfo, nationality: value})}>
                                        <SelectTrigger className="col-span-3">
                                            <SelectValue placeholder="Select nationality" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {nationalities.map(nat => (
                                                <SelectItem key={nat.value} value={nat.label}>
                                                   <div className="flex items-center gap-2">
                                                        {getCountryFlag(nat.label)}
                                                        <span>{nat.label}</span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                                <Button onClick={handleAddPatient}>Add Patient</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
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
                                    <TableCell>{getCountryFlag(patient.nationality)}</TableCell>
                                    <TableCell className="hidden sm:table-cell text-muted-foreground">{patient.time}</TableCell>
                                    <TableCell>
                                        <Select value={patient.service} onValueChange={(value) => handleServiceChange(patient.id, value)}>
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
                                        <Button size="sm" onClick={() => handleAddToQueue(patient)}>Add to Queue</Button>
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
                                    <TableCell>{getCountryFlag(patient.nationality)}</TableCell>
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
  )
}
