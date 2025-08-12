"use client"

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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Lightbulb, Languages } from "lucide-react"
import { translateText, type TranslateTextInput } from "@/ai/flows/translate-flow"
import { checkPrescription } from "@/ai/flows/prescription-flow"
import type { CheckPrescriptionInput, CheckPrescriptionOutput } from "@/ai/types"


const waitingPatientsData = [
  { id: "p-004", name: "Diana Prince", service: "Dentistry", time: "10:35 AM", waitingFor: "12 mins", nationality: "Turkish" },
]

export default function DentistPage() {
    const { toast } = useToast()
    const [waitingPatients, setWaitingPatients] = React.useState(waitingPatientsData)
    const [selectedPatient, setSelectedPatient] = React.useState<(typeof waitingPatientsData)[0] | null>(null);
    const [prescription, setPrescription] = React.useState('');
    const [isTranslating, setIsTranslating] = React.useState(false);
    const [translationResult, setTranslationResult] = React.useState('');
    const [prescriptionAdvice, setPrescriptionAdvice] = React.useState<CheckPrescriptionOutput | null>(null);
    const [isCheckingPrescription, setIsCheckingPrescription] = React.useState(false);


    const handleAccept = (patient: (typeof waitingPatientsData)[0]) => {
        setSelectedPatient(patient);
        setPrescription('');
        setTranslationResult('');
        setPrescriptionAdvice(null);
    }
    
    const handleTranslate = async () => {
        if (!prescription || !selectedPatient) return;
        setIsTranslating(true);
        setTranslationResult('');
        try {
            const input: TranslateTextInput = {
                text: prescription,
                targetLanguage: selectedPatient.nationality,
            };
            const result = await translateText(input);
            setTranslationResult(result.translation);
        } catch (error) {
            console.error("Translation failed", error);
            toast({
                variant: "destructive",
                title: "Translation Error",
                description: "Could not translate the text.",
            });
        } finally {
            setIsTranslating(false);
        }
    };

    const handlePrescriptionChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newPrescription = e.target.value;
        setPrescription(newPrescription);
        setPrescriptionAdvice(null);

        if (newPrescription.length > 20) { // aribtrary length to avoid too many calls
            setIsCheckingPrescription(true);
            try {
                const input: CheckPrescriptionInput = { prescription: newPrescription };
                const result = await checkPrescription(input);
                if (!result.isSafe) {
                    setPrescriptionAdvice(result);
                }
            } catch (error) {
                console.error("Prescription check failed", error);
            } finally {
                setIsCheckingPrescription(false);
            }
        }
    };


    const handleSubmitPrescription = () => {
        if (!selectedPatient) return;
        
        setWaitingPatients(prev => prev.filter(p => p.id !== selectedPatient.id));
        
        toast({
          title: "Patient Processed",
          description: `${selectedPatient.name} has been notified for their next service.`,
        })

        setSelectedPatient(null);
    }

  return (
    <>
        <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-tight">Dentist's Dashboard</h1>
            <div className="grid gap-8 pt-4">
                <Card>
                    <CardHeader>
                        <CardTitle>My Consultation Queue</CardTitle>
                        <CardDescription>Patients waiting for dental services.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Nationality</TableHead>
                                    <TableHead>Service</TableHead>
                                    <TableHead className="hidden sm:table-cell">Waiting Time</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {waitingPatients.length > 0 ? waitingPatients.map(patient => (
                                    <TableRow key={patient.id}>
                                        <TableCell className="font-medium">{patient.name}</TableCell>
                                        <TableCell>{patient.nationality}</TableCell>
                                        <TableCell><Badge variant="secondary">{patient.service}</Badge></TableCell>
                                        <TableCell className="hidden sm:table-cell text-muted-foreground">{patient.waitingFor}</TableCell>
                                        <TableCell className="text-right">
                                            <Button size="sm" onClick={() => handleAccept(patient)}>Accept Patient</Button>
                                        </TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center h-24">No patients waiting</TableCell>
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
                       Patient Nationality: <span className="font-semibold">{selectedPatient?.nationality}</span>. 
                       Record diagnosis and prescribe the next steps.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="prescription">Details & Prescription</Label>
                        <Textarea id="prescription" placeholder="e.g., Patient reports toothache, recommend extraction..." rows={4} value={prescription} onChange={handlePrescriptionChange} />
                        {isCheckingPrescription && <p className="text-xs text-muted-foreground">Checking prescription...</p>}
                        {prescriptionAdvice && (
                             <Alert variant="destructive">
                                <Lightbulb className="h-4 w-4" />
                                <AlertTitle>Suggestion</AlertTitle>
                                <AlertDescription>
                                    {prescriptionAdvice.advice}
                                </AlertDescription>
                            </Alert>
                        )}
                    </div>

                    {translationResult && (
                        <div className="p-3 bg-muted rounded-md">
                            <Label className="text-sm font-medium">Translation:</Label>
                            <p className="text-sm">{translationResult}</p>
                        </div>
                    )}

                    <div className="grid gap-3">
                         <Label>Required Service</Label>
                        <RadioGroup defaultValue="pharmacy" className="gap-2">
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="pharmacy" id="r1" />
                                <Label htmlFor="r1">Pharmacy (Painkillers)</Label>
                            </div>
                             <div className="flex items-center space-x-2">
                                <RadioGroupItem value="none" id="r4" />
                                <Label htmlFor="r4">None / Discharge</Label>
                            </div>
                        </RadioGroup>
                    </div>
                </div>
                <DialogFooter className="sm:justify-between">
                     <Button variant="outline" onClick={handleTranslate} disabled={isTranslating || !prescription}>
                        <Languages className="mr-2 h-4 w-4" />
                        {isTranslating ? 'Translating...' : `Translate to ${selectedPatient?.nationality}`}
                    </Button>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setSelectedPatient(null)}>Cancel</Button>
                        <Button onClick={handleSubmitPrescription}>Submit & Notify Service</Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </>
  )
}
