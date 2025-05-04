import React from "react";
import { cn } from "@/lib/utils"; // Ensure this utility exists

interface AvatarProps {
  userId?: string;
  name?: string;
  imageUrl?: string;
  width?: number;
  height?: number;
  className?: string;
  isOnline?: boolean; // Added online status prop
}

const Avatar: React.FC<AvatarProps> = ({
  userId,
  name,
  imageUrl,
  width = 40,
  height = 40,
  className,
  isOnline = false
}) => {
  const bgColor = [
    "bg-slate-200",
    "bg-teal-200",
    "bg-red-200",
    "bg-green-200",
    "bg-yellow-200",
    "bg-gray-200",
    "bg-cyan-200",
    "bg-sky-200",
    "bg-blue-200",
  ];

  const randomNumber = Math.floor(Math.random() * bgColor.length);
  const avatarName = name?.split(" ").map(word => word[0]).join("").toUpperCase();

  return (
    <div
      className={cn(
        "relative inline-block rounded-full font-bold",
        className
      )}
      style={{ 
        width: `${width}px`,
        height: `${height}px`,
        fontSize: `${Math.min(width, height) * 0.4}px`
      }}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={name || "User avatar"}
          className="w-full h-full rounded-full object-cover"
        />
      ) : (
        <div
          className={cn(
            "w-full h-full rounded-full flex items-center justify-center",
            !imageUrl && bgColor[randomNumber]
          )}
        >
          {avatarName || "?"}
        </div>
      )}

      {isOnline && (
        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
      )}
    </div>
  );
};

export default Avatar;

// Add this to lib/utils.ts if you don't have it
// export function cn(...classes: (string | undefined)[]) {
//   return classes.filter(Boolean).join(' ');
// }