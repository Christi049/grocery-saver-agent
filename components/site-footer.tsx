"use client"
import { Twitter, Instagram, Linkedin } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto max-w-6xl px-4 py-4">
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <div className="flex items-center gap-4">
            <span className="sr-only">Socials</span>
            <Twitter className="h-5 w-5 text-foreground/80" aria-label="Twitter" />
            <Instagram className="h-5 w-5 text-foreground/80" aria-label="Instagram" />
            <Linkedin className="h-5 w-5 text-foreground/80" aria-label="LinkedIn" />
          </div>
          <div className="grid grid-cols-1 gap-2 text-xs text-foreground/70 sm:grid-cols-3 sm:gap-6">
            <div>ISO 9001: Dummy Certified</div>
            <div>hello@savecart.example • 123 Market St, Food City</div>
            <div>Support • Terms • Privacy</div>
          </div>
        </div>
      </div>
      <div className="border-t py-3 text-center text-xs text-foreground/60">© {new Date().getFullYear()} SaverCart</div>
    </footer>
  )
}
