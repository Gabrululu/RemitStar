import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { faqs } from '../../data/mockData';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 md:py-32 px-5 md:px-8 lg:px-12 bg-black">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-14 md:mb-20"
        >
          <div>
            <p className="text-[#747878] text-[0.7rem] font-semibold uppercase tracking-[0.2em] mb-4">Got questions?</p>
            <h2 className="section-headline text-white">
              Frequently<br />asked<br /><span className="text-white/25">questions.</span>
            </h2>
          </div>
          <div className="max-w-xs">
            <p className="text-[#8e9191] text-sm leading-relaxed">
              Still have questions? We're available on Discord and Twitter — or drop us an email.
            </p>
            <a href="#" className="inline-flex items-center gap-1.5 text-[#bdf500] text-sm font-semibold mt-3 hover:gap-2.5 transition-all duration-200">
              Contact us →
            </a>
          </div>
        </motion.div>

        <div className="border-t border-white/[0.07]">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="border-b border-white/[0.07]"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between gap-6 py-6 text-left group"
              >
                <span
                  className="font-semibold text-[0.95rem] leading-snug transition-colors duration-200"
                  style={{ color: openIndex === i ? '#ffffff' : '#c4c7c7' }}
                >
                  {faq.question}
                </span>
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all duration-300"
                  style={{
                    background: openIndex === i ? '#bdf500' : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${openIndex === i ? '#bdf500' : 'rgba(255,255,255,0.1)'}`,
                  }}
                >
                  {openIndex === i ? (
                    <Minus size={12} className="text-black" />
                  ) : (
                    <Plus size={12} className="text-white/60 group-hover:text-white transition-colors" />
                  )}
                </div>
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.28, ease: [0.65, 0.05, 0, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="text-[#8e9191] text-sm leading-relaxed pb-6 max-w-2xl">{faq.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
