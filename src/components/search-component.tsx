"use client";
import { Search } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { Hand } from "lucide-react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useState } from "react";

export function SearchToggle({
  onChange,
}: {
  onChange?: (state: boolean) => void;
}) {
  return (
    <Toggle
      variant="outline"
      aria-label="Toggle search"
      className="data-[state=on]:bg-blue-500 cursor-pointer data-[state=on]:text-white hover:bg-blue-400 hover:text-white transition-colors"
      onPressedChange={onChange}
    >
      <Search className="h-[1.2rem] w-[1.2rem]" />
    </Toggle>
  );
}

type SearchKosakataProps = {
  visible: boolean;
  onSelect: (value: string) => void;
};

const KOSAKATA_LIST = [
  "Saya", "Kamu", "Dia", "Kami", "Mereka",
  "Makan", "Minum", "Tidur", "Belajar", "Bermain",
  "Adik", "Kakak", "Ibu", "Ayah", "Teman",
  "Rumah", "Sekolah", "Buku", "Kursi", "Meja",
  "Mobil", "Motor", "Sepeda", "Pesawat", "Kapal",
  "Merah", "Biru", "Hijau", "Kuning", "Putih",
  "Satu", "Dua", "Tiga", "Empat", "Lima",
];

export function SearchKosakata({ visible, onSelect }: SearchKosakataProps) {
  const [query, setQuery] = useState("");

  const handleSelect = (value: string) => {
    onSelect(value);
    setQuery("");
  };

  const filtered = query.trim().length > 0
    ? KOSAKATA_LIST.filter((k) => k.toLowerCase().includes(query.toLowerCase()))
    : [];

  return (
    <div className="relative w-full">
      <Command className="rounded-2xl p-2 outline-none shadow-11 w-full bg-white dark:bg-gray-800" shouldFilter={false}>
        <CommandInput
          placeholder="🔍  Cari kosakata isyarat..."
          value={query}
          onValueChange={(val) => setQuery(val)}
          className="outline-none text-base"
        />

        {query.trim().length > 0 && (
          <CommandList className="absolute top-full left-0 mt-2 w-full rounded-2xl border bg-white dark:bg-gray-800 dark:border-gray-700 shadow-lg z-50 overflow-hidden">
            <CommandEmpty>
              <div className="flex flex-col items-center py-6 text-gray-400 dark:text-gray-500">
                <Hand className="w-10 h-10 mb-2 opacity-30" />
                <p className="text-sm font-medium">Kata tidak ditemukan</p>
              </div>
            </CommandEmpty>

            {filtered.length > 0 && (
              <CommandGroup heading="Kosakata SIBI">
                {filtered.map((word) => (
                  <CommandItem
                    key={word}
                    value={word}
                    onSelect={() => handleSelect(word)}
                    className="cursor-pointer flex items-center gap-3 px-4 py-3 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-xl text-sm font-semibold dark:text-gray-200"
                  >
                    <span className="w-7 h-7 flex items-center justify-center bg-[#4251AB] text-white rounded-full text-xs font-black">
                      {word[0]}
                    </span>
                    <span>{word}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        )}
      </Command>
    </div>
  );
}

