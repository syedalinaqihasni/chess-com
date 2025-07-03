"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface GameContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const GameContext = createContext<GameContextType>({
  socket: null,
  isConnected: false,
});

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // For demo purposes, we'll simulate a socket connection
    // In production, you'd connect to your actual socket server
    const mockSocket = {
      emit: (event: string, data: any) => {
        console.log('Socket emit:', event, data);
      },
      on: (event: string, callback: Function) => {
        console.log('Socket on:', event);
      },
      off: (event: string, callback?: Function) => {
        console.log('Socket off:', event);
      },
      disconnect: () => {
        console.log('Socket disconnect');
      }
    } as any;

    setSocket(mockSocket);
    setIsConnected(true);

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  return (
    <GameContext.Provider value={{ socket, isConnected }}>
      {children}
    </GameContext.Provider>
  );
}