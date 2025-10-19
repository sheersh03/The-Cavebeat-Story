import Starfield from "../three/Starfield"
import TopNav from "../components/TopNav"
import { useCallback, useEffect, useState } from "react"

type Client = {
  name: string
  logo: string
  industry: string
  description: string
  accent: "cyan" | "magenta" | "emerald"
}

type CaseStudy = {
  id: string
  title: string
  client: string
  category: string
  description: string
  image: string
  technologies: string[]
  results: string[]
  accent: "cyan" | "magenta" | "emerald"
}

const TOP_CLIENTS: Client[] = [
  {
    name: "TechCorp Solutions",
    logo: "🏢",
    industry: "Enterprise Software",
    description: "Digital transformation across 50+ departments",
    accent: "cyan"
  },
  {
    name: "FinanceFlow",
    logo: "💳",
    industry: "Fintech",
    description: "Blockchain-based payment infrastructure",
    accent: "emerald"
  },
  {
    name: "HealthTech Innovations",
    logo: "🏥",
    industry: "Healthcare",
    description: "AI-powered diagnostic platform",
    accent: "magenta"
  },
  {
    name: "EcoSystems",
    logo: "🌱",
    industry: "Sustainability",
    description: "IoT environmental monitoring solutions",
    accent: "emerald"
  },
  {
    name: "EduPlatform",
    logo: "📚",
    industry: "Education",
    description: "Immersive learning experiences with AR/VR",
    accent: "cyan"
  },
  {
    name: "RetailMax",
    logo: "🛒",
    industry: "E-commerce",
    description: "Omnichannel retail transformation",
    accent: "magenta"
  }
]

const CASE_STUDIES: CaseStudy[] = [
  {
    id: "fintech-platform",
    title: "Next-Gen Payment Platform",
    client: "FinanceFlow",
    category: "Fintech",
    description: "Built a scalable blockchain-based payment infrastructure serving 2M+ users with 99.9% uptime.",
    image: "💳",
    technologies: ["React", "Node.js", "Blockchain", "AWS", "Docker"],
    results: ["2M+ Active Users", "99.9% Uptime", "50% Cost Reduction", "3x Faster Transactions"],
    accent: "emerald"
  },
  {
    id: "healthcare-ai",
    title: "AI Diagnostic Assistant",
    client: "HealthTech Innovations",
    category: "Healthcare",
    description: "Developed an AI-powered diagnostic platform that improved accuracy by 40% and reduced diagnosis time by 60%.",
    image: "🏥",
    technologies: ["Python", "TensorFlow", "React", "PostgreSQL", "Docker"],
    results: ["40% Accuracy Improvement", "60% Faster Diagnosis", "500+ Hospitals", "98% User Satisfaction"],
    accent: "magenta"
  },
  {
    id: "iot-monitoring",
    title: "Environmental Monitoring System",
    client: "EcoSystems",
    category: "IoT",
    description: "Created a comprehensive IoT solution for real-time environmental monitoring across 15 countries.",
    image: "🌱",
    technologies: ["IoT", "React Native", "Python", "AWS IoT", "Grafana"],
    results: ["15 Countries", "10K+ Sensors", "Real-time Data", "95% Accuracy"],
    accent: "emerald"
  },
  {
    id: "ar-learning",
    title: "Immersive Learning Platform",
    client: "EduPlatform",
    category: "AR/VR",
    description: "Built an AR/VR learning platform that increased student engagement by 75% and improved learning outcomes by 45%.",
    image: "📚",
    technologies: ["Unity", "C#", "WebXR", "React", "Three.js"],
    results: ["75% Engagement Increase", "45% Better Outcomes", "50K+ Students", "4.8/5 Rating"],
    accent: "cyan"
  }
]

const ACCENT_STYLES = {
  cyan: {
    gradient: "from-cyan-200 via-blue-200 to-teal-200",
    border: "border-cyan-200/40",
    bg: "bg-cyan-200/10",
    text: "text-cyan-200"
  },
  magenta: {
    gradient: "from-fuchsia-200 via-pink-200 to-purple-200",
    border: "border-fuchsia-200/40",
    bg: "bg-fuchsia-200/10",
    text: "text-fuchsia-200"
  },
  emerald: {
    gradient: "from-emerald-200 via-teal-200 to-lime-200",
    border: "border-emerald-200/40",
    bg: "bg-emerald-200/10",
    text: "text-emerald-200"
  }
}

export default function Work() {
  const [hoveredCase, setHoveredCase] = useState<string | null>(null)

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#030b14]">
      <Starfield />
      <TopNav />
      
      {/* Hero Section */}
      <section className="relative z-10 flex min-h-screen items-center justify-center px-4 sm:px-6 py-12 sm:py-16 safe-area-top">
        <div className="w-full max-w-7xl text-center">
          <div className="mb-6 sm:mb-8">
            <h1 className="mb-4 sm:mb-6 text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-light uppercase tracking-[0.1em] text-white/90" style={{fontFamily:'"Michroma","Orbitron","Rajdhani",sans-serif'}}>
              Our <span className="bg-gradient-to-r from-cyan-200 via-blue-200 to-teal-200 bg-clip-text text-transparent">Work</span>
            </h1>
            <div className="mx-auto h-px w-20 bg-gradient-to-r from-transparent via-white/40 to-transparent sm:w-28" />
            <p className="mx-auto mt-6 max-w-3xl text-lg text-white/70 sm:text-xl">
              Transforming ideas into digital reality through innovative technology solutions
            </p>
          </div>
          
          {/* Success Metrics */}
          <div className="mx-auto mb-8 sm:mb-12 grid max-w-4xl grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-3">
            <div className="group relative overflow-hidden rounded-2xl border border-cyan-200/20 bg-black/20 px-6 py-8 backdrop-blur-sm transition-all duration-300 hover:border-cyan-200/40 hover:bg-black/30">
              <div className="text-center">
                <div className="mb-2 text-3xl font-bold text-cyan-200 sm:text-4xl">358</div>
                <div className="text-sm uppercase tracking-[0.2em] text-white/70">Happy Customers</div>
              </div>
            </div>
            
            <div className="group relative overflow-hidden rounded-2xl border border-emerald-200/20 bg-black/20 px-6 py-8 backdrop-blur-sm transition-all duration-300 hover:border-emerald-200/40 hover:bg-black/30">
              <div className="text-center">
                <div className="mb-2 text-3xl font-bold text-emerald-200 sm:text-4xl">150+</div>
                <div className="text-sm uppercase tracking-[0.2em] text-white/70">Projects Delivered</div>
              </div>
            </div>
            
            <div className="group relative overflow-hidden rounded-2xl border border-fuchsia-200/20 bg-black/20 px-6 py-8 backdrop-blur-sm transition-all duration-300 hover:border-fuchsia-200/40 hover:bg-black/30">
              <div className="text-center">
                <div className="mb-2 text-3xl font-bold text-fuchsia-200 sm:text-4xl">99.9%</div>
                <div className="text-sm uppercase tracking-[0.2em] text-white/70">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Top Clients Section */}
      <section className="relative z-10 px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-light uppercase tracking-[0.1em] text-white/90 sm:text-4xl" style={{fontFamily:'"Michroma","Orbitron","Rajdhani",sans-serif'}}>
              Our <span className="bg-gradient-to-r from-cyan-200 via-blue-200 to-teal-200 bg-clip-text text-transparent">Top Clients</span>
            </h2>
            <div className="mx-auto h-px w-20 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
            <p className="mt-6 text-white/70">Trusted by industry leaders worldwide</p>
          </div>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {TOP_CLIENTS.map((client, index) => {
              const accent = ACCENT_STYLES[client.accent]
              return (
                <div
                  key={client.name}
                  className={`group relative overflow-hidden rounded-2xl border ${accent.border} ${accent.bg} px-6 py-8 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-lg`}
                  style={{
                    animationDelay: `${index * 0.1}s`,
                    animation: 'fadeInUp 0.6s ease-out forwards'
                  }}
                >
                  <div className="mb-4 flex items-center gap-4">
                    <div className="text-3xl">{client.logo}</div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{client.name}</h3>
                      <p className="text-sm text-white/60">{client.industry}</p>
                    </div>
                  </div>
                  <p className="text-sm text-white/70">{client.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Case Studies Section */}
      <section className="relative z-10 px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-light uppercase tracking-[0.1em] text-white/90 sm:text-4xl" style={{fontFamily:'"Michroma","Orbitron","Rajdhani",sans-serif'}}>
              Featured <span className="bg-gradient-to-r from-cyan-200 via-blue-200 to-teal-200 bg-clip-text text-transparent">Case Studies</span>
            </h2>
            <div className="mx-auto h-px w-20 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
            <p className="mt-6 text-white/70">Real projects, real results</p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {CASE_STUDIES.map((study, index) => {
              const accent = ACCENT_STYLES[study.accent]
              return (
                <div
                  key={study.id}
                  className={`group relative overflow-hidden rounded-3xl border ${accent.border} ${accent.bg} p-8 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl`}
                  onMouseEnter={() => setHoveredCase(study.id)}
                  onMouseLeave={() => setHoveredCase(null)}
                >
                  <div className="mb-6 flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">{study.image}</div>
                      <div>
                        <h3 className="text-xl font-semibold text-white">{study.title}</h3>
                        <p className="text-sm text-white/60">{study.client} • {study.category}</p>
                      </div>
                    </div>
                  </div>
                  
                  <p className="mb-6 text-white/70">{study.description}</p>
                  
                  <div className="mb-6">
                    <h4 className="mb-3 text-sm font-semibold uppercase tracking-[0.1em] text-white/80">Technologies</h4>
                    <div className="flex flex-wrap gap-2">
                      {study.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs text-white/70"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="mb-3 text-sm font-semibold uppercase tracking-[0.1em] text-white/80">Results</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {study.results.map((result) => (
                        <div key={result} className="text-sm text-white/70">
                          • {result}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <div className="rounded-3xl border border-white/10 bg-black/40 px-8 py-12 backdrop-blur-2xl">
            <h2 className="mb-4 text-2xl font-light uppercase tracking-[0.1em] text-white/90 sm:text-3xl" style={{fontFamily:'"Michroma","Orbitron","Rajdhani",sans-serif'}}>
              Ready to Start Your Project?
            </h2>
            <p className="mb-8 text-white/70">
              Let's transform your ideas into digital reality
            </p>
            <a
              href="mailto:hello@cavebeat.com?subject=New%20Project%20Inquiry"
              className="group relative inline-flex items-center justify-center rounded-full border border-cyan-200/60 bg-gradient-to-r from-[#0d1f2b]/85 via-[#113144]/85 to-[#0d1f2b]/85 px-10 py-3 font-heading text-xs font-semibold uppercase tracking-[0.2em] text-cyan-100 transition-all duration-300 hover:from-[#123548]/90 hover:via-[#17445a]/90 hover:to-[#123548]/90 hover:text-white focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-200/70"
            >
              <span className="relative z-10">Get Started</span>
              <span className="pointer-events-none absolute inset-px rounded-full bg-gradient-to-r from-cyan-200/12 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </a>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}