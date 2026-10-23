import React from 'react';
import { Link } from 'react-router-dom';
import { WorkSphereLogo } from './Navbar';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.querySelector(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <footer className="bg-[#FAF9F6] border-t border-zinc-200/90 text-zinc-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-zinc-200/80">
          <div className="md:col-span-6 space-y-4">
            <a
              href="#top"
              onClick={(e) => handleScroll(e, '#top')}
              className="inline-flex items-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-lg"
            >
              <WorkSphereLogo className="w-7 h-7" />
              <span className="font-semibold text-base tracking-tight text-zinc-900">
                WorkSphere
              </span>
            </a>
            <p className="text-sm text-zinc-600 max-w-sm leading-relaxed">
              One workspace. Every project. Clear progress. Built for small teams,
              freelancers, developers, and agencies who want structured project
              management without the chaos.
            </p>
          </div>

          <div className="md:col-span-3 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-900">
              Product
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a
                  href="#product"
                  onClick={(e) => handleScroll(e, '#product')}
                  className="hover:text-zinc-950 transition-colors"
                >
                  Workspace Preview
                </a>
              </li>
              <li>
                <a
                  href="#features"
                  onClick={(e) => handleScroll(e, '#features')}
                  className="hover:text-zinc-950 transition-colors"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#interactive-preview"
                  onClick={(e) => handleScroll(e, '#interactive-preview')}
                  className="hover:text-zinc-950 transition-colors"
                >
                  Kanban Board
                </a>
              </li>
              <li>
                <a
                  href="#how-it-works"
                  onClick={(e) => handleScroll(e, '#how-it-works')}
                  className="hover:text-zinc-950 transition-colors"
                >
                  How it works
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-900">
              Workspace Access
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/login" className="hover:text-zinc-950 transition-colors">
                  Log in
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-zinc-950 transition-colors">
                  Get started
                </Link>
              </li>
              <li>
                <a
                  href="#about"
                  onClick={(e) => handleScroll(e, '#about')}
                  className="hover:text-zinc-950 transition-colors"
                >
                  About WorkSphere
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© {currentYear} WorkSphere. All rights reserved.</p>
          <p className="text-zinc-500">
            Focused project &amp; task management for modern teams.
          </p>
        </div>
      </div>
    </footer>
  );
};
