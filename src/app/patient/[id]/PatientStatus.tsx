"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useParams } from "next/navigation"
import { CheckCircle2, Loader, Circle, Stethoscope, FlaskConical, HeartPulse, Send, MessageSquare, Languages } from "lucide-react"
import Link from "next/link"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useTranslations } from "@/hooks/use-translations"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { TranslateTextInput } from "@/app/actions/types";
import { translateText } from "@/app/actions/translateActions"


type PrescriptionItem = {
    drug: string;
    dosage: string;
    notes: string;
};

const finalPrescriptionData: PrescriptionItem[] = [
    { drug: "Paracetamol", dosage: "500mg, twice a day", notes: "Take with food for 3 days" },
    { drug: "Saline Nasal Spray", dosage: "2 sprays per nostril", notes: "Use every 4-6 hours as needed" }
];

export default function PatientStatus() {
  const params = useParams()
  const searchParams = useSearchParams()
  const name = searchParams.get('name') || "Patient"
  const nationality = searchParams.get('nationality') || "English"
  const { t, setLocale } = useTranslations();
  const { toast } = useToast()

  const [currentStep, setCurrentStep] = useState(1);
  const [message, setMessage] = useState('');
  const [finalPrescription, setFinalPrescription] = useState<PrescriptionItem[]>([]);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatedPrescription, setTranslatedPrescription] = useState<PrescriptionItem[] | null>(null);

  const steps = [
    { id: 1, title: t('patient.steps.registered.title'), description: t('patient.steps.registered.description'), icon: CheckCircle2 },
    { id: 2, title: t('patient.steps.waiting.title'), description: t('patient.steps.waiting.description'), icon: Circle },
    { id: 3, title: t('patient.steps.consultation.title'), description: t('patient.steps.consultation.description'), icon: Stethoscope },
    { id: 4, title: t('patient.steps.service.title'), description: t('patient.steps.service.description'), icon: FlaskConical },
    { id: 5, title: t('patient.steps.completed.title'), description: t('patient.steps.completed.description'), icon: CheckCircle2 },
  ]

  useEffect(() => {
    // Set locale based on nationality from query params
    const locales: { [key: string]: 'en' | 'fa' | 'ar' | 'tr' | 'ur' } = {
        english: 'en',
        iranian: 'fa',
        iraqi: 'ar',
        turkish: 'tr',
        pakistani: 'ur'
    };
    const newLocale = locales[nationality.toLowerCase() as keyof typeof locales] || 'en';
    setLocale(newLocale);
  }, [nationality, setLocale]);


  useEffect(() => {
    const stepDurations = [3000, 5000, 7000, 5000, 4000];
    let cumulativeDelay = 0;

    const timers = stepDurations.map((duration, index) => {
      cumulativeDelay += duration;
      return setTimeout(() => {
        if (index + 2 === 5) {
            setFinalPrescription(finalPrescriptionData);
        }
        setCurrentStep(index + 2);
      }, cumulativeDelay);
    });

    return () => timers.forEach(clearTimeout);
  }, []);

  const handleSendMessage = () => {
    if (!message) return;
    toast({
        title: t('patient.message.sentTitle'),
        description: t('patient.message.sentDescription'),
    });
    setMessage('');
  }
  
  const handleTranslatePrescription = async () => {
    if (isTranslating || !finalPrescription.length) return;
    setIsTranslating(true);
    setTranslatedPrescription(null);

    try {
        const translatedItems: PrescriptionItem[] = [];
        for (const item of finalPrescription) {
            const textToTranslate = `${item.drug}&&${item.dosage}&&${item.notes}`;
            const input: TranslateTextInput = { text: textToTranslate, targetLanguage: nationality };
            const result = await translateText(input);
            const [drug, dosage, notes] = result.translation.split('&&');
            translatedItems.push({ drug, dosage, notes });
        }
        setTranslatedPrescription(translatedItems);
    } catch (error) {
        console.error("Prescription translation failed", error);
        toast({
            variant: "destructive",
            title: "Translation Error",
            description: "Could not translate the prescription.",
        });
    } finally {
        setIsTranslating(false);
    }
  };


  const getStepVisuals = (stepId: number) => {
    if (stepId < currentStep) {
      return { icon: <CheckCircle2 className="text-primary" />, connector: "bg-primary" };
    }
    if (stepId === currentStep) {
      return { icon: <Loader className="animate-spin text-primary" />, connector: "bg-border" };
    }
    return { icon: <Circle className="text-muted-foreground" />, connector: "bg-border" };
  };

  const prescriptionToDisplay = translatedPrescription || finalPrescription;

  return (
    <main className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-2xl shadow-lg animate-in fade-in-50 zoom-in-95">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">{t('patient.welcome')}, {name}!</CardTitle>
          <CardDescription>{t('patient.description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div>
            <ul className="space-y-0">
              {steps.map((step, index) => {
                const visuals = getStepVisuals(step.id);
                return (
                    <li key={step.id} className="flex items-start gap-4">
                        <div className="flex flex-col items-center h-full">
                            <div className={cn("h-10 w-10 rounded-full flex items-center justify-center bg-muted shrink-0", currentStep >= step.id && "bg-primary/20")}>
                               {visuals.icon}
                            </div>
                            {index < steps.length - 1 && <div className={cn("w-px flex-1 my-1", visuals.connector)} />}
                        </div>
                        <div className="pt-1.5">
                            <p className={cn("font-medium", currentStep >= step.id && "text-primary")}>{step.title}</p>
                            <p className="text-sm text-muted-foreground">{step.description}</p>
                        </div>
                    </li>
                );
              })}
            </ul>
          </div>

          <Separator />
          
          {currentStep < 5 && (
            <div className="space-y-4">
                <div className="p-4 bg-muted/50 border rounded-lg animate-in fade-in-50">
                    <Label htmlFor="patient-message" className="flex items-center gap-2 mb-2 font-semibold"><MessageSquare className="h-4 w-4" />{t('patient.message.title')}</Label>
                    <p className="text-sm text-muted-foreground mb-3">{t('patient.message.description')}</p>
                    <div className="flex w-full items-center space-x-2">
                        <Input id="patient-message" type="text" placeholder={t('patient.message.placeholder')} value={message} onChange={(e) => setMessage(e.target.value)} />
                        <Button type="submit" onClick={handleSendMessage} disabled={!message}><Send className="h-4 w-4" /></Button>
                    </div>
                </div>
            </div>
          )}


          {currentStep >= 4 && finalPrescription.length === 0 && (
            <div className="p-4 bg-accent/20 border border-accent rounded-lg text-center animate-in fade-in-50">
                <h3 className="font-bold text-lg text-accent-foreground">{t('patient.action.title')}</h3>
                <p className="text-muted-foreground mb-2">{t('patient.action.goToPharmacy')}</p>
                <p className="text-sm">{t('patient.action.code')}:</p>
                <Badge variant="default" className="text-2xl font-mono tracking-widest px-4 py-2 mt-2">PH7891</Badge>
            </div>
          )}
          
          {finalPrescription.length > 0 && (
             <div className="p-4 bg-primary/10 border border-primary/50 rounded-lg animate-in fade-in-50 space-y-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="font-bold text-lg text-primary">{t('patient.prescription.title')}</h3>
                        <p className="text-muted-foreground">{t('patient.prescription.description')}</p>
                    </div>
                     <Button variant="outline" size="sm" onClick={handleTranslatePrescription} disabled={isTranslating}>
                        <Languages className="mr-2 h-4 w-4" />
                        {isTranslating ? t('patient.prescription.translatingButton') : t('patient.prescription.translateButton')}
                    </Button>
                </div>

                <div className="mt-4 bg-background rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{t('patient.prescription.drugHeader')}</TableHead>
                                <TableHead>{t('patient.prescription.dosageHeader')}</TableHead>
                                <TableHead>{t('patient.prescription.notesHeader')}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {prescriptionToDisplay.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium">{item.drug}</TableCell>
                                    <TableCell>{item.dosage}</TableCell>
                                    <TableCell>{item.notes}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
          )}


          {currentStep === 5 && (
            <div className="text-center space-y-4 animate-in fade-in-50">
                <HeartPulse className="mx-auto h-12 w-12 text-primary" />
                <h3 className="font-bold text-lg">{t('patient.feedback.thankYou')}</h3>
                <p className="text-muted-foreground">{t('patient.feedback.prompt')}</p>
                <Button asChild>
                    <Link href={`/feedback/${params.id}`}>{t('patient.feedback.button')}</Link>
                </Button>
            </div>
          )}

        </CardContent>
      </Card>
    </main>
  )
}
