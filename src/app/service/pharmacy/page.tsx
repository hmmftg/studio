"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

const queueData = [
    { id: "p-006", name: "Frank Martin", code: "PH7891", status: "Waiting" },
]

const patientDetailsData = {
    PH7891: { id: "p-006", name: "Frank Martin", details: "Paracetamol 500mg, twice a day for 3 days." },
}

type Code = keyof typeof patientDetailsData;

export default function PharmacyServiceRoomPage() {
    const { toast } = useToast()
    const [code, setCode] = useState('');
    const [confirmedPatient, setConfirmedPatient] = useState<any>(null);
    const [patientsInQueue, setPatientsInQueue] = useState(queueData);

    const handleConfirm = () => {
        const patientData = patientDetailsData[code.toUpperCase() as Code];
        if (patientData) {
            setConfirmedPatient(patientData);
            setPatientsInQueue(prev => prev.filter(p => p.code !== code.toUpperCase()));
            setCode('');
        } else {
            toast({
                variant: "destructive",
                title: "Invalid Code",
                description: "The confirmation code you entered is not valid.",
            })
        }
    }
    
    const handleCompleteService = () => {
        toast({
            title: "Service Completed",
            description: `Service for ${confirmedPatient.name} has been marked as complete.`,
        });
        setConfirmedPatient(null);
    }

    const roomName = "Pharmacy";

    return (
        <>
            <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tight">{roomName} Dashboard</h1>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Service Confirmation</CardTitle>
                            <CardDescription>Enter patient's code to begin service.</CardDescription>
                        </CardHeader>
                        <CardContent>
                           {!confirmedPatient ? (
                                <div className="flex w-full max-w-sm items-center space-x-2">
                                    <Input 
                                        type="text" 
                                        placeholder="Confirmation Code" 
                                        value={code} 
                                        onChange={(e) => setCode(e.target.value)}
                                        onKeyUp={(e) => e.key === 'Enter' && handleConfirm()}
                                    />
                                    <Button type="submit" onClick={handleConfirm}>Confirm</Button>
                                </div>
                           ) : (
                               <div className="space-y-4 p-4 bg-secondary/30 rounded-lg animate-in fade-in-50">
                                   <h3 className="font-semibold text-lg">{confirmedPatient.name}</h3>
                                   <p><span className="font-medium text-muted-foreground">Service Details:</span> {confirmedPatient.details}</p>
                                   <div className="flex gap-2 pt-2">
                                       <Button onClick={handleCompleteService}>Complete Service</Button>
                                       <Button variant="outline" onClick={() => setConfirmedPatient(null)}>Cancel</Button>
                                   </div>
                               </div>
                           )}
                        </CardContent>
                    </Card>

                     <Card>
                        <CardHeader>
                            <CardTitle>Waiting Queue</CardTitle>
                             <CardDescription>Patients waiting for {roomName} services.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Patient Name</TableHead>
                                        <TableHead className="text-right">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {patientsInQueue.length > 0 ? patientsInQueue.map(p => (
                                        <TableRow key={p.id}>
                                            <TableCell className="font-medium">{p.name}</TableCell>
                                            <TableCell className="text-right"><Badge variant="outline">{p.status}</Badge></TableCell>
                                        </TableRow>
                                    )) : (
                                        <TableRow>
                                            <TableCell colSpan={2} className="text-center h-24">Queue is empty</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    )
}
