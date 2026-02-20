import Image from "next/image"
import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"
import footerLinks from "@/data/footerLinks"
import { Facebook, Instagram, Twitter, Linkedin, Github } from "lucide-react"

export function Footer() {
  return (
    <footer 
      className="w-full bg-sidebar border-t border-border mt-20" 
      data-testid="footer"
    >
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4 lg:grid-cols-5">
          
          {/* Brand Section - Column span increased to 2 for more horizontal room */}
          <div className="md:col-span-2 space-y-8">
            {/* - h-24 (96px) on mobile 
               - h-32 (128px) on desktop 
               - width={500} ensures Next.js doesn't cap the resolution
            */}
            <LocalizedClientLink href="/" className="flex transition-opacity hover:opacity-80">
              <Image
                src="/logo.png"
                width={500} 
                height={150}
                alt="Teniam Logo"
                className="h-24 md:h-32 w-auto object-contain object-left" 
                priority
              />
            </LocalizedClientLink>

            <p className="text-muted-foreground text-sm max-w-sm leading-relaxed">
              The premier marketplace for curated workspace essentials and premium creator gear.
            </p>

            {/* Social Icons */}
            <div className="flex gap-5">
              {footerLinks.connect.map(({ label, path }) => (
                <a
                  key={label}
                  href={path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors p-1"
                  aria-label={label}
                >
                  {getIcon(label)}
                </a>
              ))}
            </div>
          </div>

          {/* ... Other columns (Services, Company, Connect) ... */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">Services</h3>
            <nav className="flex flex-col gap-3">
              {footerLinks.customerServices.map(({ label, path }) => (
                <LocalizedClientLink key={label} href={path} className="text-sm text-muted-foreground hover:text-foreground transition-all">
                  {label}
                </LocalizedClientLink>
              ))}
            </nav>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">Company</h3>
            <nav className="flex flex-col gap-3">
              {footerLinks.about.map(({ label, path }) => (
                <LocalizedClientLink key={label} href={path} className="text-sm text-muted-foreground hover:text-foreground transition-all">
                  {label}
                </LocalizedClientLink>
              ))}
            </nav>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">Connect</h3>
            <div className="flex flex-col gap-3 text-sm text-muted-foreground">
              <p className="hover:text-primary transition-colors cursor-pointer">support@teniam.com</p>
              <p>Sydney, Australia</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground font-medium">
            © 2026 Teniam. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-muted-foreground">
            <LocalizedClientLink href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</LocalizedClientLink>
            <LocalizedClientLink href="/terms" className="hover:text-foreground transition-colors">Terms of Service</LocalizedClientLink>
          </div>
        </div>
      </div>
    </footer>
  )
}

function getIcon(label: string) {
  const l = label.toLowerCase();
  if (l.includes('facebook')) return <Facebook size={20} />;
  if (l.includes('instagram')) return <Instagram size={20} />;
  if (l.includes('twitter') || l.includes('x')) return <Twitter size={20} />;
  if (l.includes('linkedin')) return <Linkedin size={20} />;
  if (l.includes('github')) return <Github size={20} />;
  return null;
}