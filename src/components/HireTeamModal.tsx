import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { handleHireTeamSubmission } from "../api/hire-team"

interface HireTeamFormData {
  name: string
  email: string
  phone: string
  company: string
  projectType: string
  budget: string
  timeline: string
  message: string
  preferredContact: string
}

const PROJECT_TYPES = [
  "Web Development",
  "Mobile App Development", 
  "AI/ML Solutions",
  "Blockchain Development",
  "AR/VR Applications",
  "Cloud Infrastructure",
  "Data Analytics",
  "Custom Software",
  "Other"
]

const BUDGET_RANGES = [
  "Under $10K",
  "$10K - $25K", 
  "$25K - $50K",
  "$50K - $100K",
  "$100K - $250K",
  "$250K+"
]

const TIMELINE_OPTIONS = [
  "ASAP (Rush Project)",
  "1-2 weeks",
  "1 month",
  "2-3 months", 
  "3-6 months",
  "6+ months"
]

const containerVariants = {
  hidden: { 
    opacity: 0, 
    scale: 0.8,
    rotateX: -15,
    y: 50
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    rotateX: 0,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
      duration: 0.6
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.8,
    rotateX: 15,
    y: -50,
    transition: { duration: 0.3 }
  }
}

const formVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { delay: 0.2, duration: 0.5 }
  }
}

const successVariants = {
  hidden: { opacity: 0, scale: 0.8, rotateY: -90 },
  visible: { 
    opacity: 1, 
    scale: 1,
    rotateY: 0,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 20,
      duration: 0.8
    }
  }
}

export default function HireTeamModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [formData, setFormData] = useState<HireTeamFormData>({
    name: "",
    email: "",
    phone: "",
    company: "",
    projectType: "",
    budget: "",
    timeline: "",
    message: "",
    preferredContact: "email"
  })
  
  const [errors, setErrors] = useState<Partial<HireTeamFormData>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const validateForm = useCallback(() => {
    const newErrors: Partial<HireTeamFormData> = {}
    
    if (!formData.name.trim()) newErrors.name = "Name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email"
    }
    if (!formData.phone.trim()) newErrors.phone = "Phone is required"
    if (!formData.company.trim()) newErrors.company = "Company is required"
    if (!formData.projectType) newErrors.projectType = "Project type is required"
    if (!formData.budget) newErrors.budget = "Budget range is required"
    if (!formData.timeline) newErrors.timeline = "Timeline is required"
    if (!formData.message.trim()) newErrors.message = "Project description is required"
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData])

  const handleInputChange = useCallback((field: keyof HireTeamFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }, [errors])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsSubmitting(true)
    
    try {
      const result = await handleHireTeamSubmission(formData)
      
      if (result.success) {
        setIsSuccess(true)
        // Reset form after success
        setTimeout(() => {
          setFormData({
            name: "",
            email: "",
            phone: "",
            company: "",
            projectType: "",
            budget: "",
            timeline: "",
            message: "",
            preferredContact: "email"
          })
          setIsSuccess(false)
          onClose()
        }, 3000)
      } else {
        throw new Error('Submission failed')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      // Show actual error to user
      alert(`Failed to submit form: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsSubmitting(false)
    }
  }, [formData, validateForm, onClose])

  const handleClose = useCallback(() => {
    console.log('Close button clicked, isSubmitting:', isSubmitting)
    if (!isSubmitting) {
      // Check if form has any data entered
      const hasFormData = formData.name || formData.email || formData.phone || formData.company || 
                         formData.projectType || formData.budget || formData.timeline || formData.message
      
      if (hasFormData) {
        // Show confirmation dialog if user has started filling the form
        const confirmed = window.confirm(
          "You have unsaved changes. Are you sure you want to close this form? You'll be redirected to the Hire Us page."
        )
        if (!confirmed) {
          return // User cancelled, don't close
        }
      }
      
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        projectType: "",
        budget: "",
        timeline: "",
        message: "",
        preferredContact: "email"
      })
      setErrors({})
      setIsSuccess(false)
      onClose()
      
      // Redirect to Hire Us page after closing
      setTimeout(() => {
        window.location.href = '/#services'
      }, 300) // Small delay to allow modal close animation
    }
  }, [isSubmitting, onClose, formData])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/95"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          
          {/* Modal */}
          <motion.div
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-black rounded-2xl border border-white/20 shadow-2xl">
              {/* Header */}
              <motion.div 
                className="relative p-6 border-b border-white/10"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
              >
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    handleClose()
                  }}
                  className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors cursor-pointer z-10 group"
                  title="Close form and return to Hire Us page"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  {/* Tooltip */}
                  {/* <div className="absolute top-8 right-0 bg-black/90 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                    Close & Return to Hire Us
                  </div> */}
                </button>
                
                <motion.div
                  className="text-center"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <h2 className="text-2xl font-bold text-white mb-2">Hire Our Expert Team</h2>
                  <p className="text-white/70">Let's build something extraordinary together</p>
                </motion.div>
              </motion.div>

              {/* Content */}
              <div className="p-6">
                <AnimatePresence mode="wait">
                  {!isSuccess ? (
                    <motion.form
                      key="form"
                      variants={formVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      onSubmit={handleSubmit}
                      className="space-y-6"
                    >
                      {/* Personal Information */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-white mb-2">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            className={`w-full px-4 py-3 rounded-lg bg-white/5 border ${
                              errors.name ? 'border-red-400' : 'border-white/20'
                            } text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all cursor-text`}
                            placeholder="Your full name"
                            disabled={isSubmitting}
                          />
                          {errors.name && (
                            <p className="text-red-400 text-sm mt-1">{errors.name}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-white mb-2">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className={`w-full px-4 py-3 rounded-lg bg-white/5 border ${
                              errors.email ? 'border-red-400' : 'border-white/20'
                            } text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all`}
                            placeholder="cavebeatindia@gmail.com"
                            disabled={isSubmitting}
                          />
                          {errors.email && (
                            <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-white mb-2">
                            Phone Number * <span className="text-white/60 text-xs">(International format)</span>
                          </label>
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            className={`w-full px-4 py-3 rounded-lg bg-white/5 border ${
                              errors.phone ? 'border-red-400' : 'border-white/20'
                            } text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all`}
                            placeholder="+918448802078"
                            disabled={isSubmitting}
                          />
                          <p className="text-white/60 text-xs mt-1">
                            Use international format: +[country code][number] (e.g., +918448802078)
                          </p>
                          {errors.phone && (
                            <p className="text-red-400 text-sm mt-1">{errors.phone}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-white mb-2">
                            Company/Organization *
                          </label>
                          <input
                            type="text"
                            value={formData.company}
                            onChange={(e) => handleInputChange('company', e.target.value)}
                            className={`w-full px-4 py-3 rounded-lg bg-white/5 border ${
                              errors.company ? 'border-red-400' : 'border-white/20'
                            } text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all`}
                            placeholder="Your company name"
                            disabled={isSubmitting}
                          />
                          {errors.company && (
                            <p className="text-red-400 text-sm mt-1">{errors.company}</p>
                          )}
                        </div>
                      </div>

                      {/* Project Details */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-white mb-2">
                            Project Type *
                          </label>
                          <select
                            value={formData.projectType}
                            onChange={(e) => handleInputChange('projectType', e.target.value)}
                            className={`w-full px-4 py-3 rounded-lg bg-white/5 border ${
                              errors.projectType ? 'border-red-400' : 'border-white/20'
                            } text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all`}
                            disabled={isSubmitting}
                          >
                            <option value="">Select project type</option>
                            {PROJECT_TYPES.map(type => (
                              <option key={type} value={type} className="bg-gray-800">
                                {type}
                              </option>
                            ))}
                          </select>
                          {errors.projectType && (
                            <p className="text-red-400 text-sm mt-1">{errors.projectType}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-white mb-2">
                            Budget Range *
                          </label>
                          <select
                            value={formData.budget}
                            onChange={(e) => handleInputChange('budget', e.target.value)}
                            className={`w-full px-4 py-3 rounded-lg bg-white/5 border ${
                              errors.budget ? 'border-red-400' : 'border-white/20'
                            } text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all`}
                            disabled={isSubmitting}
                          >
                            <option value="">Select budget</option>
                            {BUDGET_RANGES.map(range => (
                              <option key={range} value={range} className="bg-gray-800">
                                {range}
                              </option>
                            ))}
                          </select>
                          {errors.budget && (
                            <p className="text-red-400 text-sm mt-1">{errors.budget}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-white mb-2">
                            Timeline *
                          </label>
                          <select
                            value={formData.timeline}
                            onChange={(e) => handleInputChange('timeline', e.target.value)}
                            className={`w-full px-4 py-3 rounded-lg bg-white/5 border ${
                              errors.timeline ? 'border-red-400' : 'border-white/20'
                            } text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all`}
                            disabled={isSubmitting}
                          >
                            <option value="">Select timeline</option>
                            {TIMELINE_OPTIONS.map(timeline => (
                              <option key={timeline} value={timeline} className="bg-gray-800">
                                {timeline}
                              </option>
                            ))}
                          </select>
                          {errors.timeline && (
                            <p className="text-red-400 text-sm mt-1">{errors.timeline}</p>
                          )}
                        </div>
                      </div>

                      {/* Project Description */}
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          Project Description *
                        </label>
                        <textarea
                          value={formData.message}
                          onChange={(e) => handleInputChange('message', e.target.value)}
                          rows={4}
                          className={`w-full px-4 py-3 rounded-lg bg-white/5 border ${
                            errors.message ? 'border-red-400' : 'border-white/20'
                          } text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all resize-none`}
                          placeholder="Tell us about your project goals, requirements, and any specific features you need..."
                          disabled={isSubmitting}
                        />
                        {errors.message && (
                          <p className="text-red-400 text-sm mt-1">{errors.message}</p>
                        )}
                      </div>

                      {/* Preferred Contact */}
                      <div>
                        <label className="block text-sm font-medium text-white mb-3">
                          Preferred Contact Method
                        </label>
                        <div className="flex space-x-4">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="preferredContact"
                              value="email"
                              checked={formData.preferredContact === "email"}
                              onChange={(e) => handleInputChange('preferredContact', e.target.value)}
                              className="mr-2 text-cyan-400 focus:ring-cyan-400"
                              disabled={isSubmitting}
                            />
                            <span className="text-white">Email</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="preferredContact"
                              value="phone"
                              checked={formData.preferredContact === "phone"}
                              onChange={(e) => handleInputChange('preferredContact', e.target.value)}
                              className="mr-2 text-cyan-400 focus:ring-cyan-400"
                              disabled={isSubmitting}
                            />
                            <span className="text-white">Phone</span>
                          </label>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-4">
                        <motion.button
                          type="button"
                          onClick={handleClose}
                          disabled={isSubmitting}
                          className="flex-1 py-4 px-6 border border-white/20 text-white font-semibold rounded-lg hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/40 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Cancel
                        </motion.button>
                        
                        <motion.button
                          type="submit"
                          disabled={isSubmitting}
                          className="flex-1 py-4 px-6 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {isSubmitting ? (
                            <div className="flex items-center justify-center">
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                              Submitting...
                            </div>
                          ) : (
                            "Send Project Request"
                          )}
                        </motion.button>
                      </div>
                    </motion.form>
                  ) : (
                    <motion.div
                      key="success"
                      variants={successVariants}
                      initial="hidden"
                      animate="visible"
                      className="text-center py-8"
                    >
                      <motion.div
                        className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                      >
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </motion.div>
                      
                      <motion.h3
                        className="text-2xl font-bold text-white mb-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                      >
                        Thank You for Your Interest!
                      </motion.h3>
                      
                      <motion.p
                        className="text-white/80 text-lg leading-relaxed"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                      >
                        Thank you for your interest in our vision! Let's build something great together. 
                        Our experts will contact you shortly to discuss your project requirements.
                      </motion.p>
                      
                      <motion.div
                        className="mt-6 text-sm text-white/60"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8, duration: 0.5 }}
                      >
                        This window will close automatically in a few seconds...
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
