import React from "react";
import { AppProvider } from "./AppProvider";
import CoreLayer from "./CoreLayer";

const App: React.FC = () => {
  return (
    <AppProvider>
      <CoreLayer />
    </AppProvider>
  );
};

export default App;
