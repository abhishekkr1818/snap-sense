"use client";

import { useEffect, useRef } from "react";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs";
import { redirect } from "next/dist/server/api-utils";
import RouteSwitchButton from "@/components/RouteSwitchButton";

export default function Home() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const runDetection = () => {
    const doesExist =
      navigator.mediaDevices.getUserMedia({ video: true }) instanceof Promise;
    if (!doesExist) return alert("Camera not found");

    if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
      const webCampromise = navigator.mediaDevices
        .getUserMedia({
          audio: false,
          video: { facingMode: "user" },
        })
        .then((stream) => {
          videoRef.current.srcObject = stream;
          return new Promise((resolve, reject) => {
            videoRef.current.onloadedmetadata = () => {
              resolve();
            };
          });
        });

      const modelPromise = cocoSsd.load();

      Promise.all([webCampromise, modelPromise]).then((values) => {
        detectFrame(videoRef.current, values[1]);
      });
    }
  };

  const detectFrame = (video, model) => {
    model.detect(video).then((predictions) => {
      renderPredictions(predictions);

      requestAnimationFrame(() => {
        detectFrame(video, model);
      });
    });
  };

  const renderPredictions = (predections) => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    const font = "16px sans-serif";
    ctx.font = font;
    ctx.textBaseline = "top";

    predections.forEach((prediction) => {
      const [x, y, width, height] = prediction.bbox;

      ctx.strokeStyle = "#818cf8";
      ctx.lineWidth = 4;
      ctx.strokeRect(x, y, width, height);

      ctx.fillStyle = "#818cf8";
      const textWidth = ctx.measureText(prediction.class).width;
      ctx.fillRect(x, y, textWidth + 7, parseInt(font, 10) + 4);

      ctx.fillStyle = "#fff";
      ctx.fillText(prediction.class, x, y);
    });
  };

  useEffect(() => {
    runDetection();
  }, []);

  return (
    <div className="relative h-screen justify-center items-center bg-indigo-400">
      <div className="hidden lg:block absolute right-6 top-1/2 -translate-y-1/2">
  <RouteSwitchButton />
</div>
      <h1 className="text-center font-extrabold text-3xl md:text-4xl justify-center items-center animate-pulse drop-shadow-lg mb-2 p-1">SnapSense</h1>
      <video
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border-8 border-dashed rounded-xl"
        width={500}
        height={350}
        autoPlay
        playsInline
        muted
        ref={videoRef}
      />
      <canvas
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        width={500}
        height={350}
        ref={canvasRef}
      />
      <p className="absolute bottom-1 left-1/2 transform -translate-x-1/2 text-white text-lg md:text-xl font-medium text-center px-4">
      Detect who you are — Live object recognition
    </p>
    <div className="hidden font-semibold lg:block absolute left-20 text-white/60 max-w-[120px] text-xl leading-relaxed top-1/3">
    "Know the world through the lens of AI."
  </div>
    </div>

  );
}
