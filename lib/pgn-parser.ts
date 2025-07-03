export interface PGNGame {
  headers: { [key: string]: string };
  moves: string[];
  result: string;
}

export class PGNParser {
  static parse(pgn: string): PGNGame[] {
    const games: PGNGame[] = [];
    const gameStrings = pgn.split(/\n\s*\n(?=\[)/);

    for (const gameString of gameStrings) {
      if (gameString.trim()) {
        const game = this.parseGame(gameString);
        if (game) {
          games.push(game);
        }
      }
    }

    return games;
  }

  private static parseGame(gameString: string): PGNGame | null {
    const lines = gameString.split('\n');
    const headers: { [key: string]: string } = {};
    const moveLines: string[] = [];
    let inMoves = false;

    for (const line of lines) {
      const trimmedLine = line.trim();
      
      if (trimmedLine.startsWith('[') && trimmedLine.endsWith(']')) {
        // Parse header
        const match = trimmedLine.match(/\[(\w+)\s+"([^"]*)"\]/);
        if (match) {
          headers[match[1]] = match[2];
        }
      } else if (trimmedLine && !trimmedLine.startsWith('[')) {
        // Move line
        inMoves = true;
        moveLines.push(trimmedLine);
      }
    }

    if (!inMoves) return null;

    // Parse moves
    const moveText = moveLines.join(' ');
    const moves = this.parseMoves(moveText);
    const result = headers.Result || '*';

    return {
      headers,
      moves,
      result
    };
  }

  private static parseMoves(moveText: string): string[] {
    // Remove comments and variations
    let cleanText = moveText.replace(/\{[^}]*\}/g, '');
    cleanText = cleanText.replace(/\([^)]*\)/g, '');
    
    // Remove move numbers and result
    cleanText = cleanText.replace(/\d+\./g, '');
    cleanText = cleanText.replace(/\s*(1-0|0-1|1\/2-1\/2|\*)\s*$/, '');
    
    // Split into moves and filter empty strings
    const moves = cleanText.split(/\s+/).filter(move => 
      move && !move.match(/^\d+\./) && !move.match(/^(1-0|0-1|1\/2-1\/2|\*)$/)
    );

    return moves;
  }

  static stringify(game: PGNGame): string {
    let pgn = '';

    // Add headers
    for (const [key, value] of Object.entries(game.headers)) {
      pgn += `[${key} "${value}"]\n`;
    }

    pgn += '\n';

    // Add moves
    for (let i = 0; i < game.moves.length; i += 2) {
      const moveNumber = Math.floor(i / 2) + 1;
      pgn += `${moveNumber}.`;
      
      if (game.moves[i]) {
        pgn += ` ${game.moves[i]}`;
      }
      
      if (game.moves[i + 1]) {
        pgn += ` ${game.moves[i + 1]}`;
      }
      
      pgn += ' ';
    }

    pgn += game.result;

    return pgn;
  }
}