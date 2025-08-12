"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useParams } from "next/navigation"
import { CheckCircle2, Loader, Circle, Stethoscope, FlaskConical, HeartPulse, Send, MessageSquare } from "lucide-react"
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


export default function PatientStatusPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const name = searchParams.get('name') || "Patient"
  const nationality = searchParams.get('nationality') || "English"
  const { t, setLocale } = useTranslations();
  const { toast } = useToast()

  const [currentStep, setCurrentStep] = useState(1);
  const [message, setMessage] = useState('');
  const [finalPrescription, setFinalPrescription] = useState('');

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
            // Simulate receiving prescription details at the end of the visit
            setFinalPrescription("Paracetamol 500mg, twice a day for 3 days. Take with food.");
        }
        setCurrentStep(index + 2);
      }, cumulativeDelay);
    });

    return () => timers.forEach(clearTimeout);
  }, []);

  const handleSendMessage = () => {
    if (!message) return;
    // In a real app, this would send the message to a backend.
    // For this demo, we just show a confirmation toast.
    toast({
        title: "Message Sent",
        description: "Your message has been sent to the doctor.",
    });
    setMessage('');
  }

  const getStepVisuals = (stepId: number) => {
    if (stepId < currentStep) {
      return { icon: <CheckCircle2 className="text-primary" />, connector: "bg-primary" };
    }
    if (stepId === currentStep) {
      return { icon: <Loader className="animate-spin text-primary" />, connector: "bg-border" };
    }
    return { icon: <Circle className="text-muted-foreground" />, connector: "bg-border" };
  };

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


          {currentStep >= 4 && !finalPrescription && (
            <div className="p-4 bg-accent/20 border border-accent rounded-lg text-center animate-in fade-in-50">
                <h3 className="font-bold text-lg text-accent-foreground">{t('patient.action.title')}</h3>
                <p className="text-muted-foreground mb-2">{t('patient.action.goToPharmacy')}</p>
                <p className="text-sm">{t('patient.action.code')}:</p>
                <Badge variant="default" className="text-2xl font-mono tracking-widest px-4 py-2 mt-2">PH7891</Badge>
            </div>
          )}
          
          {finalPrescription && (
             <div className="p-4 bg-primary/10 border border-primary/50 rounded-lg animate-in fade-in-50">
                <h3 className="font-bold text-lg text-primary">{t('patient.prescription.title')}</h3>
                <p className="text-muted-foreground">{t('patient.prescription.description')}</p>
                <div className="mt-4 p-3 bg-background rounded-md">
                    <p className="font-mono whitespace-pre-wrap">{finalPrescription}</p>
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
