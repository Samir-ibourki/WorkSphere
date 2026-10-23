import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass, CheckCircle2 } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ProductPreview } from './ProductPreview';

export const HeroSection: React.FC = () => {
  const heroRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;

      if (prefersReducedMotion) {
        return;
      }

      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
      });

      tl.from('.hero-eyebrow', {
        y: 14,
        opacity: 0,
        duration: 0.45,
      })
        .from(
          '.hero-headline-line',
          {
            y: 22,
            opacity: 0,
            duration: 0.55,
            stagger: 0.1,
          },
          '-=0.25'
        )
        .from(
          '.hero-supporting',
          {
            y: 16,
            opacity: 0,
            duration: 0.45,
          },
          '-=0.3'
        )
        .from(
          '.hero-cta-item',
          {
            y: 14,
            opacity: 0,
            duration: 0.4,
            stagger: 0.08,
          },
          '-=0.25'
        )
        .from(
          '.hero-trust',
          {
            opacity: 0,
            duration: 0.4,
          },
          '-=0.2'
        )
        .from(
          '.hero-preview-wrapper',
          {
            y: 28,
            scale: 0.985,
            opacity: 0,
            duration: 0.65,
          },
          '-=0.35'
        )
        .from(
          '.hero-kanban-col',
          {
            y: 16,
            opacity: 0,
            duration: 0.4,
            stagger: 0.08,
          },
          '-=0.35'
        )
        .from(
          '.hero-task-card',
          {
            y: 10,
            opacity: 0,
            duration: 0.35,
            stagger: 0.05,
          },
          '-=0.25'
        );
    },
    { scope: heroRef }
  );

  const handleExploreClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.querySelector('#interactive-preview');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section
      id="top"
      ref={heroRef}
      className="relative pt-10 pb-16 sm:pt-16 sm:pb-24 lg:pt-20 lg:pb-28 overflow-hidden"
    >
      {/* Subtle architectural background grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_70%_50%_at_50%_0%,#000_60%,transparent_100%)] opacity-40"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="hero-eyebrow inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-zinc-200/90 shadow-2xs mb-6">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-widest text-zinc-700">
              PROJECT MANAGEMENT, WITHOUT THE CHAOS
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-zinc-950 leading-[1.08]">
            <span className="hero-headline-line block">
              Make space for your
            </span>
            <span className="hero-headline-line block text-blue-600">
              team&apos;s best work.
            </span>
          </h1>

          <p className="hero-supporting mt-6 text-base sm:text-lg lg:text-xl text-zinc-600 leading-relaxed max-w-2xl mx-auto">
            Bring your projects, tasks, and team progress together in one clear
            workspace. Know what matters, what&apos;s moving, and what&apos;s next.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link
              to="/register"
              className="hero-cta-item w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-sm transition-all hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
            >
              <span>Get started</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>

            <a
              href="#interactive-preview"
              onClick={handleExploreClick}
              className="hero-cta-item w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-zinc-800 bg-white hover:bg-zinc-50 border border-zinc-300/90 rounded-xl shadow-2xs transition-all hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
            >
              <Compass className="w-4 h-4 text-zinc-500" aria-hidden="true" />
              <span>Explore the workspace</span>
            </a>
          </div>

          <p className="hero-trust mt-5 inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500">
            <CheckCircle2
              className="w-3.5 h-3.5 text-emerald-600"
              aria-hidden="true"
            />
            <span>Built for focused teams and ambitious projects.</span>
          </p>
        </div>

        <div className="hero-preview-wrapper mt-12 sm:mt-14 lg:mt-16">
          <ProductPreview />
        </div>
      </div>
    </section>
  );
};
