"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navigation = [
  { href: "/", label: "Home" },
  { href: "/story", label: "Our Story" },
  { href: "/timeline", label: "Timeline" },
  { href: "/map", label: "Interactive Map" },
  { href: "/archive", label: "Archive" },
  { href: "/about", label: "About" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "dark") {
      setDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  function toggleDark() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  return (
    <header className="site-header">
      <Link href="/" className="site-brand">
        <Image
          src="/icon.svg"
          alt=""
          className="brand-mark-image"
          width={56}
          height={56}
          priority
          unoptimized
        />
        <span className="site-brand-text">Cupertino Voices</span>
      </Link>

      <div className="site-header-right">
        <nav aria-label="Main navigation">
          {navigation.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={active ? "nav-link active" : "nav-link"}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          className="theme-toggle"
          aria-label="Toggle light or dark mode"
          onClick={toggleDark}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            {dark
              ? <circle cx="12" cy="12" r="5" />
              : <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />}
          </svg>
          {dark ? "Light" : "Dark"}
        </button>
      </div>
    </header>
  );
}
