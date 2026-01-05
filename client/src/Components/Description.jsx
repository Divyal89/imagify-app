import React from "react";
import { assets } from "../assets/assets";

const Description = () => {
  return (
    <div className="flex flex-col items-center justify-center my-24 p-6 md:px-28">
      <h1 className="text-3xl sm:text-4xl font-semibold mb-2">
        Create AI Images
      </h1>
      <p className="text-gray-500 mb-8">Turn Your imagination into visuals</p>

      <div className="flex flex-col gap-5 md:gap-14 md:flex-row items-center">
        <img
          src={assets.sample_img_1}
          alit=""
          className="w-80 xl:w-96 rounded-lg"
        />
        <div>
          <h2 className="text-3xl font-medium max-w-lg mb-4">
            Introduction the AI-Powered Text To Image Generator
          </h2>
          <p className="text-gray-600 mb-4">
            Welcome! 👋 I’m your AI image generator. Just describe the image you
            have in mind—such as the subject, style, colors, mood, or any
            specific details—and I’ll turn your ideas into a visual image.
            Whether you want realistic art, cartoons, fantasy scenes, or
            creative designs, feel free to experiment and be as detailed as you
            like. If you’re unsure, I can help you refine your prompt to get the
            best result. 🎨✨
          </p>
          <p className="text-gray-600 ">
            {" "}
            This AI image generator creates visuals based on user descriptions.
            Enter details such as subject, artistic style, lighting, color
            palette, and mood to generate high-quality images. Users may refine
            prompts for better results.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Description;
