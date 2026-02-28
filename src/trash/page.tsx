"use client";
import { useEffect, useRef, useState } from "react";
import NavBar from "../components/NavBar";
import Image from "next/image";

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);

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

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

      setIsCameraOn(true);
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("Tidak dapat mengakses kamera. Pastikan Anda memberikan izin.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => {
        track.stop();
      });
      setStream(null);

      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }

      setIsCameraOn(false);
    }
  };

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  return (
    <div className="--container font-sans w-full h-auto bg-white">
      <NavBar />
      <main className="w-full h-full py-2 px-4 sm:px-8">
        <div className="--main-content w-full h-full bg-[#f8f9fd] rounded-[30px]">
          <div className="--grid-wrapper w-full h-full grid lg:grid-cols-[3fr_1fr] grid-cols-1 gap-4 p-4 sm:p-8">
            <div className="--wrapper-camera-and-kosakata-and-button w-full h-full grid grid-cols-1 gap-4">
              <div className="--wrapper-camera-and-kosakata w-full h-[calc(100%-120px)] grid grid-cols-1 sm:grid-cols-[2fr_1fr] gap-4">
                <div className="--camera-and-button w-full h-full flex flex-col gap-4">
                  <div className="--camera relative w-full h-[350px] sm:h-full rounded-xl overflow-hidden">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />

                    {!isCameraOn && (
                      <div className="absolute inset-0 flex items-center justify-center bg-[#fece60]">
                        <div className="flex items-center">
                          <span className="text-black text-[24px] font-bold absolute z-10 left-5 top-5 w-1/2 lg:left-5 lg:top-5 2xl:left-10 2xl:top-10 lg:w-1/2 2xl:w-1/4 text-shadow-2xs">
                            Mohon Untuk Hidupkan Kamera!
                          </span>
                          <Image
                            src={
                              "/images/looking-camera-young-handsome-male-barber-uniform-showing-timeout-gesture-isolated-white-background.jpg"
                            }
                            width={1000}
                            height={1000}
                            alt="Camera Off"
                            className="left-0 absolute w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    )}

                    <div className="--button-action w-full h-[100px] absolute bottom-0 left-0 flex justify-center items-center gap-4 rounded-b-xl">
                      <button
                        onClick={startCamera}
                        disabled={isCameraOn}
                        className={`--button-start-camera cursor-pointer w-[70px] h-[70px] rounded-[10px] flex justify-center items-center ${
                          isCameraOn
                            ? "bg-white/20 backdrop-blur-lg cursor-not-allowed"
                            : "bg-[#44b958]/70 backdrop-blur-lg hover:bg-[#44b958]/80"
                        } transition-colors`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="40"
                          height="40"
                          fill="white"
                          className="bi bi-camera-video-fill"
                          viewBox="0 0 16 16"
                        >
                          <path
                            fillRule="evenodd"
                            d="M0 5a2 2 0 0 1 2-2h7.5a2 2 0 0 1 1.983 1.738l3.11-1.382A1 1 0 0 1 16 4.269v7.462a1 1 0 0 1-1.406.913l-3.111-1.382A2 2 0 0 1 9.5 13H2a2 2 0 0 1-2-2z"
                          />
                        </svg>
                      </button>

                      <button
                        onClick={stopCamera}
                        disabled={!isCameraOn}
                        className={`--button-stop-camera cursor-pointer w-[70px] h-[70px] rounded-[10px] flex justify-center items-center ${
                          !isCameraOn
                            ? "bg-white/20 backdrop-blur-lg cursor-not-allowed"
                            : "bg-red-500 hover:bg-red-600"
                        } transition-colors`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="40"
                          height="40"
                          fill="white"
                          className="bi bi-camera-video-off-fill"
                          viewBox="0 0 16 16"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10.961 12.365a2 2 0 0 0 .522-1.103l3.11 1.382A1 1 0 0 0 16 11.731V4.269a1 1 0 0 0-1.406-.913l-3.111 1.382A2 2 0 0 0 9.5 3H4.272zm-10.114-9A2 2 0 0 0 0 5v6a2 2 0 0 0 2 2h5.728zm9.746 11.925-10-14 .814-.58 10 14z"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="--wrapper-button w-full lg:w-fit shadow-11 h-auto sm:h-[150px] flex bg-white p-4 rounded-xl justify-center lg:justify-start items-center gap-4">
                    <div className="--button-repeat-sign w-[100px]">
                      <button className="w-[100px] cursor-pointer flex justify-center h-full p-4 mb-2 bg-[#f8f9fd] rounded-lg text-white font-semibold hover:bg-gray-200 transition-colors">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="34"
                          height="34"
                          fill="currentColor"
                          className="bi bi-arrow-repeat text-[#4251AB]"
                          viewBox="0 0 16 16"
                        >
                          <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41m-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9" />
                          <path
                            fill-rule="evenodd"
                            d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5 5 0 0 0 8 3M3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9z"
                          />
                        </svg>
                      </button>
                      <p className="text-black font-bold text-center">
                        Ulangi Soal
                      </p>
                    </div>

                    <div className="--button-choose-sign w-[100px]">
                      <button className="w-[100px] cursor-pointer flex justify-center h-full p-4 mb-2 bg-[#f8f9fd] rounded-lg text-white font-semibold hover:bg-gray-200 transition-colors">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="34"
                          height="34"
                          fill="currentColor"
                          className="bi bi-patch-question-fill text-[#4251AB]"
                          viewBox="0 0 16 16"
                        >
                          <path d="M5.933.87a2.89 2.89 0 0 1 4.134 0l.622.638.89-.011a2.89 2.89 0 0 1 2.924 2.924l-.01.89.636.622a2.89 2.89 0 0 1 0 4.134l-.637.622.011.89a2.89 2.89 0 0 1-2.924 2.924l-.89-.01-.622.636a2.89 2.89 0 0 1-4.134 0l-.622-.637-.89.011a2.89 2.89 0 0 1-2.924-2.924l.01-.89-.636-.622a2.89 2.89 0 0 1 0-4.134l.637-.622-.011-.89a2.89 2.89 0 0 1 2.924-2.924l.89.01zM7.002 11a1 1 0 1 0 2 0 1 1 0 0 0-2 0m1.602-2.027c.04-.534.198-.815.846-1.26.674-.475 1.05-1.09 1.05-1.986 0-1.325-.92-2.227-2.262-2.227-1.02 0-1.792.492-2.1 1.29A1.7 1.7 0 0 0 6 5.48c0 .393.203.64.545.64.272 0 .455-.147.564-.51.158-.592.525-.915 1.074-.915.61 0 1.03.446 1.03 1.084 0 .563-.208.885-.822 1.325-.619.433-.926.914-.926 1.64v.111c0 .428.208.745.585.745.336 0 .504-.24.554-.627" />
                        </svg>
                      </button>
                      <p className="text-black font-bold text-center">
                        Pilih Soal
                      </p>
                    </div>
                  </div>
                </div>

                <div className="--kosakata flex flex-col h-full">
                  <div className="--button-previous w-full h-10 flex justify-center items-center cursor-pointer mb-2 bg-[#2b7fff] rounded-lg hover:bg-[#2b7fff]/80 transition-colors">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="currentColor"
                      className="bi bi-caret-up-fill text-white"
                      viewBox="0 0 16 16"
                    >
                      <path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z" />
                    </svg>
                  </div>

                  <div className="--card-kosakata w-full flex-1 grid grid-rows-3 gap-2 overflow-hidden">
                    {video_kosakata.map((video) => (
                      <div
                        className="--video-and-kosakata relative w-full h-full flex flex-col items-center"
                        key={video.id}
                      >
                        <video
                          key={video.id}
                          src={video.src}
                          controls
                          loop
                          className="--image-kosakata w-full object-cover h-full rounded-lg"
                        ></video>
                        <p className="text-black absolute left-2 top-2 z-10 px-4 py-2 bg-white/20 backdrop-blur-lg rounded-[10px] font-medium text-center mt-1">
                          {video.alt}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="--button-next w-full h-10 flex justify-center items-center cursor-pointer mt-2 bg-[#2b7fff] rounded-lg hover:bg-[#2b7fff]/80 transition-colors">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="currentColor"
                      className="bi bi-caret-down-fill text-white"
                      viewBox="0 0 16 16"
                    >
                      <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="--wrapper-card-kosakata-and-comparison rounded-xl flex flex-col gap-4">
              <div className="w-full h-full bg-white shadow-11 rounded-xl p-6 flex flex-col">
                <div className="font-bold text-xl text-gray-800 mb-4">
                  Klasifikasi Kata
                </div>
                <div className="w-full h-px bg-gray-200 mb-4"></div>

                <div className="flex-1 overflow-y-auto pr-2">
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-green-50 border border-blue-100 flex items-center justify-between">
                      <span className="font-medium text-gray-700">Saya</span>
                      <span className="px-3 xl:px-3 lg:px-1 py-1 bg-green-200 text-green-800 rounded-full text-sm font-semibold">
                        90%
                      </span>
                    </div>
 
                    <div className="p-3 rounded-lg bg-green-50 border border-green-100 flex items-center justify-between">
                      <span className="font-medium text-gray-700">Makan</span>
                      <span className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-sm font-semibold">
                        85%
                      </span>
                    </div>

                    <div className="p-3 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-between">
                      <span className="font-medium text-gray-700">Mobil</span>
                      <span className="px-3 py-1 bg-amber-200 text-amber-800 rounded-full text-sm font-semibold">
                        78%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="--compare w-full h-auto bg-white shadow-11 rounded-xl p-6 flex flex-col">
                <div className="font-bold text-xl text-gray-800 mb-4 ">
                  Perbandingan Hasil
                </div>
                <div className="w-full h-px bg-gray-200 mb-4"></div>
                <div className="--word">
                  <div className="--result font-bold text-gray-400 w-full mb-2 p-4 rounded-xl bg-gray-100">
                    <span className="text-green-700">Saya </span>
                    <span className="text-green-700">Makan </span>
                    <span>Adik </span>
                  </div>
                  <div className="--question font-bold text-green-800 p-4 rounded-xl bg-green-200">
                    Saya Makan Adik
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
