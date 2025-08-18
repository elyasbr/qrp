"use client"
import { AlignJustify, Info, Phone, SquareX, User, LogOut, FileText, ChevronDown, ChevronLeft, Home, Settings, BarChart3, Users, Calendar, Shield, HelpCircle, Cat } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

interface NavItem {
  href?: string;
  label: string;
  icon: React.ReactNode;
  subItems?: Array<{
    href: string;
    label: string;
    icon?: React.ReactNode;
  }>;
}

const userNavItems: NavItem[] = [
  { href: "/dashboard", label: "داشبورد", icon: <Home /> },
  { href: "/dashboard/profile", label: "پروفایل", icon: <User /> },
  { 
    label: "گزارش", 
    icon: <FileText />, 
    subItems: [
      { href: "/dashboard/animals", label: "لیست حیوانات", icon: <Cat/> }
    ]
  },
  { href: "/help", label: "راهنما", icon: <HelpCircle /> },
  { href: "/about", label: "درباره ما", icon: <Info /> },
  { href: "/contact", label: "تماس با ما", icon: <Phone /> },
];

const adminNavItems: NavItem[] = [
  { href: "/dashboard", label: "داشبورد ادمین", icon: <Home /> },
  { href: "/dashboard/profile", label: "پروفایل", icon: <User /> },
  { label: "مدیریت کاربران", icon: <Users />, subItems: [
      { href: "/dashboard/users", label: "لیست کاربران", icon: <Users /> },
    ] },
  { label: "گزارشات", icon: <BarChart3 />, subItems: [
      { href: "/dashboard/animals", label: "لیست حیوانات", icon: <Cat/> }
    ] },
  { href: "/dashboard/settings", label: "تنظیمات", icon: <Settings /> },
  { href: "/help", label: "راهنما", icon: <HelpCircle /> },
  { href: "/about", label: "درباره ما", icon: <Info /> },
  { href: "/contact", label: "تماس با ما", icon: <Phone /> },
];

function getNavItemsByRole(role: string | string[] | undefined): NavItem[] {
  if (!role) return userNavItems;
  if (Array.isArray(role)) {
    if (role.includes("admin")) return adminNavItems;
    return userNavItems;
  }
  if (role === "admin") return adminNavItems;
  return userNavItems;
}

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const { logout, isLoggedIn, userPayload } = useAuth();
  const router = useRouter();

  // Get role from userPayload (from JWT)
  const role = userPayload?.role;
  const navItems = getNavItemsByRole(role);

  const handleLogout = () => {
    logout();
    setOpen(false);
    router.push("/");
  };

  const toggleExpanded = (label: string) => {
    setExpandedItems(prev => 
      prev.includes(label) 
        ? prev.filter(item => item !== label)
        : [...prev, label]
    );
  };

  const isExpanded = (label: string) => expandedItems.includes(label);

  return (
    <>
      {/* Toggle button for mobile */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden fixed top-4 right-4 z-50 bg-white border-2 border-[var(--main-color)] p-2 rounded-full shadow-lg"
      >
        <AlignJustify size={24} />
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
    fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50
    md:relative md:translate-x-0 md:z-auto md:shadow-none
    ${open ? "translate-x-0" : "translate-x-full"}
  `}
      >
        <div className="flex flex-col h-full">
          {/* Mobile header */}
          <div className="flex justify-between items-center p-4 md:hidden border-b border-gray-200">
            <div className="text-[var(--main-color)] font-extrabold text-xl font-Morabba">
              <Link href="/">
                <Image alt="logo" src="/images/logo.jpg" width={100} height={100} />
              </Link>
            </div>
            <button onClick={() => setOpen(false)} className="text-[var(--main-color)]">
              <SquareX size={24} />
            </button>
          </div>

          {/* Desktop logo */}
          <div className="hidden md:block text-center p-6 border-b border-gray-200">
            <Link href="/">
            <Image
              alt="logo"
              src="/images/logo.jpg"
              width={120}
              height={120}
              className="mx-auto"
            />
            </Link>
          </div>

          {/* Navigation + Logout */}
          <nav className="flex flex-col flex-1">
            <div className="p-4 flex-1">
              {navItems.map((item) => (
                <div key={item.label}>
                  {item.href ? (
                    // Regular navigation item
                    <Link
                      href={item.href}
                      className="flex items-center gap-3 text-gray-700 hover:bg-gray-100 p-3 rounded-lg transition-all mb-2"
                      onClick={() => setOpen(false)}
                    >
                      <span className="text-md">{item.icon}</span>
                      <span className="text-sm font-semibold">{item.label}</span>
                    </Link>
                  ) : (
                    // Nested navigation item
                    <div>
                      <button
                        onClick={() => toggleExpanded(item.label)}
                        className="flex items-center justify-between w-full text-gray-700 hover:bg-gray-100 p-3 rounded-lg transition-all mb-2"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-md">{item.icon}</span>
                          <span className="text-sm font-semibold">{item.label}</span>
                        </div>
                        {isExpanded(item.label) ? (
                          <ChevronDown size={16} />
                        ) : (
                          <ChevronLeft size={16} />
                        )}
                      </button>
                      
                      {/* Sub-items */}
                      {isExpanded(item.label) && item.subItems && (
                        <div className="mr-6 space-y-1">
                          {item.subItems.map((subItem) => (
                            <Link
                              key={subItem.href}
                              href={subItem.href}
                              className="flex items-center gap-3 text-gray-800 hover:bg-gray-50 p-2 rounded-lg transition-all text-sm"
                              onClick={() => setOpen(false)}
                            >
                              {subItem.icon && <span className="text-sm">{subItem.icon}</span>}
                              <span className="text-sm font-medium">{subItem.label}</span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {isLoggedIn && (
              <div className="p-4 border-t border-gray-200">
                <button
                  onClick={handleLogout}
                  className="flex items-center cursor-pointer justify-center gap-3 text-red-600 hover:bg-red-50 p-3 rounded-lg transition-all w-full"
                >
                  <LogOut size={20} />
                  <span className="text-sm font-semibold">خروج از حساب</span>
                </button>
              </div>
            )}
          </nav>
        </div>
      </aside>

    </>
  );
}
