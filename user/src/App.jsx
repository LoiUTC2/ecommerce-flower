import React from "react";
import "./App.css";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes";
import { ThemeProvider } from "./components/ui/theme-provider";

export default function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <ThemeProvider defaultTheme="light" storageKey="theme">
          <AppRoutes />
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}
