"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { Logo } from "@/components/Logo"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { cn } from "@/lib/utils"

const mainNav = [
    { href: "/", label: "Patient Registration" },
    { href: "/patient/demo-patient-123?name=Demo%20User&nationality=Turkish", label: "Patient View" },
    { href: "/admin", label: "Admin/Staff View" },
    { href: "/feedback/demo-patient-123", label: "Feedback" },
]

const adminRoutes = ["/admin", "/reception", "/doctor", "/service", "/chairman"];

export function Header() {
    const pathname = usePathname()

    const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));

    if (isAdminRoute) {
        return null;
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center">
                <div className="mr-4 hidden md:flex">
                    <Logo />
                </div>
                <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                    <div className="md:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <Menu />
                                    <span className="sr-only">Toggle Menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-[300px] p-0">
                                <div className="p-4">
                                    <Logo />
                                </div>
                                <nav className="grid gap-2 p-4">
                                    {mainNav.map((item) => (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={cn(
                                                "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                                                pathname === item.href ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                                            )}
                                        >
                                            {item.label}
                                        </Link>
                                    ))}
                                </nav>
                            </SheetContent>
                        </Sheet>
                    </div>

                    <nav className="hidden md:flex gap-4">
                        {mainNav.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "text-sm font-medium transition-colors hover:text-primary",
                                    pathname === item.href ? "text-foreground" : "text-muted-foreground"
                                )}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>
        </header>
    )
}
