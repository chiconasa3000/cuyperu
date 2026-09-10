'use client';

import { useState, ReactNode } from 'react';

interface Tab {
  id: string;
  label: string;
  content: ReactNode;
}

interface ProductTabsProps {
  tabs: Tab[];
}

export default function ProductTabs({ tabs }: ProductTabsProps) {
  const [active, setActive] = useState(tabs[0]?.id ?? '');

  return (
    <div>
      <div className="flex border-b border-stone-200 dark:border-stone-800">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={`px-6 py-4 font-medium transition-colors ${
              active === tab.id
                ? 'border-b-2 border-primary font-semibold text-primary'
                : 'text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="p-6 sm:p-8">
        {tabs.find((tab) => tab.id === active)?.content}
      </div>
    </div>
  );
}