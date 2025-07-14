"use client";
import { useRouter } from "next/navigation";

export default function RouteSwitchButton() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/upload");
  };

  return (
    <button
      onClick={handleClick}
      className="bg-white text-indigo-600 font-semibold px-8 py-3 absolute right-16 rounded-lg shadow-md hover:bg-indigo-100 transition -translate-y-1/2"
    >
      Sense by Uploading file
    </button>
  );
}
