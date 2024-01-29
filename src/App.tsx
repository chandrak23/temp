import React from "react";
import AppRoutes from "./Routes";
import ErrorBoundary from "./components/Common/ErrorBoundary/ErrorBoundary";
import "./App.scss";

function App() {
  return (
    <ErrorBoundary>
      <AppRoutes />;
    </ErrorBoundary>
  );
}

export default App;
