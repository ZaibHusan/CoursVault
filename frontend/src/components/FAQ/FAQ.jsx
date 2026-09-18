import React, { useState } from 'react'
import './FAQ.css'
import { ChevronDown } from 'lucide-react'

export default function FAQ() {
    const [activeIndex, setActiveIndex] = useState(null)

    const faqs = [
        {
            question: "How do I get course access?",
            answer: "We send the Google Drive link to your email and WhatsApp within 1 hour after payment verification."
        },
        {
            question: "How long does verification take?",
            answer: "Usually under 1 hour. We manually verify each payment."
        },
        {
            question: "What payment methods do you accept?",
            answer: "UPI & Bank for India, JazzCash, EasyPaisa & Bank for Pakistan, Crypto for international."
        },
        {
            question: "What if the course link doesn't work?",
            answer: "We'll fix it or give you a full refund. Simple."
        },
        {
            question: "Is it lifetime access?",
            answer: "Yes. Once you get the link, it's yours forever."
        }
    ];

    const toggleFAQ = (index) => {
        setActiveIndex(activeIndex === index ? null : index)
    }

    return (
        <section className="faq-section">
            <div className="container">
                <div className="faq-header">
                    <span className="faq-subtitle">GOT QUESTIONS?</span>
                    <h2 className="faq-main-title">Frequently Asked <span>Questions</span></h2>
                    <p className="faq-description">
                        Everything you need to know about course access, payments, and learning on CoursesGuy.
                    </p>
                </div>

                <div className="faq-list">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className={`faq-item ${activeIndex === index ? 'active' : ''}`}
                            onClick={() => toggleFAQ(index)}
                        >
                            <div className="faq-question">
                                <h3>{faq.question}</h3>
                                <span className={`faq-icon ${activeIndex === index ? 'rotate' : ''}`}>
                                    <ChevronDown size={18} />
                                </span>
                            </div>
                            <div className="faq-answer">
                                <p>{faq.answer}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}