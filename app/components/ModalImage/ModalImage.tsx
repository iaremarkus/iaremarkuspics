import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useKeyPress } from "react-use";

export interface ModalImageProps {
  className?: string;
  src: string;
}

export function ModalImage({ src, className = "", ...props }: ModalImageProps) {
  const [open, setOpen] = useState<boolean>(false);
  const toggleModal = () => setOpen(!open);

  const predicate = (event: any) => event.key === "Escape";
  const [escape] = useKeyPress(predicate);

  useEffect(() => {
    if (escape) setOpen(false);
  }, [escape]);

  return (
    <div>
      <motion.div whileHover={{ scale: 1.05 }}>
        <img
          src={src}
          alt="Captured by iaremarkuspics"
          onClick={toggleModal}
          className="cursor-pointer w-full h-full object-cover"
        />
      </motion.div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            exit={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed w-full h-screen top-0 left-0 z-50 bg-slate-900 bg-opacity-80 flex items-center justify-center p-2 md:p-5 lg:p-10"
            onClick={toggleModal}
          >
            <img
              src={src}
              alt="Captured by iaremarkuspics"
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
