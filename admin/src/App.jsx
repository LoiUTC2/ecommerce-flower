import { Toaster } from "sonner";
import AppRoutes from "./routes";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
      <Toaster richColors />
    </AuthProvider>
  );
}
