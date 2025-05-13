
import { Button } from "@/components/ui/button";
import ChessBoard from "@/components/ChessBoard";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { PieceColor } from "@/lib/chess";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export default function ComputerGame() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [gameId, setGameId] = useState(Date.now().toString());
  const [gameEnded, setGameEnded] = useState(false);
  const [playerColor, setPlayerColor] = useState<PieceColor>("white");

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
    } else if (winner === playerColor) {
      toast({
        title: "تهانينا!",
        description: "لقد فزت باللعبة!",
      });
    } else {
      toast({
        title: "انتهت اللعبة",
        description: "الكمبيوتر فاز هذه المرة. حاول مرة أخرى!",
      });
    }
  };

  const handleColorChange = (value: string) => {
    setPlayerColor(value as PieceColor);
    handleNewGame();
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="p-4 flex justify-between items-center border-b">
        <Button variant="ghost" onClick={() => navigate("/")} className="flex items-center gap-2">
          <ArrowLeft size={18} /> رجوع
        </Button>
        <h1 className="text-xl font-bold">لعبة ضد الكمبيوتر</h1>
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
          <h1 className="text-2xl font-bold mb-2">اللعب ضد الكمبيوتر</h1>
          <p className="text-muted-foreground">تحدى الذكاء الاصطناعي</p>
        </div>

        <div className="mb-6">
          <RadioGroup 
            defaultValue={playerColor}
            onValueChange={handleColorChange}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="white" id="white" />
              <Label htmlFor="white" className="cursor-pointer mr-2">اللعب بالأبيض</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="black" id="black" />
              <Label htmlFor="black" className="cursor-pointer mr-2">اللعب بالأسود</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="w-full flex justify-center">
          <ChessBoard
            key={gameId}
            mode="computer"
            playerColor={playerColor}
            onGameEnd={handleGameEnd}
          />
        </div>

        {gameEnded && (
          <div className="mt-6">
            <Button onClick={handleNewGame} className="flex items-center gap-2">
              <RotateCcw size={16} /> العب مرة أخرى
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
