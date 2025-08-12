import { Suspense } from 'react';
import PatientStatus from "./PatientStatus";

export async function generateStaticParams() {
  return [{ id: 'demo-patient-123' }];
}

export default function PatientStatusPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PatientStatus />
        </Suspense>
    );
}