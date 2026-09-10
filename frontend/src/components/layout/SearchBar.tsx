'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const q = query.trim();
    if (!q) return;
    router.push(`/products?search=${encodeURIComponent(q)}`);
    setOpen(false);
    setQuery('');
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        aria-label="Buscar"
        className="p-2 text-stone-600 transition-colors hover:text-primary dark:text-stone-300"
      >
        <Search className="h-5 w-5" />
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-1">
      <input
        autoFocus
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onBlur={() => {
          if (!query.trim()) setOpen(false);
        }}
        placeholder="Buscar cuy, peso, precio..."
        className="w-40 rounded-full border border-stone-300 bg-white px-4 py-1.5 text-sm outline-none transition-all focus:w-52 focus:border-primary dark:border-stone-700 dark:bg-stone-800 sm:w-48"
      />
      <button
        type="submit"
        aria-label="Buscar"
        className="p-2 text-stone-600 transition-colors hover:text-primary dark:text-stone-300"
      >
        <Search className="h-5 w-5" />
      </button>
    </form>
  );
}