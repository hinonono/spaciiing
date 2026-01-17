import React, { useEffect } from "react";
import { SvgCross } from "../assets/icons";
import { AnimatePresence, motion } from "motion/react";

interface ModalProps {
  show: boolean;
  handleClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ show, handleClose, children }) => {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (show) {
      const prev = document.body.style.overflowY;
      document.body.style.overflowY = "hidden";
      return () => {
        document.body.style.overflowY = prev; // restore
      };
    }
  }, [show]);

  return (
    <>
      <AnimatePresence>
        {show && (
          <motion.div
            className={`modal ${show ? "show" : ""}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="modal-content hide-scrollbar-vertical"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", duration: 0.75, ease: "easeInOut", bounce: 0 }}
            >
              <div className="close-wrap" onClick={handleClose}>
                <div className="icon-24">
                  <SvgCross color="var(--tooltip-icon)" />
                </div>
              </div>
              {children}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Modal;
