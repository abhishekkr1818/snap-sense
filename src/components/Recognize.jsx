// src/components/Recognize.jsx
"use client";
import React, { useState } from "react";
import * as mobilenet from "@tensorflow-models/mobilenet";
import "@tensorflow/tfjs";

function Recognize() {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [predictions, setPredictions] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const image = URL.createObjectURL(file);
      setImageUrl(image);
    }
  };

  const handleClassify = async () => {
    try {
      setLoading(true);
      const imgElement = document.querySelector("#uploaded-image");
      const model = await mobilenet.load();
      const prediction = await model.classify(imgElement);
      setPredictions(prediction);
    } catch (error) {
      console.error("Classification error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full bg-indigo-400 flex flex-col gap-5 justify-center items-center px-4">
      <label>
        <span className="border-2 border-dashed rounded p-2 cursor-pointer bg-white/10 text-white">
          Upload here
        </span>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          hidden
        />
      </label>

      {imageUrl && (
        <>
          <img
            id="uploaded-image"
            className="w-[300px] rounded-xl shadow-lg"
            src={imageUrl}
            alt="Uploaded"
          />
          <button
            onClick={handleClassify}
            className="px-4 py-2 rounded bg-white text-indigo-600 font-semibold shadow-md hover:bg-indigo-100 transition"
          >
            {loading ? "Loading..." : "Classify"}
          </button>
        </>
      )}

      <div className="text-white mt-4 space-y-2">
        {predictions?.map((prediction) => (
          <div key={prediction.className} className="flex gap-3 font-medium">
            <span>{prediction.className}</span>
            <span>{(prediction.probability * 100).toFixed(2)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Recognize;
