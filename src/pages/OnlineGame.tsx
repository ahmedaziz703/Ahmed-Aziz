
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import ChessBoard from "@/components/ChessBoard";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Copy, RotateCcw, Share2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { PieceColor } from "@/lib/chess";
import { useAuth } from "@/components/AuthContext";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export default function OnlineGame() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { gameId } = useParams();
  const [newGameId, setNewGameId] = useState<string>(
    gameId || Math.random().toString(36).substring(2, 9)
  );
  const [gameUrl, setGameUrl] = useState("");
  const [gameStarted, setGameStarted] = useState(!!gameId);
  const [gameEnded, setGameEnded] = useState(false);
  const [playerColor, setPlayerColor] = useState<PieceColor>("white");
  
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);
  
  useEffect(() => {
    const url = `${window.location.origin}/play/online/${newGameId}`;
    setGameUrl(url);
  }, [newGameId]);
  
  const handleCreateGame = () => {
    setNewGameId(Math.random().toString(36).substring(2, 9));
    navigate(`/play/online/${newGameId}`);
    setGameStarted(true);
    toast({
      title: "تم إنشاء اللعبة",
      description: "شارك الرابط مع خصمك لبدء اللعب.",
    });
  };
  
  const handleJoinGame = () => {
    if (!gameId) return;
    setGameStarted(true);
    setPlayerColor("black"); // Joining player is black
  };
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(gameUrl);
    toast({
      title: "تم نسخ الرابط",
      description: "تم نسخ رابط اللعبة إلى الحافظة.",
    });
  };
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "انضم إلى لعبة الشطرنج الخاصة بي",
        text: "انقر على هذا الرابط للانضمام إلى لعبة الشطرنج:",
        url: gameUrl,
      });
    } else {
      handleCopyLink();
    }
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
  
  const handleNewGame = () => {
    // Reset the game
    setGameEnded(false);
    handleCreateGame();
  };

  // Show lobby if not in a game yet
  if (!gameStarted) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <header className="p-4 flex justify-between items-center border-b">
          <Button variant="ghost" onClick={() => navigate("/")} className="flex items-center gap-2">
            <ArrowLeft size={18} /> رجوع
          </Button>
          <h1 className="text-xl font-bold">لعبة عبر الإنترنت</h1>
          <div></div>
        </header>

        <main className="flex-1 container py-12 px-4 mx-auto flex flex-col items-center justify-center">
          <Card className="w-full max-w-md">
            <CardContent className="p-6 space-y-6">
              <h2 className="text-2xl font-bold text-center mb-4">اللعب عبر الإنترنت</h2>
              
              <div className="space-y-4">
                <Button 
                  className="w-full text-lg py-6" 
                  onClick={handleCreateGame}
                >
                  إنشاء لعبة جديدة
                </Button>
                
                {gameId && (
                  <Button 
                    className="w-full text-lg py-6" 
                    onClick={handleJoinGame}
                    variant="secondary"
                  >
                    الانضمام للعبة {gameId}
                  </Button>
                )}
              </div>
              
              {!gameId && (
                <div className="text-center text-sm text-muted-foreground">
                  <p>أنشئ لعبة جديدة وشارك الرابط مع صديقك</p>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="p-4 flex justify-between items-center border-b">
        <Button variant="ghost" onClick={() => navigate("/")} className="flex items-center gap-2">
          <ArrowLeft size={18} /> رجوع
        </Button>
        <h1 className="text-xl font-bold">لعبة عبر الإنترنت</h1>
        {gameEnded && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleNewGame}
            className="flex items-center gap-1"
          >
            <RotateCcw size={16} /> لعبة جديدة
          </Button>
        )}
      </header>

      <main className="flex-1 container py-6 px-4 mx-auto flex flex-col items-center justify-center">
        {!gameEnded && (
          <div className="mb-6 w-full max-w-md">
            <div className="flex gap-2 mb-4">
              <Input value={gameUrl} readOnly className="flex-1" />
              <Button variant="outline" onClick={handleCopyLink} title="نسخ الرابط">
                <Copy size={18} />
              </Button>
              <Button variant="outline" onClick={handleShare} title="مشاركة">
                <Share2 size={18} />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              شارك هذا الرابط مع خصمك لبدء اللعب
            </p>
          </div>
        )}

        <div className="w-full max-w-[900px] mx-auto bg-secondary/30 p-4 md:p-6 rounded-xl shadow-xl">
          <div className="chess-wrapper">
            <ChessBoard
              mode="online"
              playerColor={playerColor}
              onGameEnd={handleGameEnd}
              shareId={newGameId}
            />
          </div>
        </div>

        {gameEnded && (
          <div className="mt-6">
            <Button onClick={handleNewGame} className="flex items-center gap-2 px-8 py-6 text-lg">
              <RotateCcw size={20} /> لعب لعبة جديدة
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
