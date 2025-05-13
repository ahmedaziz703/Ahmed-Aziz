
import { Button } from "@/components/ui/button";
import ChessBoard from "@/components/ChessBoard";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { PieceColor } from "@/lib/chess";

export default function LocalGame() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [gameId, setGameId] = useState(Date.now().toString());
  const [gameEnded, setGameEnded] = useState(false);

  const handleNewGame = () => {
    setGameId(Date.now().toString());
    setGameEnded(false);
  };

  const handleGameEnd = (winner: PieceColor | "draw") => {
    setGameEnded(true);
    
    if (winner === "draw") {
      toast({
        title: "Game Over",
        description: "The game ended in a draw!",
      });
    } else {
      toast({
        title: "Game Over",
        description: `${winner === "white" ? "White" : "Black"} won the game!`,
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="p-4 flex justify-between items-center border-b">
        <Button variant="ghost" onClick={() => navigate("/")} className="flex items-center gap-2">
          <ArrowLeft size={18} /> Back
        </Button>
        <h1 className="text-xl font-bold">Local Game</h1>
        <Button
          variant="outline"
          size="sm"
          onClick={handleNewGame}
          className="flex items-center gap-1"
        >
          <RotateCcw size={16} /> New Game
        </Button>
      </header>

      <main className="flex-1 container py-6 px-4 mx-auto flex flex-col items-center justify-center">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2">Local Two-Player Game</h1>
          <p className="text-muted-foreground">Take turns playing on the same device</p>
        </div>

        <div className="w-full flex justify-center">
          <ChessBoard
            key={gameId}
            mode="local"
            onGameEnd={handleGameEnd}
          />
        </div>

        {gameEnded && (
          <div className="mt-6">
            <Button onClick={handleNewGame} className="flex items-center gap-2">
              <RotateCcw size={16} /> Play Again
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
