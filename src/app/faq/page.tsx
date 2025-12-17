import React from 'react'

const FAQS = [
  { q: 'How do I list a sneaker?', a: 'Go to Add Listing and fill out the form. You will need to be logged in.' },
  { q: 'How do I contact a seller?', a: 'Open the seller profile and use the message button to start a conversation.' },
  { q: 'What are accepted payment methods?', a: 'We accept card payments; sellers may accept local pickup or third-party payment options.' }
]

export default function FAQPage() {
  return (
    <main>
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-4">FAQ / Support</h1>
        <div className="space-y-4">
          {FAQS.map((f, i) => (
            <div key={i} className="p-4 bg-white rounded shadow-sm">
              <div className="font-semibold">{f.q}</div>
              <div className="text-sm text-muted-foreground mt-2">{f.a}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
