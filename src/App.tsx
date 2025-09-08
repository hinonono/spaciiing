import React from "react";
import { AppProvider } from "./AppProvider";
import CoreLayer from "./CoreLayer";
import { MainWindowToolBar } from "./components";

const App: React.FC = () => {
  return (
    <AppProvider>
      <CoreLayer />
      <MainWindowToolBar />
    </AppProvider>
  );
};

export default App;
