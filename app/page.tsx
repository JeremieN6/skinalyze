import SiteHeader from './_components/site-header';
import SiteFooter from './_components/site-footer';
import HeroSection from './_sections/hero-section';
import BenefitsSection from './_sections/benefits-section';
import ProcessSection from './_sections/process-section';
import PricingSection from './_sections/pricing-section';
import DemoFormSection from './_sections/demo-form-section';
import TestimonialsSection from './_sections/testimonials-section';
import CtaSection from './_sections/cta-section';
import FaqSection from './_sections/faq-section';

export default function HomePage() {
  return (
    <div style={{ fontFamily: 'Inter, sans-serif', background: '#FAF8F4' }}>
      <SiteHeader />
      <HeroSection />
      <BenefitsSection />
      <ProcessSection />
      <PricingSection />
      <DemoFormSection />
      <TestimonialsSection />
      <CtaSection />
      <FaqSection />
      <SiteFooter />
    </div>
  );
}
