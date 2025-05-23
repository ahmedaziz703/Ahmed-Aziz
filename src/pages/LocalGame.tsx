
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
        title: "انتهت اللعبة",
        description: "انتهت اللعبة بالتعادل!",
      });
    } else {
      toast({
        title: "انتهت اللعبة",
        description: `${winner === "white" ? "الأبيض" : "الأسود"} فاز باللعبة!`,
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="p-4 flex justify-between items-center border-b">
        <Button variant="ghost" onClick={() => navigate("/")} className="flex items-center gap-2">
          <ArrowLeft size={18} /> رجوع
        </Button>
        <h1 className="text-xl font-bold">لعبة محلية</h1>
        <Button
          variant="outline"
          size="sm"
          onClick={handleNewGame}
          className="flex items-center gap-1"
        >
          <RotateCcw size={16} /> لعبة جديدة
        </Button>
      </header>

      <main className="flex-1 container py-6 px-4 mx-auto flex flex-col items-center justify-center">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2">لعبة محلية لشخصين</h1>
          <p className="text-muted-foreground">تناوبا على اللعب على نفس الجهاز</p>
        </div>

        <div className="w-full max-w-[900px] mx-auto bg-secondary/30 p-4 md:p-6 rounded-xl shadow-xl">
          <div className="chess-wrapper">
            <ChessBoard
              key={gameId}
              mode="local"
              onGameEnd={handleGameEnd}
            />
          </div>
        </div>

        {gameEnded && (
          <div className="mt-6">
            <Button onClick={handleNewGame} className="flex items-center gap-2 px-8 py-6 text-lg">
              <RotateCcw size={16} /> العب مرة أخرى
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
