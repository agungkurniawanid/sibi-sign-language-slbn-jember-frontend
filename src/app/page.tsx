"use client";
import { useEffect, useRef, useState } from "react";
import NavBar from "../components/NavBar";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [videoPage, setVideoPage] = useState(0);
  const [videosPerPage, setVideosPerPage] = useState(3);

  const video_kosakata = [
    { id: 1, src: "/video/Saya.webm", alt: "Saya" },
    { id: 2, src: "/video/Makan.webm", alt: "Makan" },
    { id: 3, src: "/video/Sayur.webm", alt: "Sayur" },
    { id: 4, src: "/video/An.webm", alt: "An" },
    { id: 5, src: "/video/Agar.webm", alt: "Agar" },
    { id: 6, src: "/video/Sehat.webm", alt: "Sehat" },
  ];

  useEffect(() => {
    const update = () => {
      const perPage = window.innerWidth >= 1024 ? 3 : 2;
      setVideosPerPage((prev) => {
        if (prev !== perPage) setVideoPage(0);
        return perPage;
      });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const totalPages = Math.ceil(video_kosakata.length / videosPerPage);
  const visibleVideos = video_kosakata.slice(
    videoPage * videosPerPage,
    videoPage * videosPerPage + videosPerPage
  );

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      if (videoRef.current) videoRef.current.srcObject = mediaStream;
      setIsCameraOn(true);
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("Tidak dapat mengakses kamera. Pastikan Anda memberikan izin.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
      if (videoRef.current) videoRef.current.srcObject = null;
      setIsCameraOn(false);
    }
  };

  useEffect(() => {
    return () => {
      if (stream) stream.getTracks().forEach((track) => track.stop());
    };
  }, [stream]);

  return (
    <div className="min-h-screen w-full font-sans bg-gradient-to-b from-blue-50 to-white dark:from-gray-950 dark:to-gray-900">
      <NavBar />
      <main className="w-full py-2 px-4 sm:px-6 lg:px-10 pb-10">
        <div className="w-full bg-[#f0f4ff] dark:bg-gray-800/50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 flex flex-col gap-4">

          {/* "Kamera" label sits above the grid so right panel aligns with the camera card */}
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#4251AB] dark:bg-blue-400"></span>
            <span className="text-sm font-bold text-[#4251AB] dark:text-blue-400 uppercase tracking-wider">Kamera</span>
          </div>

          {/* Main Grid */}
          <div className="w-full grid grid-cols-1 lg:grid-cols-[3fr_1fr] gap-4">

            {/* LEFT: Camera + Action Buttons + Referensi Soal */}
            <div className="flex flex-col gap-4">

              {/* Camera View */}
              <div className="relative w-full rounded-2xl overflow-hidden bg-[#fece60] aspect-video">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />

                {!isCameraOn && (
                  <div className="absolute inset-0 flex items-center justify-center bg-[#fece60]">
                    <span className="text-black text-xl sm:text-2xl font-black absolute z-10 left-4 top-4 sm:left-6 sm:top-6 w-1/2 leading-snug drop-shadow">
                      Hidupkan Kamera Dulu! 📷
                    </span>
                    <Image
                      src="/images/looking-camera-young-handsome-male-barber-uniform-showing-timeout-gesture-isolated-white-background.jpg"
                      width={1000}
                      height={1000}
                      alt="Camera Off"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Camera Controls Overlay */}
                <div className="absolute bottom-0 left-0 w-full px-4 py-3 flex justify-center items-end gap-3">
                  <button
                    onClick={startCamera}
                    disabled={isCameraOn}
                    aria-label="Hidupkan Kamera"
                    className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl text-white text-xs font-bold shadow transition-all min-w-[80px] ${
                      isCameraOn
                        ? "bg-white/20 backdrop-blur cursor-not-allowed opacity-50"
                        : "bg-green-500/80 backdrop-blur hover:bg-green-500 active:scale-95"
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 0 16 16">
                      <path fillRule="evenodd" d="M0 5a2 2 0 0 1 2-2h7.5a2 2 0 0 1 1.983 1.738l3.11-1.382A1 1 0 0 1 16 4.269v7.462a1 1 0 0 1-1.406.913l-3.111-1.382A2 2 0 0 1 9.5 13H2a2 2 0 0 1-2-2z" />
                    </svg>
                    <span>Mulai</span>
                  </button>

                  <button
                    onClick={stopCamera}
                    disabled={!isCameraOn}
                    aria-label="Matikan Kamera"
                    className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl text-white text-xs font-bold shadow transition-all min-w-[80px] ${
                      !isCameraOn
                        ? "bg-white/20 backdrop-blur cursor-not-allowed opacity-50"
                        : "bg-red-500/80 backdrop-blur hover:bg-red-500 active:scale-95"
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 0 16 16">
                      <path fillRule="evenodd" d="M10.961 12.365a2 2 0 0 0 .522-1.103l3.11 1.382A1 1 0 0 0 16 11.731V4.269a1 1 0 0 0-1.406-.913l-3.111 1.382A2 2 0 0 0 9.5 3H4.272zm-10.114-9A2 2 0 0 0 0 5v6a2 2 0 0 0 2 2h5.728zm9.746 11.925-10-14 .814-.58 10 14z" />
                    </svg>
                    <span>Berhenti</span>
                  </button>
                </div>
              </div>

              {/* Action Buttons + Referensi Soal */}
              <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-4 items-start">

                {/* Action Buttons */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-11 p-4 flex flex-row sm:flex-col justify-center gap-3">
                  <button className="flex flex-col items-center gap-2 min-w-[80px] px-4 py-3 bg-[#f0f4ff] dark:bg-gray-700 rounded-xl hover:bg-[#e0e7ff] dark:hover:bg-gray-600 transition-colors active:scale-95">
                    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" className="text-[#4251AB] dark:text-blue-400" viewBox="0 0 16 16">
                      <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41m-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9" />
                      <path fillRule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5 5 0 0 0 8 3M3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9z" />
                    </svg>
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-200 text-center">Ulangi Soal</span>
                  </button>

                  <button className="flex flex-col items-center gap-2 min-w-[80px] px-4 py-3 bg-[#f0f4ff] dark:bg-gray-700 rounded-xl hover:bg-[#e0e7ff] dark:hover:bg-gray-600 transition-colors active:scale-95">
                    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" className="text-[#4251AB] dark:text-blue-400" viewBox="0 0 16 16">
                      <path d="M5.933.87a2.89 2.89 0 0 1 4.134 0l.622.638.89-.011a2.89 2.89 0 0 1 2.924 2.924l-.01.89.636.622a2.89 2.89 0 0 1 0 4.134l-.637.622.011.89a2.89 2.89 0 0 1-2.924 2.924l-.89-.01-.622.636a2.89 2.89 0 0 1-4.134 0l-.622-.637-.89.011a2.89 2.89 0 0 1-2.924-2.924l.01-.89-.636-.622a2.89 2.89 0 0 1 0-4.134l.637-.622-.011-.89a2.89 2.89 0 0 1 2.924-2.924l.89.01zM7.002 11a1 1 0 1 0 2 0 1 1 0 0 0-2 0m1.602-2.027c.04-.534.198-.815.846-1.26.674-.475 1.05-1.09 1.05-1.986 0-1.325-.92-2.227-2.262-2.227-1.02 0-1.792.492-2.1 1.29A1.7 1.7 0 0 0 6 5.48c0 .393.203.64.545.64.272 0 .455-.147.564-.51.158-.592.525-.915 1.074-.915.61 0 1.03.446 1.03 1.084 0 .563-.208.885-.822 1.325-.619.433-.926.914-.926 1.64v.111c0 .428.208.745.585.745.336 0 .504-.24.554-.627" />
                    </svg>
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-200 text-center">Pilih Soal</span>
                  </button>
                </div>

                {/* Referensi Soal — paginated 3-col strip */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-11 p-3 flex flex-col gap-2">
                  {/* Header + nav arrows */}
                  <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-blue-400"></span>
                      <span className="text-sm font-bold text-blue-500 uppercase tracking-wider">Referensi Soal</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setVideoPage((p) => Math.max(0, p - 1))}
                        disabled={videoPage === 0}
                        aria-label="Video sebelumnya"
                        className={`p-1.5 rounded-lg transition-all active:scale-95 ${
                          videoPage === 0
                            ? "bg-gray-100 dark:bg-gray-700 text-gray-300 dark:text-gray-600 cursor-not-allowed"
                            : "bg-[#2b7fff] text-white hover:bg-[#1a6eee]"
                        }`}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span className="text-xs font-bold text-gray-400 px-1">
                        {videoPage + 1}/{totalPages}
                      </span>
                      <button
                        onClick={() => setVideoPage((p) => Math.min(totalPages - 1, p + 1))}
                        disabled={videoPage === totalPages - 1}
                        aria-label="Video berikutnya"
                        className={`p-1.5 rounded-lg transition-all active:scale-95 ${
                          videoPage === totalPages - 1
                            ? "bg-gray-100 dark:bg-gray-700 text-gray-300 dark:text-gray-600 cursor-not-allowed"
                            : "bg-[#2b7fff] text-white hover:bg-[#1a6eee]"
                        }`}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* 3 visible video cards */}
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                    {visibleVideos.map((video) => (
                      <div key={video.id} className="relative w-full rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700">
                        <video src={video.src} controls loop className="w-full aspect-video object-cover" preload="metadata" />
                        <span className="absolute left-1.5 top-1.5 z-10 px-2 py-0.5 bg-white/85 dark:bg-gray-900/85 backdrop-blur-sm rounded-md font-bold text-xs text-gray-800 dark:text-gray-100 shadow-sm">
                          {video.alt}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Dot indicators */}
                  <div className="flex justify-center gap-1.5 pt-1">
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setVideoPage(i)}
                        aria-label={`Halaman ${i + 1}`}
                        className={`h-2 rounded-full transition-all ${
                          i === videoPage ? "w-5 bg-[#2b7fff]" : "w-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
                        }`}
                      />
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* RIGHT: aligned with camera card (label is outside the grid) */}
            <div className="flex flex-col gap-4">

              {/* Klasifikasi Kata */}
              <div className="bg-white dark:bg-gray-800 shadow-11 rounded-2xl p-5 flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-3 h-3 rounded-full bg-[#4251AB] dark:bg-blue-400"></span>
                  <span className="font-black text-lg text-gray-800 dark:text-gray-100">Klasifikasi Kata</span>
                </div>
                <div className="w-full h-px bg-gray-100 dark:bg-gray-700 mb-3"></div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800">
                    <span className="font-semibold text-gray-700 dark:text-gray-200">Saya</span>
                    <span className="px-3 py-1 bg-green-500 text-white rounded-full text-sm font-bold shadow-sm">90%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800">
                    <span className="font-semibold text-gray-700 dark:text-gray-200">Makan</span>
                    <span className="px-3 py-1 bg-green-500 text-white rounded-full text-sm font-bold shadow-sm">85%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800">
                    <span className="font-semibold text-gray-700 dark:text-gray-200">Sayur</span>
                    <span className="px-3 py-1 bg-amber-400 text-white rounded-full text-sm font-bold shadow-sm">78%</span>
                  </div>
                </div>
              </div>

              {/* Perbandingan Hasil */}
              <div className="bg-white dark:bg-gray-800 shadow-11 rounded-2xl p-5 flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-3 h-3 rounded-full bg-purple-500"></span>
                  <span className="font-black text-lg text-gray-800 dark:text-gray-100">Perbandingan Hasil</span>
                </div>
                <div className="w-full h-px bg-gray-100 dark:bg-gray-700 mb-3"></div>
                <div className="flex flex-col gap-3">
                  <div>
                    <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1.5">Jawaban Kamu</p>
                    <div className="font-bold text-base p-3.5 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 flex flex-wrap gap-1.5">
                      <span className="text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/40 px-2 py-0.5 rounded-lg">Saya</span>
                      <span className="text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/40 px-2 py-0.5 rounded-lg">Makan</span>
                      <span className="bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-lg">Sayur</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1.5">Soal</p>
                    <div className="font-bold text-base p-3.5 rounded-xl bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 flex flex-wrap gap-1.5">
                      <span className="bg-green-200 dark:bg-green-800 px-2 py-0.5 rounded-lg">Saya</span>
                      <span className="bg-green-200 dark:bg-green-800 px-2 py-0.5 rounded-lg">Makan</span>
                      <span className="bg-green-200 dark:bg-green-800 px-2 py-0.5 rounded-lg">Sayur</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}