"use client";
import { SearchKosakata } from "@/components/search-component";
import NavBar from "../../components/NavBar";
import { useState } from "react";
import { X } from "lucide-react";

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
    {
      id: 1,
      src: "/video/Saya.webm",
      alt: "Saya",
    },
    {
      id: 2,
      src: "/video/Makan.webm",
      alt: "Makan",
    },
    {
      id: 3,
      src: "/video/Adik.webm",
      alt: "Adik",
    },
  ];

  return (
    <div className="--container font-sans w-full h-auto bg-white">
      <NavBar onToggleChange={setIsSearchOpen} />
      <div className="--wrapper-content w-full py-2 px-4 sm:px-8">
        <div className="--wrapper-content-search w-full flex justify-center items-center">
          {isSearchOpen && (
            <div className="--main-content-search w-full lg:w-[40%]">
              <div className="--search-component w-full">
                <SearchKosakata visible onSelect={handleAddResult} />
              </div>

              <div className="--result-search-component mt-4">
                <div className="--result-searchkosakata flex flex-wrap gap-2">
                  {results.map((res) => (
                    <div
                      key={res}
                      className="flex items-center gap-2 bg-gray-100 border px-3 py-1 rounded-full text-sm shadow-sm"
                    >
                      <span>{res}</span>
                      <button
                        onClick={() => handleRemoveResult(res)}
                        className="text-gray-500 hover:text-red-500"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="--result-searchkalimat"></div>
              </div>
            </div>
          )}
        </div>
        <div className="--wrapper-content-video mt-8">
            {video_kosakata.map((video) => (
              <div key={video.id} className="--item-video w-full md:w-1/3 p-2 inline-block">
                <div className="--inner-item-video flex flex-col gap-2">
                  <video
                    src={video.src}
                    controls
                    className="w-full rounded-xl shadow-11"
                  />
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
