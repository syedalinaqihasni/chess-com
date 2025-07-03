export type PieceType = 'p' | 'n' | 'b' | 'r' | 'q' | 'k';
export type PieceColor = 'w' | 'b';

export interface ChessPiece {
  type: PieceType;
  color: PieceColor;
}

export interface ChessMove {
  from: string;
  to: string;
  piece: ChessPiece;
  captured?: ChessPiece;
  promotion?: PieceType;
  flags: string;
}

export function parseSquare(square: string): [number, number] {
  const file = square.charCodeAt(0) - 97; // 'a' = 0, 'b' = 1, etc.
  const rank = parseInt(square[1]) - 1; // '1' = 0, '2' = 1, etc.
  return [file, rank];
}

export function squareToString(file: number, rank: number): string {
  return String.fromCharCode(97 + file) + (rank + 1);
}

export function isValidSquare(square: string): boolean {
  return /^[a-h][1-8]$/.test(square);
}

export function getOppositeColor(color: PieceColor): PieceColor {
  return color === 'w' ? 'b' : 'w';
}

export function getPieceValue(piece: PieceType): number {
  const values: { [key in PieceType]: number } = {
    p: 1,
    n: 3,
    b: 3,
    r: 5,
    q: 9,
    k: 0,
  };
  return values[piece];
}