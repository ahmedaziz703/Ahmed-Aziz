
import { useEffect, useState } from "react";
import { Board, Piece, PieceColor, Square, createBoard, getPossibleMoves, isInCheck, isValidMove, makeMove, getComputerMove } from "@/lib/chess";
import { useToast } from "@/hooks/use-toast";

type ChessBoardProps = {
  mode: "local" | "computer" | "online";
  playerColor?: PieceColor;
  onGameEnd?: (winner: PieceColor | "draw") => void;
  shareId?: string;
};

export default function ChessBoard({ mode, playerColor = "white", onGameEnd, shareId }: ChessBoardProps) {
  const [board, setBoard] = useState<Board>(createBoard());
  const [currentPlayer, setCurrentPlayer] = useState<PieceColor>("white");
  const [selectedPiece, setSelectedPiece] = useState<Square | null>(null);
  const [possibleMoves, setPossibleMoves] = useState<Square[]>([]);
  const [lastMove, setLastMove] = useState<{ from: Square; to: Square } | null>(null);
  const [isCheck, setIsCheck] = useState<PieceColor | null>(null);
  const [capturedPieces, setCapturedPieces] = useState<{
    white: Piece[];
    black: Piece[];
  }>({ white: [], black: [] });

  const { toast } = useToast();

  // Initialize or reset the game
  useEffect(() => {
    setBoard(createBoard());
    setCurrentPlayer("white");
    setSelectedPiece(null);
    setPossibleMoves([]);
    setLastMove(null);
    setIsCheck(null);
    setCapturedPieces({ white: [], black: [] });
  }, [mode, shareId]);

  // Check for check after each move
  useEffect(() => {
    if (isInCheck(board, "white")) {
      setIsCheck("white");
    } else if (isInCheck(board, "black")) {
      setIsCheck("black");
    } else {
      setIsCheck(null);
    }
  }, [board]);

  // Computer player logic
  useEffect(() => {
    if (mode === "computer" && currentPlayer !== playerColor) {
      // Add a small delay to make it feel more natural
      const timer = setTimeout(() => {
        const computerMove = getComputerMove(board, currentPlayer);
        if (computerMove) {
          handleMove(computerMove.from, computerMove.to);
        } else {
          // Computer has no valid moves
          toast({
            title: "Game Over",
            description: "Computer has no valid moves. You win!",
          });
          onGameEnd?.(playerColor);
        }
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [mode, currentPlayer, board, playerColor]);

  // Online game logic
  useEffect(() => {
    if (mode === "online" && shareId) {
      // Here we would connect to a real-time service (like WebSockets)
      // And listen for moves from the opponent
      // For now, we'll just simulate it for demo purposes
      
      // Listen for opponent's move
      const onReceiveMove = (data: { from: Square; to: Square }) => {
        if (currentPlayer !== playerColor) {
          handleMove(data.from, data.to);
        }
      };

      // Cleanup listeners
      return () => {
        // Disconnect from real-time service
      };
    }
  }, [mode, shareId, currentPlayer]);

  // Handle piece selection and movement
  const handleSquareClick = (row: number, col: number) => {
    // In online mode, only allow moves during player's turn
    if (mode === "online" && currentPlayer !== playerColor) {
      return;
    }

    const square = { row, col };
    const piece = board[row][col];

    // If a piece is already selected
    if (selectedPiece) {
      // Try to move to the clicked square
      if (possibleMoves.some(move => move.row === row && move.col === col)) {
        handleMove(selectedPiece, square);
      } else if (piece && piece.color === currentPlayer) {
        // Select another piece of the same color
        setSelectedPiece(square);
        setPossibleMoves(getPossibleMoves(board, square));
      } else {
        // Deselect if clicked elsewhere
        setSelectedPiece(null);
        setPossibleMoves([]);
      }
    } else if (piece && piece.color === currentPlayer) {
      // Select a piece if none is selected
      setSelectedPiece(square);
      setPossibleMoves(getPossibleMoves(board, square));
    }
  };

  // Handle piece movement
  const handleMove = (from: Square, to: Square) => {
    if (!isValidMove(board, from, to, currentPlayer)) return;

    // Track captured piece
    const capturedPiece = board[to.row][to.col];
    if (capturedPiece) {
      setCapturedPieces(prev => ({
        ...prev,
        [currentPlayer]: [...prev[currentPlayer], capturedPiece]
      }));
    }

    // Make the move
    const newBoard = makeMove(board, from, to);
    setBoard(newBoard);
    setLastMove({ from, to });
    
    // Reset selection
    setSelectedPiece(null);
    setPossibleMoves([]);

    // Switch player
    setCurrentPlayer(prev => prev === "white" ? "black" : "white");

    // If online, send move to opponent
    if (mode === "online" && shareId) {
      // Send move to opponent through real-time service
      // sendMove(shareId, { from, to });
    }
  };

  // Get the CSS class for a square
  const getSquareClass = (row: number, col: number) => {
    const isLightSquare = (row + col) % 2 === 0;
    let className = `chess-square ${isLightSquare ? "bg-chess-light" : "bg-chess-dark"}`;

    // Highlight the selected piece
    if (selectedPiece && selectedPiece.row === row && selectedPiece.col === col) {
      className += " bg-chess-selected";
    }

    // Highlight possible moves
    if (possibleMoves.some(move => move.row === row && move.col === col)) {
      className += " bg-chess-possible";
    }

    // Highlight last move
    if (lastMove && ((lastMove.from.row === row && lastMove.from.col === col) || 
                      (lastMove.to.row === row && lastMove.to.col === col))) {
      className += " bg-chess-highlight";
    }

    // Highlight king in check
    const piece = board[row][col];
    if (piece && piece.type === "king" && isCheck === piece.color) {
      className += " bg-chess-check";
    }

    return className;
  };

  // Get piece representation (could use images in a full implementation)
  const getPieceSymbol = (piece: Piece): string => {
    if (piece.color === "white") {
      switch (piece.type) {
        case "pawn": return "♙";
        case "rook": return "♖";
        case "knight": return "♘";
        case "bishop": return "♗";
        case "queen": return "♕";
        case "king": return "♔";
        default: return "";
      }
    } else {
      switch (piece.type) {
        case "pawn": return "♟";
        case "rook": return "♜";
        case "knight": return "♞";
        case "bishop": return "♝";
        case "queen": return "♛";
        case "king": return "♚";
        default: return "";
      }
    }
  };

  // Render the board (flipped for black player in computer/online mode)
  const renderBoard = () => {
    const shouldFlip = mode !== "local" && playerColor === "black";
    let rows = [...Array(8).keys()];
    let cols = [...Array(8).keys()];
    
    if (shouldFlip) {
      rows = rows.reverse();
      cols = cols.reverse();
    }

    return (
      <div className="grid grid-cols-8 border-2 border-primary/50 shadow-lg w-full max-w-md sm:max-w-lg md:max-w-xl bg-secondary">
        {rows.map(row => (
          cols.map(col => {
            const actualRow = shouldFlip ? 7 - row : row;
            const actualCol = shouldFlip ? 7 - col : col;
            const piece = board[actualRow][actualCol];
            
            return (
              <div 
                key={`${actualRow}-${actualCol}`}
                className={getSquareClass(actualRow, actualCol)}
                onClick={() => handleSquareClick(actualRow, actualCol)}
              >
                {piece && (
                  <div className={`chess-piece flex items-center justify-center text-3xl sm:text-4xl md:text-5xl ${piece.color === "white" ? "text-white" : "text-black"}`}>
                    {getPieceSymbol(piece)}
                  </div>
                )}
              </div>
            );
          })
        ))}
      </div>
    );
  };

  // Render captured pieces
  const renderCapturedPieces = (color: PieceColor) => {
    return (
      <div className="flex flex-wrap gap-1 text-xl">
        {capturedPieces[color].map((piece, idx) => (
          <span key={idx} className={`${color === "white" ? "text-white" : "text-black"} bg-secondary/50 rounded-sm px-1`}>
            {getPieceSymbol(piece)}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex justify-between w-full max-w-md sm:max-w-lg md:max-w-xl p-2">
        <div>
          {renderCapturedPieces("black")}
        </div>
        <div>
          {isCheck ? (
            <div className="text-destructive font-bold">
              {isCheck === "white" ? "White" : "Black"} is in check!
            </div>
          ) : (
            <div className="font-medium">
              {currentPlayer === "white" ? "White" : "Black"}'s turn
            </div>
          )}
        </div>
      </div>

      {renderBoard()}

      <div className="flex justify-between w-full max-w-md sm:max-w-lg md:max-w-xl p-2">
        <div>
          {renderCapturedPieces("white")}
        </div>
      </div>
    </div>
  );
}
