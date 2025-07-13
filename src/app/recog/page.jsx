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
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="h-screen w-full bg-indigo-400 flex flex-col gap-5 justify-center items-center">
      <label>
        <span className="border-2 border-dashed rounded p-2">Upload here</span>
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
            className="w-[300px] rounded-xl"
            src={imageUrl}
          />
          <button
            onClick={handleClassify}
            className="px-4 py-2 rounded bg-gray-100/10 "
          >
            {loading ? "Loading..." : "Classify"}
          </button>
        </>
      )}
      <div>
        {predictions?.map((prediction) => {
            return <div key={prediction.className} className="flex font-bold gap-2 items-center">
            <div>{prediction.className}</div>
            <div>{prediction.probability}</div>
            </div>
        })}
      </div>
    </div>
  );
}

export default Recognize;
