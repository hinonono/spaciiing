import React from "react";
import Modal from "../components/Modal";
import { useAppContext } from "../AppProvider";
import NewFreeTrialView from "../components/temp/freeTrialView/NewFreeTrialView";

const SubscriptionModal: React.FC = () => {
  const { showCTSubscribe, setShowCTSubscribe } = useAppContext();

  const handleCloseCTSubscribe = () => {
    setShowCTSubscribe(false);
  };

  return (
    <Modal show={showCTSubscribe} handleClose={handleCloseCTSubscribe}>
      <NewFreeTrialView />
    </Modal>
  );
};

export default SubscriptionModal;
