import { Check, ChevronDown, TrendingUp, X } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

export const MainDashboard = () => {
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [complianceOpen, setComplianceOpen] = useState(false);
  const [engagementOpen, setEngagementOpen] = useState(false);
  let variant;
  let variantIcon: React.ReactNode;

  if (variant === 'green') {
    variantIcon = (
      <Image src='/arrow-up.svg' alt='Up' width={30} height={30} priority />
    );
  } else if (variant === 'red') {
    variantIcon = (
      <Image src='/arrow-down.svg' alt='Down' width={30} height={30} priority />
    );
  } else if (variant === 'orange') {
    variantIcon = (
      <Image
        src='/arrow-minimize.svg'
        alt='Minimize'
        width={30}
        height={30}
        priority
      />
    );
  } else if (variant === 'blue') {
    // variantIcon = icon ?? null;
    variantIcon = (
      <Image src='/profile-icon.svg' alt='Up' width={30} height={30} priority />
    );
  }

  return (
    <main className='flex-1 px-6 overflow-y-auto'>
      {/* Header */}

      {/* Performance */}
      <section className='mb-6 shadow-custom rounded-2xl bg-card'>
        <div className='p-6 flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <div className='flex items-center gap-2'>
              <div className='w-14 h-14 bg-[#22C55E1A] rounded-full flex items-center justify-center'>
                <Image
                  src='/arrow-up.svg'
                  alt='Up'
                  width={30}
                  height={30}
                  priority
                />
              </div>
              <div>
                <p className='text-sm text-muted-foreground'>
                  Overall Performance:
                </p>
                <p className='text-3xl font-bold text-foreground'>98%</p>
              </div>
            </div>
          </div>
          <span className='inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-success/10 text-success'>
            Friendly
          </span>
        </div>
      </section>

      {/* Recording Controls */}
      <section className='mb-6 shadow-custom rounded-2xl bg-card'>
        <div className='p-4 flex items-center gap-3'>
          <button className='p-1.5 rounded-full bg-[#0D70C81A] hover:bg-[#0D70C82A]'>
            <Image alt='fd' src='/pause.svg' width={19} height={19} />
          </button>
          <span className='text-sm font-medium'>Conversation Recording</span>
        </div>
      </section>

      {/* Conversation Summary */}
      <section className='mb-6 shadow-custom rounded-2xl bg-card overflow-hidden'>
        <button
          onClick={() => setSummaryOpen(v => !v)}
          className='w-full px-6 py-4 flex items-center justify-between hover:bg-muted/50'
          aria-expanded={summaryOpen}
        >
          <h3 className='text-lg font-semibold'>Conversation Summary</h3>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${summaryOpen ? 'rotate-180' : ''}`}
          />
        </button>
        {summaryOpen && (
          <div className='px-6 pb-6'>
            <p className='text-sm text-muted-foreground leading-relaxed'>
              The customer asked about the availability of the iPhone 15 Pro in
              black. The salesperson confirmed it's in stock and explained the
              current promotion offering 10% off for trade-ins. The customer
              inquired about financing options, and the salesperson outlined the
              12-month and 24-month installment plans. The customer decided to
              visit the store later today to finalize the purchase.
            </p>
          </div>
        )}
      </section>

      {/* Compliance & Behavior */}
      <section className='mb-6 shadow-custom rounded-2xl bg-card overflow-hidden'>
        <button
          onClick={() => setComplianceOpen(v => !v)}
          className='w-full px-6 py-4 flex items-center justify-between hover:bg-muted/50'
          aria-expanded={complianceOpen}
        >
          <h3 className='text-lg font-semibold'>Compliance &amp; Behavior</h3>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${complianceOpen ? 'rotate-180' : ''}`}
          />
        </button>
        {complianceOpen && (
          <div className='px-6 pb-6'>
            <ul className='space-y-3'>
              <li className='flex items-center justify-between'>
                <span className='text-sm'>Profanity:</span>
                <div className='w-6 h-6 bg-success rounded-full flex items-center justify-center'>
                  <Check className='w-4 h-4 text-white' />
                </div>
              </li>
              <li className='flex items-center justify-between'>
                <span className='text-sm'>Rude language:</span>
                <div className='w-6 h-6 bg-destructive rounded-full flex items-center justify-center'>
                  <X className='w-4 h-4 text-white' />
                </div>
              </li>
              <li className='flex items-center justify-between'>
                <span className='text-sm'>Non-compliant promises:</span>
                <div className='w-6 h-6 bg-destructive rounded-full flex items-center justify-center'>
                  <X className='w-4 h-4 text-white' />
                </div>
              </li>
              <li className='flex items-center justify-between'>
                <span className='text-sm'>Unapproved discounts:</span>
                <div className='w-6 h-6 bg-destructive rounded-full flex items-center justify-center'>
                  <X className='w-4 h-4 text-white' />
                </div>
              </li>
              <li className='flex items-center justify-between'>
                <span className='text-sm'>Missed greeting or closing:</span>
                <div className='w-6 h-6 bg-destructive rounded-full flex items-center justify-center'>
                  <X className='w-4 h-4 text-white' />
                </div>
              </li>
            </ul>
          </div>
        )}
      </section>

      {/* Engagement Metrics */}
      <section className='shadow-custom rounded-2xl bg-card overflow-hidden'>
        <button
          onClick={() => setEngagementOpen(v => !v)}
          className='w-full px-6 py-4 flex items-center justify-between hover:bg-muted/50'
          aria-expanded={engagementOpen}
        >
          <h3 className='text-lg font-semibold'>Engagement Metrics</h3>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${engagementOpen ? 'rotate-180' : ''}`}
          />
        </button>
        {engagementOpen && (
          <div className='px-6 pb-6 space-y-4'>
            <div>
              <div className='flex items-center justify-between mb-2'>
                <span className='text-sm font-medium'>Talk Ratio:</span>
              </div>
              <div className='flex items-center gap-2'>
                <span className='text-xs text-muted-foreground'>Sales</span>
                <div className='flex-1 bg-muted rounded-full h-2 overflow-hidden'>
                  <div
                    className='h-full bg-sales-avatar'
                    style={{ width: '85%' }}
                  />
                </div>
                <div
                  className='bg-customer-avatar rounded-full h-2'
                  style={{ width: '15%', minWidth: '30px' }}
                />
                <span className='text-xs text-muted-foreground'>Customer</span>
              </div>
              <div className='flex justify-between text-xs text-muted-foreground mt-1'>
                <span>85%</span>
                <span>15%</span>
              </div>
            </div>

            <div className='flex items-center justify-between'>
              <span className='text-sm'>Empathy words:</span>
              <div className='flex items-center gap-1'>
                <div className='w-6 h-6 bg-primary rounded-full flex items-center justify-center'>
                  <span className='text-xs text-white font-medium'>4</span>
                </div>
                <span className='text-xs text-muted-foreground'>words</span>
              </div>
            </div>

            <div className='flex items-center justify-between'>
              <span className='text-sm'>Average response time:</span>
              <div className='flex items-center gap-1'>
                <div className='w-10 h-6 bg-primary rounded-full flex items-center justify-center'>
                  <span className='text-xs text-white font-medium'>0.2</span>
                </div>
                <span className='text-xs text-muted-foreground'>seconds</span>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
};
