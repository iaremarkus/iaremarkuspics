import classNames from "classnames";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

export interface FolderLinkProps {
  className?: string;
  name: string;
  featured?: any;
  count: number;
}

export const FolderLink = ({ name, featured, count, className = "", ...props }: FolderLinkProps) => {
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
      <Link href={`/pictures/${name}`} {...props} onMouseOver={toggleIsHovered} onMouseOut={toggleIsHovered}>
        <span
          className={classNames(
            "relative z-20 inline-flex capitalize text-4xl md:text-6xl lg:text-7xl font-bold",
            "transition text-transparent bg-clip-text bg-gradient-to-br drop-shadow-xl",
            "pr-5",
            color
          )}
        >
          {name.replaceAll("-", " ")}

          <small
            className={classNames(
              "absolute text-white text-xs font-bold w-7 h-7 rounded-full",
              "bg-gradient-to-br flex items-center justify-center right-0",
              color
            )}
          >
            {count}
          </small>
        </span>
      </Link>

      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed w-1/2 h-screen top-0 right-0 bg-slate-50 z-10"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={featured} alt={"Image"} className="object-cover h-full" />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
