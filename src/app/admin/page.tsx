"use client"

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { BarChart, LineChart, PieChart } from "lucide-react"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart as BarChartComponent, Line, LineChart as LineChartComponent, Pie, PieChart as PieChartComponent, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { AdminLayout } from '@/components/AdminLayout';

const initialPatientVolumeData = [
  { month: "Jan", total: 0 },
  { month: "Feb", total: 0 },
  { month: "Mar", total: 0 },
  { month: "Apr", total: 0 },
  { month: "May", total: 0 },
  { month: "Jun", total: 0 },
];

const serviceDistributionData = [
  { name: 'Healthcare', value: 400, fill: "var(--color-healthcare)" },
  { name: 'Dentistry', value: 300, fill: "var(--color-dentistry)"  },
  { name: 'Pharmacy', value: 200, fill: "var(--color-pharmacy)"  },
  { name: 'Lab Tests', value: 278, fill: "var(--color-lab)"  },
];
const serviceDistributionConfig = {
    healthcare: { label: "Healthcare", color: "hsl(var(--chart-1))" },
    dentistry: { label: "Dentistry", color: "hsl(var(--chart-2))" },
    pharmacy: { label: "Pharmacy", color: "hsl(var(--chart-3))" },
    lab: { label: "Lab Tests", color: "hsl(var(--chart-4))" },
}

const waitingTimeData = [
    { hour: '9am', "avgTime": 15 },
    { hour: '10am', "avgTime": 20 },
    { hour: '11am', "avgTime": 25 },
    { hour: '12pm', "avgTime": 30 },
    { hour: '1pm', "avgTime": 28 },
    { hour: '2pm', "avgTime": 22 },
    { hour: '3pm', "avgTime": 18 },
]
const waitingTimeConfig = {
    avgTime: {
        label: "Avg. Wait Time (min)",
        color: "hsl(var(--chart-1))",
    },
}

export default function AdminDashboardPage() {
  const [patientVolumeData, setPatientVolumeData] = useState(initialPatientVolumeData);

  useEffect(() => {
    // This useEffect hook runs only on the client-side, after hydration
    // It prevents a hydration mismatch error by ensuring Math.random() is not run on the server
    const generatedData = initialPatientVolumeData.map(item => ({
      ...item,
      total: Math.floor(Math.random() * 200) + 100
    }));
    setPatientVolumeData(generatedData);
  }, []); // Empty dependency array ensures this runs once on mount


  return (
    <AdminLayout>
      <div className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">High-level overview of clinic resources and activities.</p>
        <div className="grid gap-6 pt-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Patients Today</CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground">+5.2% from yesterday</p>
            </CardContent>
          </Card>
           <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Wait Time</CardTitle>
              <LineChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">22 min</div>
              <p className="text-xs text-muted-foreground">-10% from last week</p>
            </CardContent>
          </Card>
           <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resource Utilization</CardTitle>
              <PieChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">85%</div>
              <p className="text-xs text-muted-foreground">Doctors are 95% utilized</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 pt-4 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle>Patient Volume</CardTitle>
                    <CardDescription>Monthly patient registration volume.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={{}} className="h-[300px] w-full">
                        <BarChartComponent data={patientVolumeData}>
                            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
                            <YAxis tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
                            <Tooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                            <Bar dataKey="total" fill="var(--color-primary)" radius={8} />
                        </BarChartComponent>
                    </ChartContainer>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Service Distribution</CardTitle>
                    <CardDescription>Breakdown of services provided.</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                     <ChartContainer config={serviceDistributionConfig} className="h-[300px] w-full">
                         <PieChartComponent>
                            <Tooltip content={<ChartTooltipContent hideLabel />} />
                            <Pie data={serviceDistributionData} dataKey="value" nameKey="name" />
                        </PieChartComponent>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>
         <div className="grid gap-6 pt-4">
             <Card>
                <CardHeader>
                    <CardTitle>Average Waiting Times</CardTitle>
                    <CardDescription>Average patient waiting time throughout the day.</CardDescription>
                </CardHeader>
                <CardContent>
                     <ChartContainer config={waitingTimeConfig} className="h-[300px] w-full">
                        <LineChartComponent data={waitingTimeData}>
                            <XAxis dataKey="hour" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
                            <YAxis tickLine={false} axisLine={false} tickMargin={8} fontSize={12} domain={['dataMin - 5', 'dataMax + 5']} />
                            <Tooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                            <Line type="monotone" dataKey="avgTime" stroke="var(--color-avgTime)" strokeWidth={2} dot={false} />
                        </LineChartComponent>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>
      </div>
    </AdminLayout>
  )
}
