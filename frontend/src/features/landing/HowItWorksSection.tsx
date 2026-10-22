import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { HOW_IT_WORKS_STEPS } from './landingData';

gsap.registerPlugin(ScrollTrigger);

export const HowItWorksSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
      }

      gsap.from('.hiw-step', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
        y: 22,
        opacity: 0,
        duration: 0.5,
        stagger: 0.14,
        ease: 'power2.out',
      });

      gsap.from('.hiw-connector', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        },
        scaleX: 0,
        transformOrigin: 'left center',
        duration: 0.8,
        ease: 'power2.out',
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="py-20 sm:py-24 lg:py-28 bg-white border-t border-zinc-200/80"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">
            HOW IT WORKS
          </p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950">
            From scattered tasks to clear progress in three steps.
          </h2>
        </div>

        <div className="relative mt-14">
          <div
            aria-hidden="true"
            className="hiw-connector hidden lg:block absolute top-7 left-12 right-12 h-px bg-zinc-200"
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {HOW_IT_WORKS_STEPS.map((item) => (
              <div
                key={item.step}
                className="hiw-step relative rounded-2xl bg-[#FAF9F6] border border-zinc-200/90 p-6 sm:p-7"
              >
                <div className="w-11 h-11 rounded-xl bg-zinc-900 text-white font-mono text-sm font-bold flex items-center justify-center shadow-xs">
                  {item.step}
                </div>
                <h3 className="mt-6 text-lg font-bold text-zinc-950">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-zinc-600 leading-relaxed">
                  {item.description}
                </p>
                <div className="mt-5 pt-4 border-t border-zinc-200/70">
                  <span className="font-mono text-xs font-medium text-blue-700">
                    {item.meta}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
