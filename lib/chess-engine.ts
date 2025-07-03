import { Chess } from 'chess.js';

export class ChessEngine {
  private game: Chess;
  private depth: number;

  constructor(fen?: string, depth: number = 3) {
    this.game = new Chess(fen);
    this.depth = depth;
  }

  // Simple evaluation function
  private evaluatePosition(): number {
    const pieceValues: { [key: string]: number } = {
      'p': 1, 'n': 3, 'b': 3, 'r': 5, 'q': 9, 'k': 0,
      'P': -1, 'N': -3, 'B': -3, 'R': -5, 'Q': -9, 'K': 0
    };

    let score = 0;
    const board = this.game.board();

    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const piece = board[i][j];
        if (piece) {
          score += pieceValues[piece.type] * (piece.color === 'w' ? 1 : -1);
        }
      }
    }

    return score;
  }

  // Minimax algorithm with alpha-beta pruning
  private minimax(depth: number, alpha: number, beta: number, maximizing: boolean): number {
    if (depth === 0 || this.game.isGameOver()) {
      return this.evaluatePosition();
    }

    const moves = this.game.moves();

    if (maximizing) {
      let maxEval = -Infinity;
      for (const move of moves) {
        this.game.move(move);
        const eval = this.minimax(depth - 1, alpha, beta, false);
        this.game.undo();
        maxEval = Math.max(maxEval, eval);
        alpha = Math.max(alpha, eval);
        if (beta <= alpha) break;
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (const move of moves) {
        this.game.move(move);
        const eval = this.minimax(depth - 1, alpha, beta, true);
        this.game.undo();
        minEval = Math.min(minEval, eval);
        beta = Math.min(beta, eval);
        if (beta <= alpha) break;
      }
      return minEval;
    }
  }

  // Get best move for current position
  getBestMove(): string | null {
    const moves = this.game.moves();
    if (moves.length === 0) return null;

    let bestMove = moves[0];
    let bestValue = -Infinity;

    for (const move of moves) {
      this.game.move(move);
      const value = this.minimax(this.depth - 1, -Infinity, Infinity, false);
      this.game.undo();

      if (value > bestValue) {
        bestValue = value;
        bestMove = move;
      }
    }

    return bestMove;
  }

  // Analyze position and return evaluation
  analyzePosition(): {
    evaluation: number;
    bestMove: string | null;
    principalVariation: string[];
  } {
    const evaluation = this.evaluatePosition();
    const bestMove = this.getBestMove();
    
    // Simple principal variation (just the best move for now)
    const principalVariation = bestMove ? [bestMove] : [];

    return {
      evaluation,
      bestMove,
      principalVariation
    };
  }
}