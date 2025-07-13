import React from "react";
import { AppProvider } from "./AppProvider";
import CoreLayer from "./CoreLayer";
import { Portal } from "./components";

const App: React.FC = () => {
  return (
    <AppProvider>
      <CoreLayer />
      <Portal />
    </AppProvider>
  );
};

export default App;
