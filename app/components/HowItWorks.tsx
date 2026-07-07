const steps = [
  {
    num: '01',
    title: 'Free Consultation',
    desc: 'Reach out by phone, WhatsApp or the contact form. We listen to your setup, team size and pain points — no jargon, no sales pressure.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
      </svg>
    ),
  },
  {
    num: '02',
    title: 'Custom Proposal',
    desc: 'Within 24 hours you receive a clear, itemised proposal — scope, timeline and fixed pricing. No hidden costs, no vague estimates.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
  },
  {
    num: '03',
    title: 'Onboarding & Setup',
    desc: 'Our certified engineers arrive on-site or connect remotely. We configure your network, servers, cloud or software with zero disruption to your workday.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0H3" />
      </svg>
    ),
  },
  {
    num: '04',
    title: 'Testing & Handover',
    desc: 'Everything is tested end-to-end before we hand over. We walk your team through what was done, answer every question and make sure you are 100% comfortable.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
      </svg>
    ),
  },
  {
    num: '05',
    title: 'Ongoing Support',
    desc: 'We monitor your systems 24/7 and fix issues before they affect your business. One call or message and our engineers are on it — on-site within 2 hours.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  },
]

export default function HowItWorks() {
  return (
    <section className="relative py-28 px-4 sm:px-6 lg:px-8 overflow-hidden">

      {/* Ambient glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(44,205,222,0.06) 0%, transparent 65%)', filter: 'blur(80px)' }}
      />

      <div className="relative max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-20">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6 uppercase tracking-widest"
            style={{ background: 'rgba(44,205,222,0.07)', border: '1px solid rgba(44,205,222,0.25)', color: '#2CCDDE' }}
          >
            Our Process
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold leading-tight mb-4">
            <span className="text-white">From First Call to</span>
            <br />
            <span style={{ background: 'linear-gradient(135deg, #2CCDDE, #46A3E1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Full Delivery
            </span>
          </h2>
          <p className="text-[#5A6272] text-base max-w-lg mx-auto">
            A simple, transparent process so you always know exactly where things stand.
          </p>
        </div>

        {/* Steps — desktop horizontal timeline */}
        <div className="hidden lg:block">

          {/* Connector line */}
          <div className="relative flex items-start justify-between gap-0 mb-0">

            {/* Background connector */}
            <div
              className="absolute top-[38px] left-[10%] right-[10%] h-[1px] pointer-events-none"
              style={{ background: 'linear-gradient(90deg, rgba(44,205,222,0.08), rgba(44,205,222,0.25) 50%, rgba(44,205,222,0.08))' }}
            />

            {steps.map((step, i) => (
              <div key={step.num} className="relative flex flex-col items-center flex-1 px-4">

                {/* Dot on connector */}
                <div
                  className="w-[10px] h-[10px] rounded-full mb-6 flex-shrink-0 relative z-10 mt-[34px]"
                  style={{ background: 'linear-gradient(135deg, #2CCDDE, #46A3E1)', boxShadow: '0 0 12px rgba(44,205,222,0.5)' }}
                />

                {/* Card */}
                <div
                  className="group w-full flex flex-col gap-4 p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(44,205,222,0.1)]"
                  style={{
                    background: 'linear-gradient(160deg, rgba(44,205,222,0.06) 0%, rgba(70,163,225,0.02) 40%, #050F18 100%)',
                    border: '1px solid rgba(44,205,222,0.13)',
                  }}
                >
                  {/* Number + icon row */}
                  <div className="flex items-start justify-between">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(44,205,222,0.4)]"
                      style={{
                        background: 'linear-gradient(135deg, rgba(44,205,222,0.14), rgba(70,163,225,0.08))',
                        border: '1px solid rgba(44,205,222,0.25)',
                        color: '#2CCDDE',
                      }}
                    >
                      {step.icon}
                    </div>
                    <span
                      className="text-3xl font-black tabular-nums select-none leading-none"
                      style={{
                        background: 'linear-gradient(135deg, rgba(44,205,222,0.18), rgba(70,163,225,0.08))',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      {step.num}
                    </span>
                  </div>

                  <h3 className="text-white text-sm font-bold leading-snug group-hover:text-[#2CCDDE] transition-colors duration-200">
                    {step.title}
                  </h3>
                  <p className="text-[#5A6272] text-xs leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Steps — mobile vertical timeline */}
        <div className="lg:hidden flex flex-col">
          {steps.map((step, i) => (
            <div key={step.num} className="relative flex gap-5">

              {/* Left timeline */}
              <div className="flex flex-col items-center flex-shrink-0" style={{ width: '40px' }}>
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 z-10 text-xs font-black"
                  style={{ background: 'linear-gradient(135deg, #2CCDDE, #46A3E1)', color: '#000' }}
                >
                  {i + 1}
                </div>
                {i < steps.length - 1 && (
                  <div
                    className="w-[1px] flex-1 mt-2"
                    style={{ background: 'linear-gradient(180deg, rgba(44,205,222,0.4), rgba(44,205,222,0.05))', minHeight: '40px' }}
                  />
                )}
              </div>

              {/* Content */}
              <div
                className="group flex flex-col gap-3 p-5 rounded-2xl mb-4 flex-1 transition-all duration-300"
                style={{
                  background: 'linear-gradient(160deg, rgba(44,205,222,0.06) 0%, #050F18 100%)',
                  border: '1px solid rgba(44,205,222,0.13)',
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: 'linear-gradient(135deg, rgba(44,205,222,0.14), rgba(70,163,225,0.08))',
                      border: '1px solid rgba(44,205,222,0.25)',
                      color: '#2CCDDE',
                    }}
                  >
                    {step.icon}
                  </div>
                  <h3 className="text-white text-sm font-bold">{step.title}</h3>
                </div>
                <p className="text-[#5A6272] text-xs leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
