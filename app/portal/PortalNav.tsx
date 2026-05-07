"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, Receipt, LogOut, Zap } from "lucide-react";

const NAV_ITEMS = [
  { href: "/portal/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/portal/offertes", label: "Offertes", icon: FileText },
  { href: "/portal/facturen", label: "Facturen", icon: Receipt },
];

export function PortalNav({ customerName }: { customerName: string }) {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">
          <Zap size={16} strokeWidth={2.5} />
        </div>
        <span className="logo-text">Klantportaal</span>
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link key={href} href={href} className={`nav-item${active ? " active" : ""}`}>
              <Icon size={16} strokeWidth={1.75} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="user-avatar">
          {customerName.charAt(0).toUpperCase()}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            className="user-name"
            style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
          >
            {customerName}
          </p>
        </div>
        <a
          href="/api/portal/auth/logout"
          title="Uitloggen"
          style={{
            display: "flex", alignItems: "center",
            color: "var(--text-muted)", padding: 4, borderRadius: 6,
            textDecoration: "none", transition: "color 0.15s",
          }}
        >
          <LogOut size={15} />
        </a>
      </div>
    </aside>
  );
}
