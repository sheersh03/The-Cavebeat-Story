import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

type NewsletterSignupProps = {
  isOpen: boolean
  onClose: () => void
}

type FormData = {
  email: string
  name: string
  company: string
  interests: string[]
  disclosure: "full" | "limited" | "none"
}

const INTEREST_OPTIONS = [
  { id: "tech-updates", label: "Technology Updates", emoji: "🚀" },
  { id: "project-insights", label: "Project Insights", emoji: "💡" },
  { id: "industry-news", label: "Industry News", emoji: "📰" },
  { id: "case-studies", label: "Case Studies", emoji: "📊" },
  { id: "events", label: "Events & Webinars", emoji: "🎪" },
  { id: "partnerships", label: "Partnership Opportunities", emoji: "🤝" }
]

const DISCLOSURE_OPTIONS = [
  {
    value: "none",
    label: "No Disclosure",
    description: "Maximum privacy - no data sharing",
    recommended: true,
    emoji: "🛡️"
  },
  {
    value: "limited",
    label: "Limited Disclosure",
    description: "Basic information sharing only",
    recommended: false,
    emoji: "🔒"
  },
  {
    value: "full",
    label: "Full Disclosure",
    description: "Complete information sharing",
    recommended: false,
    emoji: "📢"
  }
]

export default function NewsletterSignup({ isOpen, onClose }: NewsletterSignupProps) {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    name: "",
    company: "",
    interests: [],
    disclosure: "none"
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleInputChange = (field: keyof FormData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleInterestToggle = (interestId: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interestId)
        ? prev.interests.filter(id => id !== interestId)
        : [...prev.interests, interestId]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Here you would typically send the data to your newsletter service
      console.log("Newsletter signup data:", formData)
      
      setSubmitted(true)
    } catch (error) {
      console.error("Newsletter signup error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData({
      email: "",
      name: "",
      company: "",
      interests: [],
      disclosure: "none"
    })
    setSubmitted(false)
  }

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
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative w-full max-w-2xl max-h-[85vh] sm:max-h-[90vh] overflow-y-auto rounded-2xl sm:rounded-3xl border border-white/10 bg-black/60 px-4 sm:px-8 py-8 sm:py-12 backdrop-blur-2xl shadow-[0_0_60px_rgba(126,227,255,0.25)]"
        >
          {!submitted ? (
            <>
              {/* Header */}
              <div className="mb-8 text-center">
                <h2 className="mb-4 text-3xl font-light uppercase tracking-[0.1em] text-white/90 sm:text-4xl" style={{fontFamily:'"Michroma","Orbitron","Rajdhani",sans-serif'}}>
                  Newsletter <span className="bg-gradient-to-r from-cyan-200 via-blue-200 to-teal-200 bg-clip-text text-transparent">Signup</span>
                </h2>
                <div className="mx-auto h-px w-20 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                <p className="mt-4 text-white/70">Stay updated with our latest innovations and insights</p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email */}
                <div>
                  <label className="block mb-2 text-sm font-semibold text-white/80">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-white/20 bg-white/5 text-white placeholder-white/40 focus:border-cyan-200/50 focus:bg-white/10 transition-colors duration-200"
                    placeholder="cavebeatindia@gmail.com"
                  />
                </div>

                {/* Name */}
                <div>
                  <label className="block mb-2 text-sm font-semibold text-white/80">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-white/20 bg-white/5 text-white placeholder-white/40 focus:border-cyan-200/50 focus:bg-white/10 transition-colors duration-200"
                    placeholder="Your full name"
                  />
                </div>

                {/* Company */}
                <div>
                  <label className="block mb-2 text-sm font-semibold text-white/80">Company</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => handleInputChange("company", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-white/20 bg-white/5 text-white placeholder-white/40 focus:border-cyan-200/50 focus:bg-white/10 transition-colors duration-200"
                    placeholder="Your company name"
                  />
                </div>

                {/* Interests */}
                <div>
                  <label className="block mb-2 text-sm font-semibold text-white/80">What interests you? (Select all that apply)</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {INTEREST_OPTIONS.map((option) => (
                      <label
                        key={option.id}
                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-200 ${
                          formData.interests.includes(option.id)
                            ? "border-cyan-200/50 bg-cyan-200/10"
                            : "border-white/20 bg-white/5 hover:border-white/30"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={formData.interests.includes(option.id)}
                          onChange={() => handleInterestToggle(option.id)}
                          className="sr-only"
                        />
                        <span className="text-lg">{option.emoji}</span>
                        <span className="text-sm text-white/80">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Disclosure Preference */}
                <div>
                  <label className="block mb-4 text-sm font-semibold text-white/80">Data Disclosure Preference</label>
                  <div className="space-y-3">
                    {DISCLOSURE_OPTIONS.map((option) => (
                      <label
                        key={option.value}
                        className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                          formData.disclosure === option.value
                            ? "border-cyan-200/50 bg-cyan-200/10"
                            : "border-white/20 bg-white/5 hover:border-white/30"
                        } ${option.recommended ? "ring-2 ring-emerald-200/30" : ""}`}
                      >
                        <input
                          type="radio"
                          name="disclosure"
                          value={option.value}
                          checked={formData.disclosure === option.value}
                          onChange={(e) => handleInputChange("disclosure", e.target.value as "full" | "limited" | "none")}
                          className="sr-only"
                        />
                        <span className="text-xl">{option.emoji}</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-white">{option.label}</span>
                            {option.recommended && (
                              <span className="px-2 py-1 text-xs bg-emerald-200/20 text-emerald-200 rounded-full">
                                RECOMMENDED
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-white/60 mt-1">{option.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-6 py-3 rounded-xl border border-white/20 bg-white/5 text-white/80 hover:bg-white/10 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-6 py-3 rounded-xl border border-cyan-200/60 bg-gradient-to-r from-[#0d1f2b]/85 via-[#113144]/85 to-[#0d1f2b]/85 text-cyan-100 hover:from-[#123548]/90 hover:via-[#17445a]/90 hover:to-[#123548]/90 hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Subscribing..." : "Subscribe"}
                  </button>
                </div>
              </form>
            </>
          ) : (
            /* Success State */
            <div className="text-center">
              <div className="mb-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-200/20 flex items-center justify-center">
                  <span className="text-3xl">✓</span>
                </div>
                <h3 className="text-2xl font-semibold text-white mb-2">Successfully Subscribed!</h3>
                <p className="text-white/70">
                  Thank you for joining our newsletter. You'll receive updates based on your preferences.
                </p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={resetForm}
                  className="flex-1 px-6 py-3 rounded-xl border border-white/20 bg-white/5 text-white/80 hover:bg-white/10 transition-colors duration-200"
                >
                  Subscribe Another
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 px-6 py-3 rounded-xl border border-cyan-200/60 bg-gradient-to-r from-[#0d1f2b]/85 via-[#113144]/85 to-[#0d1f2b]/85 text-cyan-100 hover:from-[#123548]/90 hover:via-[#17445a]/90 hover:to-[#123548]/90 hover:text-white transition-all duration-300"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
