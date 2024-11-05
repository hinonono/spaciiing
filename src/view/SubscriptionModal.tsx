import React, { useState } from "react";
import info from "../info.json";
import Modal from "../components/Modal";
import { useAppContext } from "../AppProvider";
import NewFreeTrialView from "../components/temp/freeTrialView/NewFreeTrialView";
import LegacyFreeTrialView from "../components/temp/freeTrialView/LegacyFreeTrialView";

const SubscriptionModal: React.FC = () => {
  const { showCTSubscribe, setShowCTSubscribe } = useAppContext();

  const handleCloseCTSubscribe = () => {
    setShowCTSubscribe(false);
  };

  const freeTrialViewHandler = () => {
    if (info.featureFlag.newFreeTrialView) {
      return <NewFreeTrialView />;
    } else {
      return <LegacyFreeTrialView />;
    }
  };

  return (
    <Modal show={showCTSubscribe} handleClose={handleCloseCTSubscribe}>
      {freeTrialViewHandler()}
    </Modal>
  );
};

export default SubscriptionModal;
