import ServiceRoom from "./ServiceRoom";
import { AdminLayout } from "@/components/AdminLayout";

export async function generateStaticParams() {
  return [
    { room: 'pharmacy' },
    { room: 'lab' },
    { room: 'nursing' },
  ];
}

export default function ServiceRoomPage() {
    return (
        <AdminLayout>
            <ServiceRoom />
        </AdminLayout>
    );
}
