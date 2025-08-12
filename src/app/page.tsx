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
import { useI18n, useSetLocale } from "@/locales/client"
import { getCountryFlag } from "@/components/CountryFlag"

const nationalities = [
    { value: "iranian", label: "Iranian", locale: "fa" },
    { value: "iraqi", label: "Iraqi", locale: "ar" },
    { value: "turkish", label: "Turkish", locale: "tr" },
    { value: "pakistani", label: "Pakistani", locale: "ur" },
    { value: "english", label: "English", locale: "en" },
];

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
  const t = useI18n()
  const setLocale = useSetLocale()


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

  const handleNationalityChange = (value: string) => {
    form.setValue('nationality', value)
    const selected = nationalities.find(n => n.value === value)
    if (selected) {
        setLocale(selected.locale as 'en' | 'fa' | 'ar' | 'tr' | 'ur')
    }
  }

  return (
    <main className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg animate-in fade-in-50 zoom-in-95">
            <CardHeader className="text-center">
                <CardTitle className="text-3xl font-headline">{t('registration.title')}</CardTitle>
                <CardDescription>{t('registration.description')}</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('registration.nameLabel')}</FormLabel>
                                    <FormControl>
                                        <Input placeholder={t('registration.namePlaceholder')} {...field} />
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
                                    <FormLabel>{t('registration.phoneLabel')}</FormLabel>
                                    <FormControl>
                                        <Input placeholder={t('registration.phonePlaceholder')} {...field} />
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
                                    <FormLabel>{t('registration.nationalityLabel')}</FormLabel>
                                    <Select onValueChange={handleNationalityChange} defaultValue={field.value}>
                                        <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder={t('registration.nationalityPlaceholder')} />
                                        </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {nationalities.map(nat => (
                                                <SelectItem key={nat.value} value={nat.value}>
                                                   <div className="flex items-center gap-2">
                                                        {getCountryFlag(nat.label)}
                                                        <span>{nat.label}</span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full !mt-8">{t('registration.submitButton')}</Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    </main>
  );
}
