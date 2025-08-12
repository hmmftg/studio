"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import React, { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Lightbulb, Languages, MessageSquare, PlusCircle, Trash2 } from "lucide-react"
import { translateText } from "@/ai/flows/translate-flow"
import { checkPrescription } from "@/ai/flows/prescription-flow"
import { getCountryFlag } from "@/components/CountryFlag"
import type { CheckPrescriptionInput, CheckPrescriptionOutput, TranslateTextInput } from "@/ai/types"
import { Input } from "@/components/ui/input"

const waitingPatientsData = [
  { id: "p-004", name: "Diana Prince", service: "Dentistry", time: "10:35 AM", waitingFor: "12 mins", nationality: "Turkish", message: "My front tooth is chipped and it hurts when I drink cold water." },
]

const unavailableDrugs = ["Ibuprofen", "Amoxicillin"];

type PrescriptionItem = {
    id: number;
    drug: string;
    dosage: string;
    notes: string;
    advice?: string;
};

export default function DentistPage() {
    const { toast } = useToast()
    const [waitingPatients, setWaitingPatients] = useState(waitingPatientsData)
    const [selectedPatient, setSelectedPatient] = useState<(typeof waitingPatientsData)[0] | null>(null);
    const [prescriptionItems, setPrescriptionItems] = useState<PrescriptionItem[]>([]);
    const [isTranslating, setIsTranslating] = useState(false);
    const [translationResult, setTranslationResult] = useState('');
    const [isCheckingPrescription, setIsCheckingPrescription] = useState(false);
    const [patientMessage, setPatientMessage] = useState("");

    const handleAccept = (patient: (typeof waitingPatientsData)[0]) => {
        setSelectedPatient(patient);
        setPrescriptionItems([{ id: 1, drug: '', dosage: '', notes: '' }]);
        setTranslationResult('');
        setPatientMessage(patient.message);
    }

    const handleTranslate = async (textToTranslate: string, targetLanguage: string) => {
        if (!textToTranslate) return;
        setIsTranslating(true);
        setTranslationResult('');
        try {
            const input: TranslateTextInput = {
                text: textToTranslate,
                targetLanguage: targetLanguage,
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
    
    const handlePrescriptionItemChange = (id: number, field: keyof Omit<PrescriptionItem, 'id' | 'advice'>, value: string) => {
        setPrescriptionItems(items => items.map(item => item.id === id ? { ...item, [field]: value, advice: undefined } : item));
    };
    
    const handleCheckPrescription = async (id: number, drugName: string) => {
        if (drugName.length < 3) return;
        setIsCheckingPrescription(true);
        try {
            const input: CheckPrescriptionInput = { prescription: drugName };
            const result = await checkPrescription(input);
            if (!result.isSafe) {
                setPrescriptionItems(items => items.map(item => item.id === id ? { ...item, advice: result.advice } : item));
            }
        } catch (error) {
            console.error("Prescription check failed", error);
        } finally {
            setIsCheckingPrescription(false);
        }
    };
    
    const addPrescriptionItem = () => {
        setPrescriptionItems(items => [...items, { id: Date.now(), drug: '', dosage: '', notes: '' }]);
    };
    
    const removePrescriptionItem = (id: number) => {
        setPrescriptionItems(items => items.filter(item => item.id !== id));
    };

    const handleSubmitPrescription = () => {
        if (!selectedPatient) return;
        
        // Logic to process and save the prescription would go here.
        // For the demo, we just clear the state.
        
        setWaitingPatients(prev => prev.filter(p => p.id !== selectedPatient.id));
        
        toast({
          title: "Patient Processed",
          description: `${selectedPatient.name} has been notified for their next service.`,
        })

        setSelectedPatient(null);
        setPrescriptionItems([]);
    }

    const handleCancel = () => {
        setSelectedPatient(null);
        setPrescriptionItems([]);
    }
    
     const getPrescriptionAsString = (items: PrescriptionItem[]) => {
        return items.map(p => `- ${p.drug} (${p.dosage}): ${p.notes}`).join('\n');
    }

  return (
    <>
        <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-tight">Dentist's Dashboard</h1>
            
            {!selectedPatient ? (
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
                                        <TableCell>{getCountryFlag(patient.nationality)}</TableCell>
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
            ) : (
                <Card className="animate-in fade-in-50">
                    <CardHeader>
                        <CardTitle>Consultation: {selectedPatient.name}</CardTitle>
                        <CardDescription>
                            Patient Nationality: <span className="font-semibold flex items-center gap-2">{getCountryFlag(selectedPatient?.nationality || '')} {selectedPatient.nationality}</span>. 
                            Record diagnosis and prescribe the next steps.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {patientMessage && (
                            <div className="p-3 bg-sky-100/50 rounded-md border border-sky-200">
                                <Label className="flex items-center gap-2 text-sm font-medium"><MessageSquare className="h-4 w-4" /> Patient's Message:</Label>
                                <p className="text-sm text-foreground/80 mt-1 italic">"{patientMessage}"</p>
                                <Button variant="link" size="sm" className="p-0 h-auto" onClick={() => handleTranslate(patientMessage, "English")} disabled={isTranslating}>
                                    {isTranslating ? 'Translating...' : 'Translate to English'}
                                </Button>
                            </div>
                        )}

                        <Alert>
                            <Lightbulb className="h-4 w-4" />
                            <AlertTitle>Pharmacy Notice</AlertTitle>
                            <AlertDescription>
                                Unavailable drugs: <strong>{unavailableDrugs.join(", ")}</strong>. Please prescribe alternatives.
                            </AlertDescription>
                        </Alert>

                         <div className="space-y-2">
                             <Label>Diagnosis Notes</Label>
                             <Textarea placeholder="e.g., Patient reports toothache, evidence of cavity on upper molar..."/>
                         </div>
                        
                        <div className="space-y-4">
                            <Label className="text-base font-medium">Prescription</Label>
                             <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-2/5">Drug / Service</TableHead>
                                        <TableHead className="w-1/5">Dosage / Schedule</TableHead>
                                        <TableHead className="w-2/5">Notes</TableHead>
                                        <TableHead className="w-[50px]"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {prescriptionItems.map(item => (
                                        <TableRow key={item.id}>
                                            <TableCell>
                                                <Input 
                                                    placeholder="e.g. Paracetamol" 
                                                    value={item.drug} 
                                                    onChange={(e) => handlePrescriptionItemChange(item.id, 'drug', e.target.value)}
                                                    onBlur={() => handleCheckPrescription(item.id, item.drug)}
                                                />
                                                {item.advice && <p className="text-xs text-destructive mt-1">{item.advice}</p>}
                                            </TableCell>
                                            <TableCell>
                                                <Input 
                                                    placeholder="e.g. 500mg, twice a day" 
                                                    value={item.dosage}
                                                    onChange={(e) => handlePrescriptionItemChange(item.id, 'dosage', e.target.value)}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Input 
                                                    placeholder="e.g. Take with food"
                                                    value={item.notes}
                                                    onChange={(e) => handlePrescriptionItemChange(item.id, 'notes', e.target.value)}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                {prescriptionItems.length > 1 && (
                                                    <Button variant="ghost" size="icon" onClick={() => removePrescriptionItem(item.id)}>
                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                             <Button variant="outline" size="sm" onClick={addPrescriptionItem}><PlusCircle className="mr-2 h-4 w-4" /> Add Item</Button>
                        </div>
                        
                         {translationResult && (
                            <div className="p-3 bg-muted rounded-md">
                                <Label className="text-sm font-medium">Translation:</Label>
                                <p className="text-sm whitespace-pre-wrap">{translationResult}</p>
                            </div>
                        )}
                        
                        <div className="grid gap-3">
                            <Label>Required Next Service</Label>
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

                        <div className="flex justify-between items-center pt-4">
                            <Button variant="outline" onClick={() => handleTranslate(getPrescriptionAsString(prescriptionItems), selectedPatient?.nationality || 'English')} disabled={isTranslating || prescriptionItems.length === 0}>
                                <Languages className="mr-2 h-4 w-4" />
                                {isTranslating ? 'Translating...' : `Translate Prescription to ${selectedPatient?.nationality}`}
                            </Button>
                            <div className="flex gap-2">
                                <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                                <Button onClick={handleSubmitPrescription}>Submit & Notify Next Service</Button>
                            </div>
                        </div>

                    </CardContent>
                </Card>
            )}
        </div>
    </>
  )
}
