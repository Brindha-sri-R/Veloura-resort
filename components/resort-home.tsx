import { HeroSection } from "@/components/hero-section"
import { RitualsSection } from "@/components/rituals-section"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { StaySection } from "@/components/stay-section"

export function ResortHome() {
  return (
    <div className="page-shell">
      <SiteHeader />
      <main>
        <HeroSection />
        <StaySection />
        <RitualsSection />
      </main>
      <SiteFooter />
    </div>
  )
}
