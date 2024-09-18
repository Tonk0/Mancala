export type User = {
  socketId: string
};
export type Room = {
  id: string
  name: string
  users: User[],
  currentPlayerId: string,
  currentPlayerIndex: number
};
