import React from "react";
import { SvgCross } from "../assets/icons";

interface ModalProps {
  show: boolean;
  handleClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ show, handleClose, children }) => {
  return (
    <div className={`modal ${show ? "show" : ""}`} onClick={handleClose}>
      <div className="modal-container">
        <div
          className="modal-content hide-scrollbar-vertical"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="close-wrap" onClick={handleClose}>
            <div className="icon-24">
              <SvgCross color="var(--tooltip-icon)" />
            </div>
          </div>
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
