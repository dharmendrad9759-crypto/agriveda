import { Search } from "lucide-react";

interface SearchBarProps {
  query: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ query, onChange }: SearchBarProps) {
  return (
    <div className="relative w-full">
      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input
        value={query}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search nutrient, symbol or function"
        className="w-full rounded-full border border-white/10 bg-slate-950/70 py-3 pl-11 pr-4 text-sm text-white outline-none ring-0 placeholder:text-slate-500"
      />
      {query ? (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-white/10 px-2 py-1 text-[11px] font-medium text-slate-300"
        >
          Clear
        </button>
      ) : null}
    </div>
  );
}
