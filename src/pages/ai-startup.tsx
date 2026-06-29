import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Shield, Brain, Target, Zap, Mail } from "lucide-react";
import { useState, useEffect } from "react";
import Head from "next/head";

export default function AIStartupDossier() {
  const [activeSection, setActiveSection] = useState("");
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrolled = window.scrollY;
      const progress = (scrolled / documentHeight) * 100;
      setScrollProgress(progress);

      const sections = ["product", "technology", "safety", "roadmap", "early-access"];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "Essence Coaching Personal Psychology Engine",
              "applicationCategory": "BusinessApplication",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "operatingSystem": "Web",
              "description": "Multi-agent Personal Psychology Engine for self-awareness, emotional regulation, and action planning",
              "author": {
                "@type": "Person",
                "name": "Kenji Phạm",
                "jobTitle": "Essence Coach"
              },
              "publisher": {
                "@type": "Organization",
                "name": "Essence Coaching",
                "url": "https://coachkenjipham.com",
                "contactPoint": {
                  "@type": "ContactPoint",
                  "email": "contact@coachkenjipham.com",
                  "contactType": "Customer Service"
                }
              }
            })
          }}
        />
      </Head>

      <SEO 
        title="Essence Coaching AI Startup Dossier | Kenji Phạm"
        description="Essence Coaching is building a multi-agent Personal Psychology Engine for self-awareness, emotional regulation, and action planning — founded by Kenji Phạm in Vietnam."
        image="/og-image.png"
      />

      <div className="min-h-screen bg-cream text-body-text">
        <div 
          className="fixed top-0 left-0 right-0 h-0.5 bg-gold-brand z-50 transition-all duration-300"
          style={{ width: `${scrollProgress}%` }}
        />

        <nav className="fixed top-0 left-0 right-0 z-40 backdrop-blur-md bg-dark-section/90 border-b border-gold-brand/20">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gold-brand/10 border border-gold-brand/30 flex items-center justify-center">
                <span className="text-gold-brand font-serif text-sm">E</span>
              </div>
              <span className="text-sm tracking-wide text-cream-light font-normal">ESSENCE COACHING</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              {[
                { id: "product", label: "Product" },
                { id: "technology", label: "Technology" },
                { id: "safety", label: "Safety" },
                { id: "roadmap", label: "Roadmap" },
                { id: "early-access", label: "Early Access" }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`text-sm transition-colors font-light ${
                    activeSection === item.id ? "text-gold-brand" : "text-cream-light/70 hover:text-gold-brand"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <Button 
              onClick={() => scrollToSection("early-access")}
              className="bg-gold-brand hover:bg-gold text-ink font-normal"
            >
              Apply
            </Button>
          </div>
        </nav>

        <section className="pt-32 pb-32 px-6 bg-dark-section text-cream-light">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-8 px-4 py-1.5 border border-gold-brand/30 bg-gold-brand/5">
              <span className="text-xs tracking-widest text-gold-brand uppercase font-light">Essence Coaching · AI Startup Dossier</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif text-cream-light mb-8 leading-tight font-light">
              The AI-driven<br/>
              Personal Psychology Engine<br/>
              <span className="text-cream-muted">for self-awareness, emotional regulation, and action planning.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-cream-muted mb-12 max-w-3xl mx-auto leading-relaxed font-light">
              Essence Coaching helps high-responsibility individuals recognize emotional patterns, challenge limiting loops, and turn inner clarity into practical action — powered by a multi-agent AI workflow.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
              <Button 
                onClick={() => scrollToSection("early-access")}
                className="bg-gold-brand hover:bg-gold text-ink px-8 py-6 text-base font-normal tracking-wide"
              >
                Apply for Early Access
              </Button>
              <Button 
                onClick={() => scrollToSection("technology")}
                variant="outline"
                className="border-gold-brand/30 text-cream-light hover:bg-gold-brand/10 px-8 py-6 text-base font-normal tracking-wide"
              >
                View Technology Overview
              </Button>
            </div>

            <p className="text-sm text-cream-muted/60 font-light">
              Built by Kenji Phạm — Essence Coach, founder of Essence Coaching System, Vietnam.
            </p>
          </div>
        </section>

        <section className="py-32 px-6 bg-dark-section text-cream-light border-t border-gold-brand/10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-serif text-cream-light mb-8 leading-tight">
              Modern high-performers are not lacking information.<br/>
              They are drowning in inner noise.
            </h2>
            
            <div className="space-y-6 text-lg leading-relaxed">
              <p className="text-cream-muted">
                Founders, traders, leaders, and solo entrepreneurs often know what to do — but emotional loops, fear, over-control, avoidance, and identity conflict keep pulling them back.
              </p>
              
              <div className="pt-8 space-y-3">
                <p className="text-cream-light text-xl">Most tools give more content.</p>
                <p className="text-gold-brand text-2xl font-serif italic">Essence gives a reflective operating system.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="product" className="py-32 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-serif text-ink mb-16 text-center font-light">
              A multi-agent coaching intelligence system.
            </h2>
            
            <p className="text-lg text-body-text/90 mb-16 max-w-3xl mx-auto text-center leading-relaxed">
              Essence transforms raw user input — journal entries, emotional check-ins, life context, and decision points — into structured psychological insights and practical next steps.
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="p-8 border-gold/20 hover:border-gold-brand/40 transition-all bg-cream/50">
                <div className="w-12 h-12 bg-gold-brand/10 border border-gold-brand/30 flex items-center justify-center mb-6">
                  <Brain className="w-6 h-6 text-gold-brand" />
                </div>
                <h3 className="text-xl font-serif text-ink mb-3">Emotional Resonance Agent</h3>
                <p className="text-body-text/80">Names emotional conflicts safely.</p>
              </Card>

              <Card className="p-8 border-gold/20 hover:border-gold-brand/40 transition-all bg-cream/50">
                <div className="w-12 h-12 bg-gold-brand/10 border border-gold-brand/30 flex items-center justify-center mb-6">
                  <Zap className="w-6 h-6 text-gold-brand" />
                </div>
                <h3 className="text-xl font-serif text-ink mb-3">Horizon Challenge Agent</h3>
                <p className="text-body-text/80">Asks coaching-grade questions to challenge limiting loops.</p>
              </Card>

              <Card className="p-8 border-gold/20 hover:border-gold-brand/40 transition-all bg-cream/50">
                <div className="w-12 h-12 bg-gold-brand/10 border border-gold-brand/30 flex items-center justify-center mb-6">
                  <Target className="w-6 h-6 text-gold-brand" />
                </div>
                <h3 className="text-xl font-serif text-ink mb-3">Vision Reality Agent</h3>
                <p className="text-body-text/80">Turns insight into action plans, rituals, and dashboard tasks.</p>
              </Card>
            </div>
          </div>
        </section>

        <section id="technology" className="py-32 px-6 bg-dark-section text-cream-light">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-serif text-cream-light mb-16 text-center font-light">
              From raw reflection to structured action.
            </h2>

            <div className="space-y-6">
              <div className="border border-gold-brand/20 bg-dark-section/50 p-6">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-8 h-8 bg-gold-brand/20 border border-gold-brand/40 flex items-center justify-center">
                    <span className="text-gold-brand text-sm font-bold">1</span>
                  </div>
                  <h3 className="text-xl font-serif text-gold-brand">Input Layer</h3>
                </div>
                <p className="text-cream-muted pl-12">
                  Journal entries · Emotional check-ins · Life context · Goals · Decision points
                </p>
              </div>

              <div className="border border-gold-brand/20 bg-dark-section/50 p-6">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-8 h-8 bg-gold-brand/20 border border-gold-brand/40 flex items-center justify-center">
                    <span className="text-gold-brand text-sm font-bold">2</span>
                  </div>
                  <h3 className="text-xl font-serif text-gold-brand">AI Agent Layer</h3>
                </div>
                <p className="text-cream-muted pl-12">
                  Claude · GPT · Gemini · n8n workflows · Structured prompts · Safety filters
                </p>
              </div>

              <div className="border border-gold-brand/20 bg-dark-section/50 p-6">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-8 h-8 bg-gold-brand/20 border border-gold-brand/40 flex items-center justify-center">
                    <span className="text-gold-brand text-sm font-bold">3</span>
                  </div>
                  <h3 className="text-xl font-serif text-gold-brand">Psychology Engine Layer</h3>
                </div>
                <p className="text-cream-muted pl-12">
                  FCP Protocol · Emotional pattern detection · Limiting loop mapping · Identity reflection
                </p>
              </div>

              <div className="border border-gold-brand/20 bg-dark-section/50 p-6">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-8 h-8 bg-gold-brand/20 border border-gold-brand/40 flex items-center justify-center">
                    <span className="text-gold-brand text-sm font-bold">4</span>
                  </div>
                  <h3 className="text-xl font-serif text-gold-brand">Output Layer</h3>
                </div>
                <p className="text-cream-muted pl-12">
                  Personal insight report · Action plan dashboard · Follow-up prompts · Progress tracking
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-32 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-serif text-ink mb-16 text-center font-light">
              Built for a multi-model future.
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="p-8 border-gold/20 bg-cream/50">
                <h3 className="text-2xl font-serif text-ink mb-4">Claude</h3>
                <p className="text-body-text/80 leading-relaxed">
                  Emotionally nuanced analysis, reflective writing, long-form psychological reports, and safety-sensitive language.
                </p>
              </Card>

              <Card className="p-8 border-gold/20 bg-cream/50">
                <h3 className="text-2xl font-serif text-ink mb-4">OpenAI / GPT</h3>
                <p className="text-body-text/80 leading-relaxed">
                  Structured reasoning, workflow orchestration, dashboard generation, summarization, and action planning.
                </p>
              </Card>

              <Card className="p-8 border-gold/20 bg-cream/50">
                <h3 className="text-2xl font-serif text-ink mb-4">Gemini / Google Cloud</h3>
                <p className="text-body-text/80 leading-relaxed">
                  Long-context analysis, scalable infrastructure, future multimodal journaling, and analytics across user journeys.
                </p>
              </Card>

              <Card className="p-8 border-gold/20 bg-cream/50">
                <h3 className="text-2xl font-serif text-ink mb-4">AWS / Bedrock</h3>
                <p className="text-body-text/80 leading-relaxed">
                  Claude access through enterprise-grade infrastructure, scalable deployment path, and future production environment.
                </p>
              </Card>
            </div>
          </div>
        </section>

        <section id="safety" className="py-32 px-6 bg-dark-section text-cream-light">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-8">
              <div className="w-16 h-16 bg-gold-brand/20 border border-gold-brand/40 flex items-center justify-center">
                <Shield className="w-8 h-8 text-gold-brand" />
              </div>
            </div>

            <h2 className="text-4xl md:text-5xl font-serif text-cream-light mb-8 text-center">
              Built with human safety boundaries from day one.
            </h2>

            <p className="text-lg text-cream-muted mb-12 text-center leading-relaxed">
              Essence AI is not therapy, diagnosis, medical advice, crisis intervention, or emergency support.
            </p>

            <p className="text-lg text-cream-light mb-12 text-center leading-relaxed">
              It is designed for reflective coaching support, emotional self-awareness, guided journaling, and action planning. Sensitive cases are flagged for human review or referral.
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              {[
                "No diagnosis",
                "No deterministic labeling",
                "No crisis handling by AI",
                "Human review for high-risk outputs",
                "Clear escalation and referral boundaries",
                "Coaching language, not clinical claims"
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3 p-4 border border-gold-brand/20 bg-dark-section/50">
                  <CheckCircle2 className="w-5 h-5 text-gold-brand flex-shrink-0 mt-0.5" />
                  <span className="text-cream-light">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-32 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-serif text-ink mb-16 text-center font-light">
              Early product modules.
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { title: "Zero Point Map", desc: "Free self-awareness reading experience." },
                { title: "Identity Quiz", desc: "AI-generated mini report based on emotional patterns." },
                { title: "Deep Reflection Report", desc: "Personalized long-form psychological analysis." },
                { title: "90-Minute Stillness Session Support", desc: "Human-led session with AI-assisted summary." },
                { title: "Action Plan Dashboard", desc: "Structured next steps after reflection." },
                { title: "Journey Memory Layer", desc: "Progress tracking across user reflections." }
              ].map((module, index) => (
                <Card key={index} className="p-6 border-gold/20 bg-cream/50">
                  <h3 className="text-lg font-serif text-ink mb-2">{module.title}</h3>
                  <p className="text-sm text-body-text/80">{module.desc}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-32 px-6 bg-dark-section text-cream-light">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-serif text-cream-light mb-12 text-center font-light">
              Starting with Vietnam's high-responsibility professionals.
            </h2>

            <p className="text-lg text-cream-muted leading-relaxed text-center">
              Initial users include solo founders, traders, investors, coaches, creators, and leaders facing emotional overload, decision fatigue, or identity misalignment.
            </p>

            <p className="text-lg text-cream-light mt-8 leading-relaxed text-center">
              These users already pay for self-development, coaching, productivity systems, and AI tools — but lack one integrated reflective operating system.
            </p>
          </div>
        </section>

        <section className="py-32 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-serif text-ink mb-16 text-center font-light">
              Business model.
            </h2>

            <div className="space-y-4">
              {[
                "Free content for lead generation",
                "Low-ticket AI reports for validation",
                "Premium human-led coaching experiences",
                "Subscription dashboard for ongoing reflection and action planning",
                "Future B2B / B2B2C licensing for coaches, creators, and high-performance teams"
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-4 p-6 border border-gold/20 bg-cream/50">
                  <div className="w-8 h-8 bg-gold-brand/10 border border-gold-brand/30 flex items-center justify-center flex-shrink-0">
                    <span className="text-gold-brand text-sm font-bold">{index + 1}</span>
                  </div>
                  <p className="text-body-text text-lg">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-32 px-6 bg-dark-section text-cream-light">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-serif text-cream-light mb-16 text-center font-light">
              Current readiness.
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              {[
                "Official domain: coachkenjipham.com",
                "Business email: contact@coachkenjipham.com",
                "Core psychology framework documented",
                "Multi-agent workflow designed",
                "n8n automation stack in progress",
                "AI report pipeline under development",
                "Founder-led quality control",
                "Vietnam-first market positioning"
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3 p-4 border border-gold-brand/20 bg-dark-section/50">
                  <CheckCircle2 className="w-5 h-5 text-gold-brand flex-shrink-0 mt-0.5" />
                  <span className="text-cream-light">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-32 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-serif text-ink mb-16 text-center font-light">
              How API credits will be used.
            </h2>

            <div className="space-y-3">
              {[
                "Run multi-agent workflows for Early Access users",
                "Generate personalized reflection reports",
                "Test model routing between Claude, GPT, Gemini, and Bedrock",
                "Build the action-plan dashboard",
                "Improve safety filters and human-review workflows",
                "Analyze anonymized user journeys for product iteration",
                "Reduce infrastructure cost during beta"
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3 p-4 border border-gold/20 bg-cream/50">
                  <div className="w-2 h-2 bg-gold-brand flex-shrink-0 mt-2" />
                  <p className="text-body-text">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="roadmap" className="py-32 px-6 bg-dark-section text-cream-light">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-serif text-cream-light mb-20 text-center font-light">
              Roadmap.
            </h2>

            <div className="space-y-8">
              {[
                {
                  phase: "Phase 1 — Foundation",
                  desc: "Landing page, early-access form, product architecture, AI report prototype."
                },
                {
                  phase: "Phase 2 — Beta",
                  desc: "Invite first 50–100 users, test emotional check-in, quiz, AI report, and action dashboard."
                },
                {
                  phase: "Phase 3 — Multi-LLM Optimization",
                  desc: "Model routing, cost tracking, output quality scoring, human review system."
                },
                {
                  phase: "Phase 4 — Productization",
                  desc: "Subscription dashboard, journey memory, analytics, and coach-assisted workflows."
                },
                {
                  phase: "Phase 5 — Regional Expansion",
                  desc: "Vietnamese-first, then English-language Southeast Asia market."
                }
              ].map((roadmap, index) => (
                <div key={index} className="border-l-2 border-gold-brand/40 pl-8 pb-8 relative">
                  <div className="absolute -left-2.5 top-0 w-5 h-5 bg-gold-brand border-2 border-dark-section" />
                  <h3 className="text-2xl font-serif text-gold-brand mb-3">{roadmap.phase}</h3>
                  <p className="text-cream-muted leading-relaxed">{roadmap.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="early-access" className="py-32 px-6">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-serif text-ink mb-12 text-center font-light">
              Join Early Access.
            </h2>

            <p className="text-lg text-body-text/90 mb-16 text-center font-light">
              Become one of the first users shaping the Essence Psychology Engine.
            </p>

            <Card className="p-8 border-gold/20 bg-cream/50">
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-normal text-ink mb-2">Name</label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-3 border border-gold/30 bg-cream focus:outline-none focus:border-gold-brand transition-colors font-light"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-normal text-ink mb-2">Email</label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-3 border border-gold/30 bg-cream focus:outline-none focus:border-gold-brand transition-colors font-light"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="role" className="block text-sm font-normal text-ink mb-2">Role</label>
                  <input
                    type="text"
                    id="role"
                    className="w-full px-4 py-3 border border-gold/30 bg-cream focus:outline-none focus:border-gold-brand transition-colors font-light"
                    placeholder="Founder, Trader, Coach, etc."
                  />
                </div>

                <div>
                  <label htmlFor="reason" className="block text-sm font-normal text-ink mb-2">What brings you to Essence?</label>
                  <textarea
                    id="reason"
                    rows={4}
                    className="w-full px-4 py-3 border border-gold/30 bg-cream focus:outline-none focus:border-gold-brand transition-colors resize-none font-light"
                    placeholder="Share your story..."
                  />
                </div>

                <a href="mailto:contact@coachkenjipham.com?subject=Early Access Application&body=Name:%0D%0ARole:%0D%0AWhat brings me to Essence:%0D%0A" className="block">
                  <Button 
                    type="button"
                    className="w-full bg-gold-brand hover:bg-gold text-ink py-6 text-base font-normal tracking-wide"
                  >
                    Apply for Early Access
                  </Button>
                </a>

                <p className="text-xs text-center text-body-text/60 font-light">
                  Form integration pending — this will open your email client with a pre-filled template.
                </p>
              </form>
            </Card>
          </div>
        </section>

        <section className="py-32 px-6 bg-dark-section text-cream-light">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-serif text-cream-light mb-12 font-light">
              A human-centered AI company, built from Vietnam.
            </h2>

            <p className="text-lg text-cream-muted mb-16 leading-relaxed font-light">
              Essence is seeking API credits, cloud infrastructure support, and technical partnership to validate a multi-agent, safety-aware, AI-native coaching product.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
              <Button 
                onClick={() => scrollToSection("early-access")}
                className="bg-gold-brand hover:bg-gold text-ink px-8 py-6 text-base font-normal tracking-wide"
              >
                Apply for Early Access
              </Button>
              <a href="mailto:contact@coachkenjipham.com">
                <Button 
                  variant="outline"
                  className="border-gold-brand/30 text-cream-light hover:bg-gold-brand/10 px-8 py-6 text-base font-normal tracking-wide w-full"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Contact Us
                </Button>
              </a>
            </div>

            <p className="text-sm text-cream-muted font-light">
              contact@coachkenjipham.com
            </p>
          </div>
        </section>

        <footer className="py-16 px-6 border-t border-gold/20">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-sm text-body-text/60 font-light">
              © 2026 Essence Coaching. Built with care in Vietnam.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}