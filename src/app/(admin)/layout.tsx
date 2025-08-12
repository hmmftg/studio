import { AdminLayout } from "@/components/AdminLayout";

export default function AdminPagesLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <AdminLayout>{children}</AdminLayout>
}
