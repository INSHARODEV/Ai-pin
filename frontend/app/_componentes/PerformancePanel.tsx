'use client';

import { ChevronDown, Check, X } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { AudioPlayer } from './AudioPlayer';

type Props = {
  transcription?: any;
  /** Forces placeholder. If omitted, placeholder shows when no transcription. */
  showPlaceholder?: boolean;
};

export const MainDashboard: React.FC<Props> = ({
  transcription,
  showPlaceholder,
}) => {
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [complianceOpen, setComplianceOpen] = useState(false);
  const [engagementOpen, setEngagementOpen] = useState(false);

  useEffect(() => {
    // debug
    // console.log('transcription', transcription);
  }, [transcription]);

  const compliance = transcription?.turns?.[0]?.compliance_flags ?? {};
  const engagement = transcription?.turns?.[0]?.engagement_metrics ?? {};

  const shouldShowPlaceholder = showPlaceholder || !transcription;

  if (shouldShowPlaceholder) {
    // Placeholder matches your Figma (0% card + dimmed blocks)
    return (
      <main className='flex-1 px-6 overflow-y-auto'>
        <section className='mb-6 shadow-custom rounded-2xl bg-[#FEFEFE]'>
          <div className='p-6 flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <div className='w-14 h-14 bg-[#22C55E1A] rounded-full' />
              <div>
                <p className='text-sm text-muted-foreground'>
                  Overall Performance:
                </p>
                <p className='text-3xl font-bold'>0%</p>
              </div>
            </div>
            <span className='inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500'>
              —
            </span>
          </div>
        </section>

        {[
          'Conversation Recording',
          'Conversation Summary',
          'Compliance & Behavior',
          'Engagement Metrics',
        ].map(label => (
          <section key={label} className='mb-3'>
            <div className='w-full px-6 py-4 rounded-2xl bg-[#FEFEFE] shadow-custom flex items-center justify-between opacity-60'>
              <h3 className='text-lg font-semibold'>{label}</h3>
              <div className='w-4 h-4' />
            </div>
          </section>
        ))}
      </main>
    );
  }

  // Real content
  return (
    <main className='flex-1 px-6 overflow-y-auto'>
      {/* Performance */}
      <AudioPlayer transcription={transcription} />

      <section className='hover:scale-[101%] mb-6 shadow-custom rounded-2xl bg-[#FEFEFE]'>
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
                <p className='text-3xl font-bold text-foreground'>
                  {transcription?.performance ?? 0}%
                </p>
              </div>
            </div>
          </div>
          <span className='inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-success/10 text-success'>
            {transcription?.turns?.[0]?.tone_sentiment || 'Neutral'}
          </span>
        </div>
      </section>

      {/* Conversation Summary */}
      <section className='hover:scale-[101%] mb-6 flex flex-col gap-2'>
        <button
          onClick={() => setSummaryOpen(v => !v)}
          className='w-full px-6 py-4 rounded-2xl bg-[#FEFEFE] flex items-center justify-between shadow-custom'
          aria-expanded={summaryOpen}
        >
          <h3 className='text-lg font-semibold'>Conversation Summary</h3>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${summaryOpen ? 'rotate-180' : ''}`}
          />
        </button>
        {summaryOpen && (
          <div className='px-6 pb-6 pt-4 rounded-2xl bg-[#FEFEFE]'>
            <p className='text-sm text-muted-foreground leading-relaxed'>
              {transcription?.summary || 'No summary available.'}
            </p>
          </div>
        )}
      </section>

      {/* Compliance & Behavior */}
      <section className='hover:scale-[101%] mb-6 flex flex-col gap-2'>
        <button
          onClick={() => setComplianceOpen(v => !v)}
          className='w-full px-6 py-4 rounded-2xl bg-[#FEFEFE] flex items-center justify-between shadow-custom'
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
              {Object.entries(compliance).map(([key, value]) => (
                <li key={key} className='flex items-center justify-between'>
                  <span className='text-sm'>{key.replace(/_/g, ' ')}:</span>
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      value ? 'bg-success' : 'bg-destructive'
                    }`}
                  >
                    {value ? (
                      <Check className='w-4 h-4 text-white' />
                    ) : (
                      <X className='w-4 h-4 text-white' />
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* Engagement Metrics */}
      <section className='hover:scale-[101%] flex flex-col gap-2'>
        <button
          onClick={() => setEngagementOpen(v => !v)}
          className='w-full px-6 py-4 rounded-2xl bg-[#FEFEFE] flex items-center justify-between shadow-custom'
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
              <div className='flex justify-between text-sm'>
                <span>Sales Talk Ratio:</span>
                <span>{engagement.talk_ratio_rep_pct ?? 0}%</span>
              </div>
              <div className='flex justify-between text-sm'>
                <span>Customer Talk Ratio:</span>
                <span>{engagement.talk_ratio_cust_pct ?? 0}%</span>
              </div>
            </div>

            <div className='flex justify-between text-sm'>
              <span>Empathy words:</span>
              <span>{engagement.empathy_word_count ?? 0}</span>
            </div>

            <div className='flex justify-between text-sm'>
              <span>Avg response time (s):</span>
              <span>{engagement.avg_response_time_sec ?? 0}</span>
            </div>
          </div>
        )}
      </section>
    </main>
  );
};
