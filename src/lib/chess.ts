
export type PieceType = 'pawn' | 'rook' | 'knight' | 'bishop' | 'queen' | 'king';
export type PieceColor = 'white' | 'black';
export type Square = { row: number; col: number };

export interface Piece {
  type: PieceType;
  color: PieceColor;
  hasMoved?: boolean;
}

export type Board = (Piece | null)[][];

// Function to create a new chess board
export function createBoard(): Board {
  const board: Board = Array(8).fill(null).map(() => Array(8).fill(null));

  // Set up pawns
  for (let col = 0; col < 8; col++) {
    board[1][col] = { type: 'pawn', color: 'black' };
    board[6][col] = { type: 'pawn', color: 'white' };
  }

  // Set up rooks
  board[0][0] = { type: 'rook', color: 'black' };
  board[0][7] = { type: 'rook', color: 'black' };
  board[7][0] = { type: 'rook', color: 'white' };
  board[7][7] = { type: 'rook', color: 'white' };

  // Set up knights
  board[0][1] = { type: 'knight', color: 'black' };
  board[0][6] = { type: 'knight', color: 'black' };
  board[7][1] = { type: 'knight', color: 'white' };
  board[7][6] = { type: 'knight', color: 'white' };

  // Set up bishops
  board[0][2] = { type: 'bishop', color: 'black' };
  board[0][5] = { type: 'bishop', color: 'black' };
  board[7][2] = { type: 'bishop', color: 'white' };
  board[7][5] = { type: 'bishop', color: 'white' };

  // Set up queens
  board[0][3] = { type: 'queen', color: 'black' };
  board[7][3] = { type: 'queen', color: 'white' };

  // Set up kings
  board[0][4] = { type: 'king', color: 'black' };
  board[7][4] = { type: 'king', color: 'white' };

  return board;
}

// Function to check if a move is valid
export function isValidMove(
  board: Board,
  from: Square,
  to: Square,
  currentPlayer: PieceColor
): boolean {
  const piece = board[from.row][from.col];

  // Check if the piece exists and belongs to the current player
  if (!piece || piece.color !== currentPlayer) {
    return false;
  }

  // Check if the destination is occupied by a piece of the same color
  const destPiece = board[to.row][to.col];
  if (destPiece && destPiece.color === currentPlayer) {
    return false;
  }

  // Get possible moves for the selected piece
  const possibleMoves = getPossibleMoves(board, from);

  // Check if the destination is in the list of possible moves
  return possibleMoves.some(move => move.row === to.row && move.col === to.col);
}

// Function to get possible moves for a piece
export function getPossibleMoves(board: Board, position: Square): Square[] {
  const piece = board[position.row][position.col];
  if (!piece) return [];

  const moves: Square[] = [];

  switch (piece.type) {
    case 'pawn':
      // Pawns move differently based on color
      const direction = piece.color === 'white' ? -1 : 1;
      const startRow = piece.color === 'white' ? 6 : 1;

      // Forward move (1 square)
      if (
        position.row + direction >= 0 &&
        position.row + direction < 8 &&
        !board[position.row + direction][position.col]
      ) {
        moves.push({ row: position.row + direction, col: position.col });

        // Forward move (2 squares from starting position)
        if (
          position.row === startRow &&
          !board[position.row + 2 * direction][position.col]
        ) {
          moves.push({ row: position.row + 2 * direction, col: position.col });
        }
      }

      // Capturing diagonally
      for (let colOffset of [-1, 1]) {
        const newCol = position.col + colOffset;
        const newRow = position.row + direction;
        
        if (
          newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8 &&
          board[newRow][newCol] && board[newRow][newCol]?.color !== piece.color
        ) {
          moves.push({ row: newRow, col: newCol });
        }
      }
      break;

    case 'rook':
      // Rooks move horizontally and vertically any number of squares
      const directions = [
        { row: 1, col: 0 },  // down
        { row: -1, col: 0 }, // up
        { row: 0, col: 1 },  // right
        { row: 0, col: -1 }  // left
      ];

      for (const dir of directions) {
        let newRow = position.row + dir.row;
        let newCol = position.col + dir.col;

        while (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
          const targetPiece = board[newRow][newCol];

          if (!targetPiece) {
            moves.push({ row: newRow, col: newCol });
          } else if (targetPiece.color !== piece.color) {
            moves.push({ row: newRow, col: newCol });
            break;
          } else {
            break;
          }

          newRow += dir.row;
          newCol += dir.col;
        }
      }
      break;

    case 'knight':
      // Knights move in an L-shape
      const knightOffsets = [
        { row: -2, col: -1 },
        { row: -2, col: 1 },
        { row: -1, col: -2 },
        { row: -1, col: 2 },
        { row: 1, col: -2 },
        { row: 1, col: 2 },
        { row: 2, col: -1 },
        { row: 2, col: 1 }
      ];

      for (const offset of knightOffsets) {
        const newRow = position.row + offset.row;
        const newCol = position.col + offset.col;

        if (
          newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8 &&
          (!board[newRow][newCol] || board[newRow][newCol]?.color !== piece.color)
        ) {
          moves.push({ row: newRow, col: newCol });
        }
      }
      break;

    case 'bishop':
      // Bishops move diagonally any number of squares
      const bishopDirections = [
        { row: 1, col: 1 },   // down-right
        { row: 1, col: -1 },  // down-left
        { row: -1, col: 1 },  // up-right
        { row: -1, col: -1 }  // up-left
      ];

      for (const dir of bishopDirections) {
        let newRow = position.row + dir.row;
        let newCol = position.col + dir.col;

        while (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
          const targetPiece = board[newRow][newCol];

          if (!targetPiece) {
            moves.push({ row: newRow, col: newCol });
          } else if (targetPiece.color !== piece.color) {
            moves.push({ row: newRow, col: newCol });
            break;
          } else {
            break;
          }

          newRow += dir.row;
          newCol += dir.col;
        }
      }
      break;

    case 'queen':
      // Queens can move like rooks and bishops combined
      const queenDirections = [
        { row: 1, col: 0 },   // down
        { row: -1, col: 0 },  // up
        { row: 0, col: 1 },   // right
        { row: 0, col: -1 },  // left
        { row: 1, col: 1 },   // down-right
        { row: 1, col: -1 },  // down-left
        { row: -1, col: 1 },  // up-right
        { row: -1, col: -1 }  // up-left
      ];

      for (const dir of queenDirections) {
        let newRow = position.row + dir.row;
        let newCol = position.col + dir.col;

        while (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
          const targetPiece = board[newRow][newCol];

          if (!targetPiece) {
            moves.push({ row: newRow, col: newCol });
          } else if (targetPiece.color !== piece.color) {
            moves.push({ row: newRow, col: newCol });
            break;
          } else {
            break;
          }

          newRow += dir.row;
          newCol += dir.col;
        }
      }
      break;

    case 'king':
      // Kings move one square in any direction
      const kingDirections = [
        { row: 1, col: 0 },   // down
        { row: -1, col: 0 },  // up
        { row: 0, col: 1 },   // right
        { row: 0, col: -1 },  // left
        { row: 1, col: 1 },   // down-right
        { row: 1, col: -1 },  // down-left
        { row: -1, col: 1 },  // up-right
        { row: -1, col: -1 }  // up-left
      ];

      for (const dir of kingDirections) {
        const newRow = position.row + dir.row;
        const newCol = position.col + dir.col;

        if (
          newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8 &&
          (!board[newRow][newCol] || board[newRow][newCol]?.color !== piece.color)
        ) {
          moves.push({ row: newRow, col: newCol });
        }
      }

      // Implement castling (simplified for now)
      if (!piece.hasMoved) {
        // Kingside castling
        if (
          board[position.row][7] &&
          board[position.row][7].type === 'rook' &&
          !board[position.row][7].hasMoved &&
          !board[position.row][5] &&
          !board[position.row][6]
        ) {
          moves.push({ row: position.row, col: 6 });
        }

        // Queenside castling
        if (
          board[position.row][0] &&
          board[position.row][0].type === 'rook' &&
          !board[position.row][0].hasMoved &&
          !board[position.row][1] &&
          !board[position.row][2] &&
          !board[position.row][3]
        ) {
          moves.push({ row: position.row, col: 2 });
        }
      }
      break;
  }

  return moves;
}

// Function to make a move
export function makeMove(
  board: Board,
  from: Square,
  to: Square
): Board {
  const newBoard = board.map(row => [...row]);
  
  // Get the piece
  const piece = newBoard[from.row][from.col];
  if (!piece) return newBoard;

  // Update hasMoved flag for kings and rooks (for castling)
  if (piece.type === 'king' || piece.type === 'rook') {
    piece.hasMoved = true;
  }

  // Handle pawn promotion
  if (piece.type === 'pawn' && (to.row === 0 || to.row === 7)) {
    newBoard[to.row][to.col] = { type: 'queen', color: piece.color };
    newBoard[from.row][from.col] = null;
  } else {
    // Regular move
    newBoard[to.row][to.col] = piece;
    newBoard[from.row][from.col] = null;
  }

  return newBoard;
}

// Function to check if a player is in check
export function isInCheck(board: Board, kingColor: PieceColor): boolean {
  // Find the king's position
  let kingPosition: Square | null = null;
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.type === 'king' && piece.color === kingColor) {
        kingPosition = { row, col };
        break;
      }
    }
    if (kingPosition) break;
  }

  if (!kingPosition) return false;

  // Check if any opponent's piece can capture the king
  const opponentColor = kingColor === 'white' ? 'black' : 'white';
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.color === opponentColor) {
        const moves = getPossibleMoves(board, { row, col });
        if (moves.some(move => move.row === kingPosition!.row && move.col === kingPosition!.col)) {
          return true;
        }
      }
    }
  }

  return false;
}

// Simple chess AI for computer player
export function getComputerMove(board: Board, computerColor: PieceColor): { from: Square; to: Square } | null {
  const possibleMoves: Array<{ from: Square; to: Square; score: number }> = [];
  
  // Collect all possible moves for the computer
  for (let fromRow = 0; fromRow < 8; fromRow++) {
    for (let fromCol = 0; fromCol < 8; fromCol++) {
      const piece = board[fromRow][fromCol];
      if (piece && piece.color === computerColor) {
        const from = { row: fromRow, col: fromCol };
        const moves = getPossibleMoves(board, from);
        
        for (const to of moves) {
          // Make a temporary move to evaluate
          const newBoard = makeMove([...board.map(row => [...row])], from, to);
          
          // Calculate a simple score for this move
          let score = 0;
          
          // Prefer captures (value pieces differently)
          const capturedPiece = board[to.row][to.col];
          if (capturedPiece) {
            switch (capturedPiece.type) {
              case 'pawn': score += 1; break;
              case 'knight': score += 3; break;
              case 'bishop': score += 3; break;
              case 'rook': score += 5; break;
              case 'queen': score += 9; break;
              case 'king': score += 100; break;
            }
          }
          
          // Avoid getting in check
          if (isInCheck(newBoard, computerColor)) {
            score -= 10;
          }
          
          // Put opponent in check
          if (isInCheck(newBoard, computerColor === 'white' ? 'black' : 'white')) {
            score += 5;
          }
          
          possibleMoves.push({ from, to, score });
        }
      }
    }
  }
  
  if (possibleMoves.length === 0) {
    return null;
  }
  
  // Sort moves by score, descending
  possibleMoves.sort((a, b) => b.score - a.score);
  
  // Return the best move, with some randomness for moves with similar scores
  const bestScore = possibleMoves[0].score;
  const bestMoves = possibleMoves.filter(move => move.score >= bestScore - 1);
  
  // Choose randomly among top moves
  const selectedMove = bestMoves[Math.floor(Math.random() * bestMoves.length)];
  return { from: selectedMove.from, to: selectedMove.to };
}
