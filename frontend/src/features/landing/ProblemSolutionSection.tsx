import React, { useRef } from 'react';
import { ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { PROBLEM_SOLUTION_ITEMS } from './landingData';

gsap.registerPlugin(ScrollTrigger);

export const ProblemSolutionSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
      }

      gsap.from('.ps-header', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 82%',
        },
        y: 20,
        opacity: 0,
        duration: 0.5,
        ease: 'power2.out',
      });

      gsap.from('.ps-card', {
        scrollTrigger: {
          trigger: '.ps-grid',
          start: 'top 82%',
        },
        y: 24,
        opacity: 0,
        duration: 0.55,
        stagger: 0.12,
        ease: 'power2.out',
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="about"
      ref={sectionRef}
      className="py-20 sm:py-24 lg:py-28 bg-[#FAF9F6]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="ps-header max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">
            WHY WORKSPHERE
          </p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 leading-tight">
            Less time figuring things out.{' '}
            <span className="text-zinc-500 font-normal">
              More time moving forward.
            </span>
          </h2>
          <p className="mt-4 text-base text-zinc-600 leading-relaxed">
            Small teams rarely struggle with doing the work—they struggle with
            finding where the work lives, who owns it, and how close a project is
            to completion.
          </p>
        </div>

        <div className="ps-grid mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {PROBLEM_SOLUTION_ITEMS.map((item) => (
            <article
              key={item.number}
              className="ps-card rounded-2xl bg-white border border-zinc-200/90 p-6 sm:p-7 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded-md bg-zinc-100 text-zinc-700">
                    {item.number}
                  </span>
                  <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">
                    Problem &amp; Solution
                  </span>
                </div>

                {/* Problem Block */}
                <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/70">
                  <div className="flex items-center gap-2 text-xs font-semibold text-rose-700 mb-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>The Problem</span>
                  </div>
                  <h3 className="text-sm font-semibold text-zinc-900">
                    {item.problemTitle}
                  </h3>
                  <p className="mt-1.5 text-xs text-zinc-600 leading-relaxed">
                    {item.problemDetail}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {item.beforeTags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 text-[10px] font-medium rounded bg-white text-zinc-500 border border-zinc-200/80 line-through decoration-zinc-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="my-3 flex justify-center">
                  <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                    <ArrowRight className="w-3.5 h-3.5 rotate-90" />
                  </div>
                </div>

                {/* Solution Block */}
                <div className="p-4 rounded-xl bg-blue-50/40 border border-blue-200/70">
                  <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 mb-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>With WorkSphere</span>
                  </div>
                  <h4 className="text-sm font-semibold text-zinc-900">
                    {item.solutionTitle}
                  </h4>
                  <p className="mt-1.5 text-xs text-zinc-600 leading-relaxed">
                    {item.solutionDetail}
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-zinc-100 flex items-center justify-between text-xs">
                <span className="font-mono text-[11px] font-medium text-zinc-700 bg-zinc-100/80 px-2.5 py-1 rounded-md w-full text-center">
                  {item.afterLabel}
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
