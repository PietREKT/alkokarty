export class Room {
  code : string;
  maxPlayers : number;
  hostToken : string;
  playing : boolean;
  currentCard : string;
  players : [];
  playersVotedCount: number = 0;


  constructor(code: string, maxPlayers: number, hostToken: string, playing: boolean,
              currentCard : string, players: [], playersVotedCount : number) {
    this.code = code;
    this.maxPlayers = maxPlayers;
    this.hostToken = hostToken;
    this.playing = playing;
    this.currentCard = currentCard;
    this.players = players;
    this.playersVotedCount = playersVotedCount;
  }
}
