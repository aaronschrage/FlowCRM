"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FileText,
  Receipt,
  Bell,
  Settings,
  ChevronRight,
  Zap,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Klanten", href: "/klanten", icon: Users },
  { label: "Offertes", href: "/offertes", icon: FileText },
  { label: "Facturen", href: "/facturen", icon: Receipt },
  { label: "Reminders", href: "/reminders", icon: Bell },
  { label: "Instellingen", href: "/instellingen", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-icon">
          <Zap size={18} strokeWidth={2.5} />
        </div>
        <span className="logo-text">FlowCRM</span>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        <p className="nav-label">Menu</p>
        {navItems.map(({ label, href, icon: Icon }) => {
          const active =
            href === "/"
              ? pathname === "/"
              : pathname === href || pathname.startsWith(href + "/");
          return (
            <Link key={href} href={href} className={`nav-item ${active ? "active" : ""}`}>
              <Icon size={18} strokeWidth={1.8} />
              <span>{label}</span>
              {active && <ChevronRight size={14} className="nav-chevron" />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom user block */}
      <div className="sidebar-footer">
        <div className="user-avatar">N</div>
        <div className="user-info">
          <p className="user-name">Mijn Bedrijf</p>
          <p className="user-plan">Free plan</p>
        </div>
      </div>
    </aside>
  );
}