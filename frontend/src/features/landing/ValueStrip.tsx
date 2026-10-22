import React from 'react';
import { Briefcase, UserCheck, Kanban, BarChart3 } from 'lucide-react';
import { VALUE_STRIP_ITEMS } from './landingData';

const ICONS = {
  workspace: Briefcase,
  ownership: UserCheck,
  tracking: Kanban,
  progress: BarChart3,
};

export const ValueStrip: React.FC = () => {
  return (
    <section
      aria-label="Key product benefits"
      className="border-y border-zinc-200/80 bg-white/80"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0 lg:divide-x lg:divide-zinc-200/80">
          {VALUE_STRIP_ITEMS.map((item) => {
            const IconComponent =
              ICONS[item.id as keyof typeof ICONS] || Briefcase;
            return (
              <div
                key={item.id}
                className="lg:px-6 first:lg:pl-0 last:lg:pr-0 flex items-start gap-3.5"
              >
                <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                  <IconComponent className="w-4 h-4" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-zinc-900">
                    {item.title}
                  </h2>
                  <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
