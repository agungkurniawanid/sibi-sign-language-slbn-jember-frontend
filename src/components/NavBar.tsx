"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ModeToggle } from "./theme-button";
import { SearchToggle } from "./search-component";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function NavBar({
  onToggleChange,
}: {
  onToggleChange?: (state: boolean) => void;
}) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="w-full flex justify-center px-4 sm:px-8 py-4 relative">
      <nav className="font-sans flex items-center justify-between w-full lg:w-[60%] xl:w-[50%] 2xl:w-[40%] rounded-[10px] px-6 py-3 shadow-11 bg-white dark:bg-gray-800">
        <div className="--logo-and-title flex items-center gap-2">
          <div className="--logo">
            <Image
              src="/images/logos/g1.png"
              width={40}
              height={40}
              alt="logo"
              className="rounded-full"
            />
          </div>
          <div className="--title relative flex items-center text-lg font-semibold">
            <span className="text-2xl font-black text-[#4251AB] dark:text-blue-400">Spok</span>
            <span className="text-2xl font-extrabold text-[#DEDADE] dark:text-gray-500">Sibi</span>
            <span className="text-2xl font-black text-[#4251AB] dark:text-blue-400">.</span>
          </div>
        </div>

        {/* Navigation Items for Desktop */}
        <div className="--navigation-link hidden md:flex">
          <ul className="flex items-center gap-4 text-base font-medium">
            <li>
              <Link 
                href="/" 
                className={`flex items-center gap-1 px-3 py-2 rounded-[10px] transition-colors ${
                  pathname === "/" 
                    ? 'bg-[#4251AB] dark:bg-blue-600 text-white'
                    : 'text-gray-700 dark:text-gray-200 hover:text-[#4251AB] dark:hover:text-blue-400'
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-house-gear-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M7.293 1.5a1 1 0 0 1 1.414 0L11 3.793V2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v3.293l2.354 2.353a.5.5 0 0 1-.708.708L8 2.207 1.354 8.854a.5.5 0 1 1-.708-.708z" />
                  <path d="M11.07 9.047a1.5 1.5 0 0 0-1.742.26l-.02.021a1.5 1.5 0 0 0-.261 1.742 1.5 1.5 0 0 0 0 2.86 1.5 1.5 0 0 0-.12 1.07H3.5A1.5 1.5 0 0 1 2 13.5V9.293l6-6 4.724 4.724a1.5 1.5 0 0 0-1.654 1.03" />
                  <path d="m13.158 9.608-.043-.148c-.181-.613-1.049-.613-1.23 0l-.043.148a.64.64 0 0 1-.921.382l-.136-.074c-.561-.306-1.175.308-.87.869l.075.136a.64.64 0 0 1-.382.92l-.148.045c-.613.18-.613 1.048 0 1.229l.148.043a.64.64 0 0 1 .382.921l-.074.136c-.306.561.308 1.175.869.87l.136-.075a.64.64 0 0 1 .92.382l.045.149c.18.612 1.048.612 1.229 0l.043-.15a.64.64 0 0 1 .921-.38l.136.074c.561.305 1.175-.309.87-.87l-.075-.136a.64.64 0 0 1 .382-.92l.149-.044c.612-.181.612-1.049 0-1.23l-.15-.043a.64.64 0 0 1-.38-.921l.074-.136c.305-.561-.309-1.175-.87-.87l-.136.075a.64.64 0 0 1-.92-.382ZM12.5 14a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3" />
                </svg>
                <span>Beranda</span>
              </Link>
            </li>
            <li>
              <Link 
                href="/kosakata" 
                className={`flex items-center gap-1 px-3 py-2 rounded-[10px] transition-colors ${
                  pathname === "/kosakata" 
                    ? 'bg-[#4251AB] dark:bg-blue-600 text-white'
                    : 'text-gray-700 dark:text-gray-200 hover:text-[#4251AB] dark:hover:text-blue-400'
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-translate"
                  viewBox="0 0 16 16"
                >
                  <path d="M4.545 6.714 4.11 8H3l1.862-5h1.284L8 8H6.833l-.435-1.286zm1.634-.736L5.5 3.956h-.049l-.679 2.022z" />
                  <path d="M0 2a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v3h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-3H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zm7.138 9.995q.289.451.63.846c-.748.575-1.673 1.001-2.768 1.292.178.217.451.635.555.867 1.125-.359 2.08-.844 2.886-1.494.777.665 1.739 1.165 2.93 1.472.133-.254.414-.673.629-.89-1.125-.253-2.057-.694-2.82-1.284.681-.747 1.222-1.651 1.621-2.757H14V8h-3v1.047h.765c-.318.844-.74 1.546-1.272 2.13a6 6 0 0 1-.415-.492 2 2 极值 0 0 1-.94.31" />
                </svg>
                <span>Kosakata</span>
              </Link>
            </li>
            <li>
              <ModeToggle/>
            </li>
            <li>
              <SearchToggle onChange={onToggleChange}/>
            </li>
          </ul>
        </div>

        {/* Icons for Mobile (always visible) */}
        <div className="flex items-center gap-4 md:hidden">
          <ModeToggle/>
          <SearchToggle onChange={onToggleChange}/>
          <button 
            onClick={toggleMenu}
            className="p-2 rounded-md focus:outline-none"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-white/20 backdrop-blur-lg z-40 md:hidden" 
          onClick={toggleMenu}
        ></div>
      )}

      {/* Mobile Navigation Items */}
      <div className={`fixed top-0 right-0 h-full w-64 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md shadow-lg transform transition-transform duration-300 ease-in-out z-50 md:hidden ${
        isMenuOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="p-6 h-full flex flex-col">
          <button 
            onClick={toggleMenu}
            className="absolute top-4 right-4 p-2 rounded-md focus:outline-none"
            aria-label="Close menu"
          >
            <X className="w-6 h-6" />
          </button>
          
          <ul className="mt-12 space-y-6 flex-1">
            <li>
              <Link 
                href="/" 
                className={`flex items-center gap-3 px-4 py-3 rounded-[10px] transition-colors ${
                  pathname === "/" 
                    ? 'bg-[#4251AB] dark:bg-blue-600 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:text-[#4251AB] dark:hover:text-blue-400'
                }`}
                onClick={toggleMenu}
              >
                 <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-house-gear-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M7.293 1.5a1 1 0 0 1 1.414 0L11 3.793V2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v3.293l2.354 2.353a.5.5 0 0 1-.708.708L8 2.207 1.354 8.854a.5.5 0 1 1-.708-.708z" />
                  <path d="M11.07 9.047a1.5 1.5 0 0 0-1.742.26l-.02.021a1.5 1.5 0 0 0-.261 1.742 1.5 1.5 0 0 0 0 2.86 1.5 1.5 0 0 0-.12 1.07H3.5A1.5 1.5 0 0 1 2 13.5V9.293l6-6 4.724 4.724a1.5 1.5 0 0 0-1.654 1.03" />
                  <path d="m13.158 9.608-.043-.148c-.181-.613-1.049-.613-1.23 0l-.043.148a.64.64 0 0 1-.921.382l-.136-.074c-.561-.306-1.175.308-.87.869l.075.136a.64.64 0 0 1-.382.92l-.148.045c-.613.18-.613 1.048 0 1.229l.148.043a.64.64 0 0 1 .382.921l-.074.136c-.306.561.308 1.175.869.87l.136-.075a.64.64 0 0 1 .92.382l.045.149c.18.612 1.048.612 1.229 0l.043-.15a.64.64 0 0 1 .921-.38l.136.074c.561.305 1.175-.309.87-.87l-.075-.136a.64.64 0 0 1 .382-.92l.149-.044c.612-.181.612-1.049 0-1.23l-.15-.043a.64.64 0 0 1-.38-.921l.074-.136c.305-.561-.309-1.175-.87-.87l-.136.075a.64.64 0 0 1-.92-.382ZM12.5 14a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3" />
                </svg>
                <span className="text-lg">Beranda</span>
              </Link>
            </li>
            <li>
              <Link 
                href="/kosakata" 
                className={`flex items-center gap-3 px-4 py-3 rounded-[10px] transition-colors ${
                  pathname === "/kosakata" 
                    ? 'bg-[#4251AB] dark:bg-blue-600 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:text-[#4251AB] dark:hover:text-blue-400'
                }`}
                onClick={toggleMenu}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-translate"
                  viewBox="0 0 16 16"
                >
                  <path d="M4.545 6.714 4.11 8H3l1.862-5h1.284L8 8H6.833l-.435-1.286zm1.634-.736L5.5 3.956h-.049l-.679 2.022z" />
                  <path d="M0 2a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v3h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-3H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zm7.138 9.995q.289.451.63.846c-.748.575-1.673 1.001-2.768 1.292.178.217.451.635.555.867 1.125-.359 2.08-.844 2.886-1.494.777.665 1.739 1.165 2.93 1.472.133-.254.414-.673.629-.89-1.125-.253-2.057-.694-2.82-1.284.681-.747 1.222-1.651 1.621-2.757H14V8h-3v1.047h.765c-.318.844-.74 1.546-1.272 2.13a6 6 0 0 1-.415-.492 2 2 极值 0 0 1-.94.31" />
                </svg>
                <span className="text-lg">Kosakata</span>
              </Link>
            </li>
          </ul>

          <div className="flex justify-center gap-6 pb-6 pt-8 border-t border-gray-200 dark:border-gray-700">
            <ModeToggle/>
            <SearchToggle onChange={onToggleChange}/>
          </div>
        </div>
      </div>
    </div>
  );
}