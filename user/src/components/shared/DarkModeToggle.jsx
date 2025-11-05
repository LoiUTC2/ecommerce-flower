import { Moon, Sun } from "lucide-react";
import { Button } from "../ui/button";
import { useTheme } from "../ui/theme-provider";

export function ModeToggle() {
    const { theme, setTheme } = useTheme();
    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </Button>
    );
}
