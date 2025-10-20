import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

type PrivacyNoticeProps = {
  isOpen: boolean
  onClose: () => void
}

export default function PrivacyNotice({ isOpen, onClose }: PrivacyNoticeProps) {
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
          className="relative w-full max-w-4xl max-h-[85vh] sm:max-h-[90vh] overflow-y-auto rounded-2xl sm:rounded-3xl border border-white/10 bg-black/60 px-4 sm:px-8 py-8 sm:py-12 backdrop-blur-2xl shadow-[0_0_60px_rgba(126,227,255,0.25)]"
        >
          {/* Header */}
          <div className="mb-8 text-center">
            <h2 className="mb-4 text-3xl font-light uppercase tracking-[0.1em] text-white/90 sm:text-4xl" style={{fontFamily:'"Michroma","Orbitron","Rajdhani",sans-serif'}}>
              Privacy <span className="bg-gradient-to-r from-cyan-200 via-blue-200 to-teal-200 bg-clip-text text-transparent">Notice</span>
            </h2>
            <div className="mx-auto h-px w-20 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          </div>

          {/* Content */}
          <div className="space-y-6 text-white/80">
            {/* Our Commitment */}
            <section>
              <h3 className="mb-4 text-xl font-semibold text-white">Our Privacy Commitment</h3>
              <p className="mb-4 leading-relaxed">
                At CaveBeat, we value and prioritize your privacy above all else. We believe that your personal information should remain exactly that—personal. Our commitment to privacy is not just a policy; it's a fundamental principle that guides everything we do.
              </p>
              <div className="rounded-2xl border border-cyan-200/20 bg-cyan-200/5 p-6">
                <div className="flex items-start gap-4">
                  <div className="text-2xl">🛡️</div>
                  <div>
                    <h4 className="mb-2 text-lg font-semibold text-cyan-200">No Disclosure Policy</h4>
                    <p className="text-sm leading-relaxed">
                      We <strong>strongly recommend</strong> selecting the "No Disclosure" option when signing up for our services. This ensures your information remains completely private and is never shared with third parties.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* What We Collect */}
            <section>
              <h3 className="mb-4 text-xl font-semibold text-white">What We Collect</h3>
              <div className="space-y-4">
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <h4 className="mb-2 font-semibold text-white">Essential Information Only</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Contact details (email, phone) for project communication</li>
                    <li>• Project requirements and technical specifications</li>
                    <li>• Communication history for service continuity</li>
                  </ul>
                </div>
                <div className="rounded-xl border border-emerald-200/20 bg-emerald-200/5 p-4">
                  <h4 className="mb-2 font-semibold text-emerald-200">What We DON'T Collect</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Personal browsing data or website analytics</li>
                    <li>• Location tracking or GPS data</li>
                    <li>• Social media profiles or personal photos</li>
                    <li>• Financial information beyond project payments</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Data Protection */}
            <section>
              <h3 className="mb-4 text-xl font-semibold text-white">How We Protect Your Data</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-xl">🔒</div>
                    <h4 className="font-semibold text-white">Encryption</h4>
                  </div>
                  <p className="text-sm">All data is encrypted in transit and at rest using industry-standard protocols.</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-xl">🚫</div>
                    <h4 className="font-semibold text-white">No Sharing</h4>
                  </div>
                  <p className="text-sm">We never sell, rent, or share your information with third parties without explicit consent.</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-xl">🗑️</div>
                    <h4 className="font-semibold text-white">Data Retention</h4>
                  </div>
                  <p className="text-sm">We only keep data as long as necessary for project completion and legal compliance.</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-xl">👤</div>
                    <h4 className="font-semibold text-white">Your Rights</h4>
                  </div>
                  <p className="text-sm">You can request data deletion, modification, or access at any time.</p>
                </div>
              </div>
            </section>

            {/* No Disclosure Recommendation */}
            <section className="rounded-2xl border border-emerald-200/30 bg-gradient-to-r from-emerald-200/10 to-cyan-200/10 p-6">
              <div className="flex items-start gap-4">
                <div className="text-3xl">⭐</div>
                <div>
                  <h3 className="mb-3 text-xl font-semibold text-white">Recommended: No Disclosure</h3>
                  <p className="mb-4 leading-relaxed">
                    For maximum privacy protection, we strongly recommend choosing the <strong>"No Disclosure"</strong> option when signing up. This ensures:
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li>• Your information stays completely private</li>
                    <li>• No data sharing with external parties</li>
                    <li>• Enhanced security and confidentiality</li>
                    <li>• Full control over your personal data</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Contact Information */}
            <section>
              <h3 className="mb-4 text-xl font-semibold text-white">Questions About Privacy?</h3>
              <p className="mb-4">
                If you have any questions about our privacy practices or want to exercise your rights, please contact us:
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href="mailto:cavebeatindia@gmail.com?subject=Privacy%20Inquiry"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-cyan-200/40 bg-cyan-200/10 text-cyan-200 hover:bg-cyan-200/20 transition-colors duration-200"
                >
                  <span>📧</span>
                  <span>cavebeatindia@gmail.com</span>
                </a>
                <a 
                  href="mailto:cavebeatindia@gmail.com?subject=Privacy%20Inquiry"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/20 bg-white/5 text-white/80 hover:bg-white/10 transition-colors duration-200"
                >
                  <span>💬</span>
                  <span>General Inquiries</span>
                </a>
              </div>
            </section>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-white/60">
                Last updated: {new Date().toLocaleDateString()}
              </p>
              <button
                onClick={onClose}
                className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-white/20 bg-white/5 text-white/80 hover:bg-white/10 transition-colors duration-200"
              >
                <span>✓</span>
                <span>I Understand</span>
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
