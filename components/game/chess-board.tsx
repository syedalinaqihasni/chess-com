"use client";

import { cn } from '@/lib/utils';

interface ChessBoardProps {
  position: string;
  onSquareClick: (square: string) => void;
  selectedSquare: string | null;
  possibleMoves: string[];
  playerColor: 'white' | 'black';
  lastMove?: string;
}

const pieceSymbols: { [key: string]: string } = {
  'K': '♔', 'Q': '♕', 'R': '♖', 'B': '♗', 'N': '♘', 'P': '♙',
  'k': '♚', 'q': '♛', 'r': '♜', 'b': '♝', 'n': '♞', 'p': '♟',
};

export function ChessBoard({ 
  position, 
  onSquareClick, 
  selectedSquare, 
  possibleMoves, 
  playerColor,
  lastMove 
}: ChessBoardProps) {
  const parseFen = (fen: string) => {
    const board: { [key: string]: string } = {};
    const rows = fen.split(' ')[0].split('/');
    
    rows.forEach((row, rankIndex) => {
      let fileIndex = 0;
      for (const char of row) {
        if (isNaN(Number(char))) {
          const file = String.fromCharCode(97 + fileIndex);
          const rank = String(8 - rankIndex);
          board[file + rank] = char;
          fileIndex++;
        } else {
          fileIndex += Number(char);
        }
      }
    });
    
    return board;
  };

  const boardState = parseFen(position);
  const files = playerColor === 'white' ? ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] : ['h', 'g', 'f', 'e', 'd', 'c', 'b', 'a'];
  const ranks = playerColor === 'white' ? ['8', '7', '6', '5', '4', '3', '2', '1'] : ['1', '2', '3', '4', '5', '6', '7', '8'];

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="grid grid-cols-8 gap-0 border-2 border-border rounded-lg overflow-hidden shadow-lg">
        {ranks.map((rank, rankIndex) =>
          files.map((file, fileIndex) => {
            const square = file + rank;
            const isLight = (rankIndex + fileIndex) % 2 === 0;
            const piece = boardState[square];
            const isSelected = selectedSquare === square;
            const isPossibleMove = possibleMoves.includes(square);
            const hasPiece = piece && pieceSymbols[piece];
            
            return (
              <div
                key={square}
                className={cn(
                  "chess-square cursor-pointer select-none",
                  isLight ? "chess-light" : "chess-dark",
                  isSelected && "highlighted",
                  isPossibleMove && !hasPiece && "possible-move",
                  isPossibleMove && hasPiece && "possible-capture"
                )}
                onClick={() => onSquareClick(square)}
              >
                {piece && (
                  <span className="chess-piece">
                    {pieceSymbols[piece]}
                  </span>
                )}
                
                {/* Coordinate labels */}
                {fileIndex === 0 && (
                  <div className="absolute top-1 left-1 text-xs font-semibold opacity-60">
                    {rank}
                  </div>
                )}
                {rankIndex === ranks.length - 1 && (
                  <div className="absolute bottom-1 right-1 text-xs font-semibold opacity-60">
                    {file}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}