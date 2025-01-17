import { Socket, io } from "socket.io-client";

class GameSocketService {
  private socket: Socket | null = null;
  private static instance: GameSocketService;
  private currentGameId: string | null = null;
  private currentPlayerId: string | null = null;

  private constructor() {}

  static getInstance(): GameSocketService {
    if (!GameSocketService.instance) {
      GameSocketService.instance = new GameSocketService();
    }
    return GameSocketService.instance;
  }

  connect(apiUrl: string) {
    if (!this.socket) {
      this.socket = io(apiUrl);
    }
    return this.socket;
  }

  setCurrentGame(gameId: string, playerId: string) {
    this.currentGameId = gameId;
    this.currentPlayerId = playerId;
  }

  cleanDisconnect() {
    if (this.socket) {
      // Only remove game-specific listeners, keep connection alive
      this.socket.removeAllListeners("playerJoined");
      this.socket.removeAllListeners("playerLeft");
      this.socket.removeAllListeners("gameStarted");
      this.socket.removeAllListeners("playerKicked");
      // Don't set socket to null
    }
  }

  disconnect() {
    if (this.socket) {
      if (this.currentGameId && this.currentPlayerId) {
        // Explicitly leave game before disconnecting
        this.socket.emit("leaveGame", {
          playerId: this.currentPlayerId,
          gameId: this.currentGameId,
        });
      }
      this.socket.disconnect();
      this.socket = null;
      this.currentGameId = null;
      this.currentPlayerId = null;
    }
  }

  joinGame(playerId: string, gameId: string) {
    this.socket?.emit("joinGame", { playerId, gameId });
  }

  leaveGame(playerId: string, gameId: string) {
    this.socket?.emit("leaveGame", { playerId, gameId });
  }

  startGame(gameId: string) {
    this.socket?.emit("startGame", { gameId });
  }

  kickPlayer(kickedPlayerId: string, gameId: string) {
    this.socket?.emit("kickPlayer", { kickedPlayerId, gameId });
  }

  onPlayerJoined(callback: (data: any) => void) {
    this.socket?.on("playerJoined", callback);
  }

  onPlayerLeft(callback: (data: any) => void) {
    this.socket?.on("playerLeft", callback);
  }

  onGameStarted(callback: (data: any) => void) {
    this.socket?.on("gameStarted", callback);
  }

  onPlayerKicked(callback: (data: any) => void) {
    this.socket?.on("playerKicked", callback);
  }

  onCreateComplete(callback: (data: any) => void) {
    this.socket?.on("createComplete", callback);
  }

  onMovePlayed(callback: (data: any) => void) {
    this.socket?.on("movePlayed", callback);
  }

  removeAllListeners() {
    if (this.socket) {
      this.socket.removeAllListeners();
    }
  }

  getSocket() {
    return this.socket;
  }
}

export default GameSocketService;
