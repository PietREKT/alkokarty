export class CreateRoomDto {
  maxPlayers : number;
  hostToken : string;
  password : string | null;


  constructor(maxPlayers: number, hostToken: string, password: string | null) {
    this.maxPlayers = maxPlayers;
    this.hostToken = hostToken;
    this.password = password;
  }
}
