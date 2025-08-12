"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  phone: z.string().min(10, {
    message: "Please enter a valid phone number.",
  }),
  nationality: z.string({
    required_error: "Please select a nationality.",
  }),
})

export default function Home() {
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    // In a real app, this would save data and return a unique patient ID.
    // For this demo, we use a static ID and pass the data in the query.
    const patientId = "demo-patient-123"
    const queryParams = new URLSearchParams({
        name: values.name,
        nationality: values.nationality
    });
    router.push(`/patient/${patientId}?${queryParams.toString()}`)
  }

  return (
    <main className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg animate-in fade-in-50 zoom-in-95">
            <CardHeader className="text-center">
                <CardTitle className="text-3xl font-headline">Join the Queue</CardTitle>
                <CardDescription>Enter your details below to register for a consultation.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Full Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., John Doe" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone Number</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., (123) 456-7890" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="nationality"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nationality</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select your nationality" />
                                        </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="iranian">Iranian</SelectItem>
                                            <SelectItem value="iraqi">Iraqi</SelectItem>
                                            <SelectItem value="turkish">Turkish</SelectItem>
                                            <SelectItem value="pakistani">Pakistani</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full !mt-8">Register and See My Place</Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    </main>
  );
}
