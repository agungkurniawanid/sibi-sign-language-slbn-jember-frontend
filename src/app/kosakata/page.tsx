"use client";
import { SearchKosakata } from "@/components/search-component";
import NavBar from "../../components/NavBar";
import { useState } from "react";
import { X, BookOpen, PlayCircle } from "lucide-react";

const CARD_COLORS = [
  { bg: "bg-blue-50 dark:bg-blue-950/30", border: "border-blue-200 dark:border-blue-800", badge: "bg-blue-500", label: "text-blue-700 dark:text-blue-400" },
  { bg: "bg-purple-50 dark:bg-purple-950/30", border: "border-purple-200 dark:border-purple-800", badge: "bg-purple-500", label: "text-purple-700 dark:text-purple-400" },
  { bg: "bg-green-50 dark:bg-green-950/30", border: "border-green-200 dark:border-green-800", badge: "bg-green-500", label: "text-green-700 dark:text-green-400" },
  { bg: "bg-orange-50 dark:bg-orange-950/30", border: "border-orange-200 dark:border-orange-800", badge: "bg-orange-500", label: "text-orange-700 dark:text-orange-400" },
  { bg: "bg-pink-50 dark:bg-pink-950/30", border: "border-pink-200 dark:border-pink-800", badge: "bg-pink-500", label: "text-pink-700 dark:text-pink-400" },
  { bg: "bg-yellow-50 dark:bg-yellow-950/30", border: "border-yellow-200 dark:border-yellow-800", badge: "bg-yellow-500", label: "text-yellow-700 dark:text-yellow-400" },
];

export default function KosakataPage() {
  const [results, setResults] = useState<string[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleAddResult = (value: string) => {
    if (!results.includes(value)) {
      setResults((prev) => [...prev, value]);
    }
  };

  const handleRemoveResult = (value: string) => {
    setResults((prev) => prev.filter((item) => item !== value));
  };

  const video_kosakata = [
    { id: 1, src: "/video/Saya.webm", alt: "Saya" },
    { id: 2, src: "/video/Makan.webm", alt: "Makan" },
    { id: 3, src: "/video/Adik.webm", alt: "Adik" },
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-blue-50 to-white dark:from-gray-950 dark:to-gray-900 font-sans">
      <NavBar onToggleChange={setIsSearchOpen} />

      <main className="w-full px-4 sm:px-6 lg:px-10 pb-10">

        {/* Page Header */}
        <div className="w-full flex flex-col items-center text-center py-6 sm:py-8 gap-2">
          <div className="flex items-center gap-3 bg-[#4251AB] text-white px-5 py-2.5 rounded-full shadow-md">
            <BookOpen className="w-5 h-5" />
            <span className="text-base sm:text-lg font-bold tracking-wide">Kosakata Bahasa SIBI</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-800 dark:text-gray-100 mt-3">
            Pelajari Kosakata Isyarat
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base max-w-lg">
            Tonton video gerakan isyarat dan pelajari setiap kata dengan mudah!
          </p>
        </div>

        {/* Search Section */}
        {isSearchOpen && (
          <div className="w-full flex flex-col items-center mb-8 gap-4">
            <div className="w-full sm:w-[90%] md:w-[70%] lg:w-[50%]">
              <SearchKosakata visible onSelect={handleAddResult} />
            </div>
            {results.length > 0 && (
              <div className="w-full sm:w-[90%] md:w-[70%] lg:w-[50%]">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 px-1">Kata Dipilih:</p>
                <div className="flex flex-wrap gap-2">
                  {results.map((res) => (
                    <div
                      key={res}
                      className="flex items-center gap-2 bg-[#4251AB] text-white px-4 py-1.5 rounded-full text-sm shadow font-semibold"
                    >
                      <span>{res}</span>
                      <button
                        onClick={() => handleRemoveResult(res)}
                        className="hover:text-red-300 transition-colors"
                        aria-label={`Hapus ${res}`}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Video Grid */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {video_kosakata.map((video, index) => {
            const color = CARD_COLORS[index % CARD_COLORS.length];
            return (
              <div
                key={video.id}
                className={`flex flex-col rounded-2xl border-2 ${color.border} ${color.bg} overflow-hidden shadow-md hover:shadow-lg transition-shadow`}
              >
                {/* Card Header Label */}
                <div className={`flex items-center gap-2 px-4 py-3 ${color.badge}`}>
                  <PlayCircle className="w-5 h-5 text-white" />
                  <span className="text-white font-black text-lg tracking-wide">
                    {video.alt}
                  </span>
                </div>

                {/* Video */}
                <div className="p-3">
                  <video
                    src={video.src}
                    controls
                    className="w-full rounded-xl aspect-video object-cover"
                    preload="metadata"
                  />
                </div>

                {/* Footer */}
                <div className="px-4 pb-4 pt-1 text-center">
                  <span className={`text-sm font-semibold ${color.label}`}>
                    Gerakan isyarat untuk kata &quot;{video.alt}&quot;
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty state */}
        {video_kosakata.length === 0 && (
          <div className="w-full flex flex-col items-center justify-center py-20 gap-4 text-gray-400">
            <BookOpen className="w-16 h-16 opacity-30" />
            <p className="text-lg font-semibold">Belum ada kosakata tersedia</p>
          </div>
        )}
      </main>
    </div>
  );
}
