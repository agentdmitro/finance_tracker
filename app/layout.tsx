import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "FinanceTracker AI",
  description: "Простий облік витрат з місячною статистикою"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900">
        <div className="mx-auto max-w-4xl px-4 py-8">
          <header className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-ink">FinanceTracker AI</h1>
              <p className="text-sm text-slate-600">Простий трекер витрат з категоріями та місячними підсумками.</p>
            </div>
            <nav className="flex gap-4 text-sm font-medium text-slate-700">
              <a href="/expenses" className="hover:text-ink">
                Витрати
              </a>
              <a href="/categories" className="hover:text-ink">
                Категорії
              </a>
            </nav>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
