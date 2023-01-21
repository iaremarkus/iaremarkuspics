import classNames from "classnames";
import { AnimatePresence, motion } from "framer-motion";
import NextImage from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

export interface FolderLinkProps {
  className?: string;
  name: string;
  featured?: any;
}

export const FolderLink = ({ name, featured, className = "", ...props }: FolderLinkProps) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const toggleIsHovered = () => setIsHovered(!isHovered);

  useEffect(() => {
    const newImage = new Image();
    newImage.src = featured;
  }, [featured]);

  const colors = useMemo(
    () => [
      "from-orange-500 to-yellow-700 hover:from-yellow-700 hover:to-orange-900",
      "from-pink-500 to-magenta-700 hover:from-magenta-700 hover:to-pink-900",
      "from-indigo-500 to-blue-700 hover:from-blue-700 hover:to-indigo-900",
      "from-blue-500 to-lightblue-700 hover:from-lightblue-700 hover:to-blue-900",
      "from-purple-500 to-pink-700 hover:from-pink-700 hover:to-purple-900",
      "from-green-500 to-red-900 hover:from-red-700 hover:to-green-900"
    ],
    []
  );
  const color = colors[Math.floor(Math.random() * colors.length)];

  return (
    <>
      <Link
        href={`/pictures/${name}`}
        {...props}
        className="relative z-20"
        onMouseOver={toggleIsHovered}
        onMouseOut={toggleIsHovered}
      >
        <h2
          className={classNames(
            "capitalize text-4xl md:text-6xl lg:text-7xl font-bold",
            "transition text-transparent bg-clip-text bg-gradient-to-br drop-shadow-xl",
            color
          )}
        >
          {name.replaceAll("-", " ")}
        </h2>
      </Link>

      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed w-1/2 h-screen top-0 right-0 bg-slate-50 z-10"
          >
            <NextImage src={featured} fill alt={"Image"} className="object-cover" />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
