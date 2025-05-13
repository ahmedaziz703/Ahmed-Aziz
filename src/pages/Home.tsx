
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/components/AuthContext";
import { useTheme } from "@/components/ThemeProvider";
import { Link, useNavigate } from "react-router-dom";
import { Computer, User, Wifi, Moon, Sun } from "lucide-react";

export default function Home() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="p-4 flex justify-between items-center border-b">
        <h1 className="text-2xl font-bold text-primary">Chess Maestro</h1>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
          >
            {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
          </Button>
          {user ? (
            <div className="flex gap-2 items-center">
              <span className="text-sm hidden sm:inline">Hello, {user.username}</span>
              <Button variant="outline" size="sm" onClick={logout}>Logout</Button>
            </div>
          ) : (
            <Button onClick={() => navigate("/login")}>Login</Button>
          )}
        </div>
      </header>

      <main className="flex-1 container max-w-4xl py-8 px-4 mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-primary">Chess Maestro</h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Play chess against friends locally, challenge the computer, or play online with others.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="mb-4 flex justify-center">
                <User size={48} className="text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-center mb-4">Play Locally</h2>
              <p className="text-muted-foreground mb-6 text-center">
                Play with a friend on the same device, taking turns.
              </p>
              <Button 
                className="w-full" 
                onClick={() => navigate("/play/local")}
              >
                Play Local Game
              </Button>
            </CardContent>
          </Card>

          <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="mb-4 flex justify-center">
                <Computer size={48} className="text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-center mb-4">Play vs Computer</h2>
              <p className="text-muted-foreground mb-6 text-center">
                Challenge our AI opponent and improve your skills.
              </p>
              <Button 
                className="w-full" 
                onClick={() => navigate("/play/computer")}
              >
                Challenge Computer
              </Button>
            </CardContent>
          </Card>

          <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="mb-4 flex justify-center">
                <Wifi size={48} className="text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-center mb-4">Play Online</h2>
              <p className="text-muted-foreground mb-6 text-center">
                Create a game and invite friends via a shareable link.
              </p>
              {user ? (
                <Button 
                  className="w-full" 
                  onClick={() => navigate("/play/online")}
                >
                  Play Online
                </Button>
              ) : (
                <Button 
                  className="w-full" 
                  variant="secondary"
                  onClick={() => navigate("/login")}
                >
                  Login to Play Online
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <h2 className="text-2xl font-semibold mb-4">About Chess Maestro</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Chess Maestro is a beautiful, modern chess application that lets you play chess in multiple ways.
            With elegant design, intuitive controls, and multiple game modes, it's the perfect way to enjoy the timeless game of chess.
          </p>
        </div>
      </main>

      <footer className="p-4 border-t text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Chess Maestro. All rights reserved.</p>
      </footer>
    </div>
  );
}
