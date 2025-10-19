import { useState, useCallback, useEffect } from "react"
import { motion, AnimatePresence, useAnimation, useInView } from "framer-motion"

type TechDemo = {
  id: string
  title: string
  description: string
  category: "AI" | "Blockchain" | "IoT" | "AR/VR" | "Web3" | "Cloud"
  icon: string
  demo: string
  technologies: string[]
  accent: "cyan" | "magenta" | "emerald"
}

const TECH_DEMOS: TechDemo[] = [
  {
    id: "ai-assistant",
    title: "AI-Powered Assistant",
    description: "Intelligent automation that learns and adapts to your workflow",
    category: "AI",
    icon: "🤖",
    demo: "Try asking: 'Analyze our user engagement patterns'",
    technologies: ["TensorFlow", "Python", "React", "OpenAI API"],
    accent: "cyan"
  },
  {
    id: "blockchain-payment",
    title: "Blockchain Payment Gateway",
    description: "Secure, decentralized payment processing with smart contracts",
    category: "Blockchain",
    icon: "⛓️",
    demo: "Experience: Instant cross-border transactions",
    technologies: ["Solidity", "Web3.js", "Ethereum", "MetaMask"],
    accent: "emerald"
  },
  {
    id: "iot-monitoring",
    title: "IoT Environmental Monitor",
    description: "Real-time sensor data collection and environmental analysis",
    category: "IoT",
    icon: "📡",
    demo: "Live data: Air quality, temperature, humidity tracking",
    technologies: ["Arduino", "MQTT", "React Native", "Grafana"],
    accent: "magenta"
  },
  {
    id: "ar-experience",
    title: "AR Learning Platform",
    description: "Immersive educational experiences through augmented reality",
    category: "AR/VR",
    icon: "🥽",
    demo: "Interactive: 3D molecular structures in your space",
    technologies: ["Unity", "ARCore", "C#", "WebXR"],
    accent: "cyan"
  },
  {
    id: "web3-dapp",
    title: "Web3 Social Platform",
    description: "Decentralized social networking with NFT integration",
    category: "Web3",
    icon: "🌐",
    demo: "Connect: Your digital identity across platforms",
    technologies: ["IPFS", "Ethereum", "React", "The Graph"],
    accent: "emerald"
  },
  {
    id: "cloud-ai",
    title: "Cloud AI Pipeline",
    description: "Scalable machine learning infrastructure in the cloud",
    category: "Cloud",
    icon: "☁️",
    demo: "Scale: From prototype to production in minutes",
    technologies: ["AWS", "Kubernetes", "TensorFlow", "Docker"],
    accent: "magenta"
  }
]

const ACCENT_STYLES = {
  cyan: {
    gradient: "from-cyan-200 via-blue-200 to-teal-200",
    border: "border-cyan-200/40",
    bg: "bg-cyan-200/10",
    text: "text-cyan-200",
    glow: "shadow-[0_0_20px_rgba(126,227,255,0.3)]"
  },
  magenta: {
    gradient: "from-fuchsia-200 via-pink-200 to-purple-200",
    border: "border-fuchsia-200/40",
    bg: "bg-fuchsia-200/10",
    text: "text-fuchsia-200",
    glow: "shadow-[0_0_20px_rgba(236,72,153,0.3)]"
  },
  emerald: {
    gradient: "from-emerald-200 via-teal-200 to-lime-200",
    border: "border-emerald-200/40",
    bg: "bg-emerald-200/10",
    text: "text-emerald-200",
    glow: "shadow-[0_0_20px_rgba(52,211,153,0.3)]"
  }
}

// Advanced animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

const itemVariants = {
  hidden: { 
    opacity: 0, 
    y: 30,
    scale: 0.9,
    rotateX: -15
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12,
      duration: 0.6
    }
  },
  hover: {
    scale: 1.05,
    rotateY: 5,
    z: 50,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20
    }
  }
}

const techCardVariants = {
  hidden: { 
    opacity: 0, 
    y: 50,
    rotateX: -20,
    scale: 0.8
  },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 15,
      duration: 0.8
    }
  },
  hover: {
    scale: 1.08,
    rotateY: 8,
    rotateX: -5,
    z: 100,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25
    }
  }
}

const timelineVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
      duration: 0.8
    }
  }
}

const particleVariants = {
  hidden: { opacity: 0, scale: 0 },
  visible: {
    opacity: [0, 1, 0],
    scale: [0, 1, 0],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
}

export default function InnovationLab({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [selectedDemo, setSelectedDemo] = useState<TechDemo | null>(null)
  const [activeCategory, setActiveCategory] = useState<string>("all")
  const [hoveredDemo, setHoveredDemo] = useState<string | null>(null)
  const controls = useAnimation()

  const categories = ["all", ...Array.from(new Set(TECH_DEMOS.map(demo => demo.category)))]
  const filteredDemos = activeCategory === "all" 
    ? TECH_DEMOS 
    : TECH_DEMOS.filter(demo => demo.category === activeCategory)

  const handleDemoClick = useCallback((demo: TechDemo) => {
    setSelectedDemo(demo)
  }, [])

  useEffect(() => {
    if (isOpen) {
      controls.start("visible")
    } else {
      controls.start("hidden")
    }
  }, [isOpen, controls])

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6 py-8 sm:py-16 safe-area-top safe-area-bottom"
      >
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-[#030b14]/95 backdrop-blur-2xl"
          onClick={onClose}
        />
        
        {/* Content */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0, rotateX: -20 }}
          animate={{ scale: 1, opacity: 1, rotateX: 0 }}
          exit={{ scale: 0.8, opacity: 0, rotateX: 20 }}
          transition={{ 
            type: "spring", 
            stiffness: 100, 
            damping: 20, 
            duration: 0.8 
          }}
          className="relative w-full max-w-6xl max-h-[85vh] sm:max-h-[90vh] overflow-y-auto rounded-2xl sm:rounded-3xl border border-white/10 bg-black/60 px-4 sm:px-8 py-8 sm:py-12 backdrop-blur-2xl shadow-[0_0_60px_rgba(126,227,255,0.25)]"
          style={{ perspective: "1000px" }}
        >
          {/* Header */}
          <motion.div 
            className="mb-8 text-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h2 
              className="mb-4 text-3xl font-light uppercase tracking-[0.1em] text-white/90 sm:text-4xl" 
              style={{fontFamily:'"Michroma","Orbitron","Rajdhani",sans-serif'}}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
            >
              Innovation <motion.span 
                className="bg-gradient-to-r from-cyan-200 via-blue-200 to-teal-200 bg-clip-text text-transparent"
                animate={{ 
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  ease: "linear" 
                }}
                style={{ 
                  backgroundSize: "200% 100%"
                }}
              >
                Lab
              </motion.span>
            </motion.h2>
            <motion.div 
              className="mx-auto h-px w-20 bg-gradient-to-r from-transparent via-white/40 to-transparent"
              variants={itemVariants}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
            />
            <motion.p 
              className="mt-4 text-white/70"
              variants={itemVariants}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              Explore our cutting-edge technology demonstrations
            </motion.p>
          </motion.div>

          {/* Category Filter */}
          <motion.div 
            className="mb-8 flex flex-wrap justify-center gap-2"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {categories.map((category, index) => (
              <motion.button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === category
                    ? "bg-cyan-200/20 text-cyan-200 border border-cyan-200/40 shadow-[0_0_20px_rgba(126,227,255,0.3)]"
                    : "bg-white/5 text-white/60 border border-white/20 hover:bg-white/10 hover:text-white/80 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                }`}
                style={{fontFamily:'"Share Tech Mono","Rajdhani","Orbitron",monospace'}}
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.1, 
                  rotateY: 5,
                  transition: { type: "spring", stiffness: 400, damping: 20 }
                }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20, rotateX: -15 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                {category === "all" ? "All Technologies" : category}
              </motion.button>
            ))}
          </motion.div>

          {/* Tech Demos Grid */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredDemos.map((demo, index) => {
              const accent = ACCENT_STYLES[demo.accent]
              return (
                <motion.div
                  key={demo.id}
                  variants={techCardVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  whileTap={{ scale: 0.95 }}
                  className={`group relative overflow-hidden rounded-2xl border ${accent.border} ${accent.bg} p-6 cursor-pointer transition-all duration-500 ${accent.glow}`}
                  onClick={() => handleDemoClick(demo)}
                  onHoverStart={() => setHoveredDemo(demo.id)}
                  onHoverEnd={() => setHoveredDemo(null)}
                  style={{ 
                    transformStyle: "preserve-3d",
                    perspective: "1000px"
                  }}
                >
                  {/* Particle Effects */}
                  {hoveredDemo === demo.id && (
                    <div className="absolute inset-0 pointer-events-none">
                      {[...Array(8)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-1 h-1 bg-cyan-200 rounded-full"
                          style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                          }}
                          variants={particleVariants}
                          initial="hidden"
                          animate="visible"
                          transition={{ delay: i * 0.1 }}
                        />
                      ))}
                    </div>
                  )}
                  
                  <motion.div 
                    className="flex items-start gap-4 mb-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    <motion.div 
                      className="text-3xl"
                      whileHover={{ 
                        rotate: 360, 
                        scale: 1.2,
                        transition: { duration: 0.6, ease: "easeInOut" }
                      }}
                    >
                      {demo.icon}
                    </motion.div>
                    <div className="flex-1">
                      <motion.h3 
                        className="text-lg font-semibold text-white mb-1"
                        whileHover={{ x: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        {demo.title}
                      </motion.h3>
                      <motion.span 
                        className={`inline-block px-2 py-1 text-xs rounded-full ${accent.bg} ${accent.text} border ${accent.border}`}
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        {demo.category}
                      </motion.span>
                    </div>
                  </motion.div>
                  
                  <p className="text-sm text-white/70 mb-4">{demo.description}</p>
                  
                  <div className="mb-4">
                    <div className="text-xs text-white/60 mb-2">Technologies:</div>
                    <div className="flex flex-wrap gap-1">
                      {demo.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-1 text-xs rounded border border-white/20 bg-white/5 text-white/70"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className={`text-sm ${accent.text} font-medium`}>
                    {demo.demo}
                  </div>
                </motion.div>
              )
            })}
          </motion.div>

          {/* Interactive Timeline */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <motion.h3 
              className="text-xl font-semibold text-white mb-6 text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
            >
              Our Innovation Journey
            </motion.h3>
            <div className="relative">
              <motion.div 
                className="absolute left-1/2 transform -translate-x-1/2 w-px h-full bg-gradient-to-b from-cyan-200/20 via-white/20 to-emerald-200/20"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: 1.2, duration: 1.5, ease: "easeOut" }}
                style={{ transformOrigin: "top" }}
              />
              
              {[
                { year: "2020", milestone: "Founded CaveBeat", description: "Started with a vision to bridge technology and innovation" },
                { year: "2021", milestone: "First AI Project", description: "Developed our first machine learning solution" },
                { year: "2022", milestone: "Blockchain Integration", description: "Launched blockchain-based payment systems" },
                { year: "2023", milestone: "AR/VR Expansion", description: "Entered immersive technology space" },
                { year: "2024", milestone: "Global Reach", description: "Serving clients across 15+ countries" },
                { year: "2025", milestone: "Founded NovaSearch, LunchBuddy & Inventra", description: "Successfully delivering third-party chatbots for businesses" }
              ].map((item, index) => (
                <motion.div 
                  key={item.year} 
                  className={`relative flex items-center mb-8 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100, scale: 0.8 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ 
                    delay: 1.5 + index * 0.3, 
                    duration: 0.8, 
                    type: "spring", 
                    stiffness: 100, 
                    damping: 15 
                  }}
                  whileHover={{ scale: 1.05 }}
                >
                  <motion.div 
                    className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}
                    whileHover={{ x: index % 2 === 0 ? 10 : -10 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <motion.div 
                      className="bg-black/40 backdrop-blur-sm rounded-xl p-4 border border-white/10"
                      whileHover={{ 
                        scale: 1.05, 
                        rotateY: index % 2 === 0 ? 5 : -5,
                        boxShadow: "0 20px 40px rgba(126,227,255,0.2)"
                      }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <motion.div 
                        className="text-cyan-200 font-semibold text-lg"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.8 + index * 0.3, duration: 0.5 }}
                      >
                        {item.year}
                      </motion.div>
                      <motion.div 
                        className="text-white font-medium"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 2 + index * 0.3, duration: 0.5 }}
                      >
                        {item.milestone}
                      </motion.div>
                      <motion.div 
                        className="text-white/70 text-sm mt-1"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 2.2 + index * 0.3, duration: 0.5 }}
                      >
                        {item.description}
                      </motion.div>
                    </motion.div>
                  </motion.div>
                  <motion.div 
                    className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-cyan-200 rounded-full border-2 border-black"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 1.7 + index * 0.3, duration: 0.5 }}
                    whileHover={{ 
                      scale: 1.5, 
                      boxShadow: "0 0 20px rgba(126,227,255,0.8)",
                      transition: { duration: 0.3 }
                    }}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 2.5, duration: 0.8, type: "spring", stiffness: 100 }}
          >
            <motion.div 
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
              whileHover={{ 
                scale: 1.02, 
                boxShadow: "0 20px 40px rgba(126,227,255,0.15)",
                transition: { duration: 0.3 }
              }}
            >
              <motion.h3 
                className="text-xl font-semibold text-white mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.7, duration: 0.6 }}
              >
                Ready to Build the Future?
              </motion.h3>
              <motion.p 
                className="text-white/70 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.9, duration: 0.6 }}
              >
                Let's turn your innovative ideas into reality
              </motion.p>
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 3.1, duration: 0.6 }}
              >
                <motion.a
                  href="mailto:hello@cavebeat.com?subject=Innovation%20Lab%20Inquiry"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-cyan-200/60 bg-gradient-to-r from-[#0d1f2b]/85 via-[#113144]/85 to-[#0d1f2b]/85 text-cyan-100 hover:from-[#123548]/90 hover:via-[#17445a]/90 hover:to-[#123548]/90 hover:text-white transition-all duration-300"
                  whileHover={{ 
                    scale: 1.1, 
                    rotateY: 5,
                    boxShadow: "0 10px 30px rgba(126,227,255,0.4)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <motion.span
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    🚀
                  </motion.span>
                  <span>Start Your Project</span>
                </motion.a>
                <motion.button
                  onClick={onClose}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/20 bg-white/5 text-white/80 hover:bg-white/10 transition-colors duration-200"
                  whileHover={{ 
                    scale: 1.05, 
                    rotateY: -5,
                    boxShadow: "0 10px 30px rgba(255,255,255,0.1)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <motion.span
                    whileHover={{ rotate: 90 }}
                    transition={{ duration: 0.3 }}
                  >
                    ✕
                  </motion.span>
                  <span>Close Lab</span>
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
