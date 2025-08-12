import FeedbackForm from "./FeedbackForm";

export async function generateStaticParams() {
  return [{ id: 'demo-patient-123' }];
}

export default function FeedbackPage() {
    return <FeedbackForm />;
}
