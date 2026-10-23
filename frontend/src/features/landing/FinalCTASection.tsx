import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export const FinalCTASection: React.FC = () => {
  const ctaRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
      }

      gsap.from('.final-cta-box', {
        scrollTrigger: {
          trigger: ctaRef.current,
          start: 'top 85%',
        },
        y: 20,
        opacity: 0,
        duration: 0.55,
        ease: 'power2.out',
      });
    },
    { scope: ctaRef }
  );

  const handleExploreFeatures = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const el = document.querySelector('#features');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section
      ref={ctaRef}
      className="py-20 sm:py-24 bg-[#FAF9F6] border-t border-zinc-200/80"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="final-cta-box rounded-3xl bg-zinc-900 text-white px-6 py-14 sm:px-12 sm:py-16 text-center shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Your team&apos;s next chapter starts here.
            </h2>
            <p className="mt-4 text-base sm:text-lg text-zinc-300 leading-relaxed">
              Bring your projects and tasks into one organized workspace.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              >
                <span>Get started with WorkSphere</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <a
                href="#features"
                onClick={handleExploreFeatures}
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 text-sm font-semibold text-zinc-200 hover:text-white rounded-xl border border-zinc-700 hover:border-zinc-500 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              >
                Explore the features
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
