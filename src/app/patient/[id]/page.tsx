"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { CheckCircle2, Loader, Circle, Stethoscope, FlaskConical, HeartPulse } from "lucide-react"
import Link from "next/link"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Logo } from "@/components/Logo"
import { cn } from "@/lib/utils"

const steps = [
  { id: 1, title: "Registered", description: "You are in the system and waiting for reception.", icon: CheckCircle2 },
  { id: 2, title: "Waiting for Doctor", description: "Reception has processed your request. Please wait for a doctor.", icon: Circle },
  { id: 3, title: "In Consultation", description: "You are now with the doctor.", icon: Stethoscope },
  { id: 4, title: "Service Required", description: "Please go to the designated service room with your code.", icon: FlaskConical },
  { id: 5, title: "Completed", description: "Your visit is complete. Thank you!", icon: CheckCircle2 },
]

export default function PatientStatusPage({ params }: { params: { id: string }}) {
  const searchParams = useSearchParams()
  const name = searchParams.get('name') || "Patient"

  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    const stepDurations = [3000, 5000, 7000, 5000, 4000];
    let cumulativeDelay = 0;

    const timers = stepDurations.map((duration, index) => {
      cumulativeDelay += duration;
      return setTimeout(() => {
        setCurrentStep(index + 2);
      }, cumulativeDelay);
    });

    return () => timers.forEach(clearTimeout);
  }, []);

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
          <CardTitle className="text-2xl font-headline">Welcome, {name}!</CardTitle>
          <CardDescription>Follow your journey with us below. The status will update automatically.</CardDescription>
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
          
          {currentStep >= 4 && (
            <div className="p-4 bg-accent/20 border border-accent rounded-lg text-center animate-in fade-in-50">
                <h3 className="font-bold text-lg text-accent-foreground">Action Required</h3>
                <p className="text-muted-foreground mb-2">Please proceed to the Pharmacy.</p>
                <p className="text-sm">Your Confirmation Code is:</p>
                <Badge variant="default" className="text-2xl font-mono tracking-widest px-4 py-2 mt-2">PH7891</Badge>
            </div>
          )}

          {currentStep === 5 && (
            <div className="text-center space-y-4 animate-in fade-in-50">
                <HeartPulse className="mx-auto h-12 w-12 text-primary" />
                <h3 className="font-bold text-lg">Thank You!</h3>
                <p className="text-muted-foreground">We appreciate you visiting. Please provide your feedback to help us improve.</p>
                <Button asChild>
                    <Link href={`/feedback/${params.id}`}>Give Feedback</Link>
                </Button>
            </div>
          )}

        </CardContent>
      </Card>
    </main>
  )
}
