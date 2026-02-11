import { AnimatePresence, motion } from 'motion/react';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface BottomChipProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  content: string;
}

const BottomChip: React.FC<BottomChipProps> = ({
  open,
  setOpen,
  content
}) => {
  const { t } = useTranslation();

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => setOpen(false), 2000);
    return () => clearTimeout(t);
  }, [open]);

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: -16, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className={"bottom-chip-wrapper flex justify-content-center"}
          >
            <div className='bottom-chip'>
              {t(content)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default BottomChip;
