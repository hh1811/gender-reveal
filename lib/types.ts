export type VoteChoice = "nino" | "nina";

export type Reveal = "none" | VoteChoice;

export interface Vote {
  id: string;
  name: string;
  vote: VoteChoice;
  message: string | null;
  photoUrl: string | null;
  createdAt: string;
}

export interface EventSettings {
  reveal: Reveal;
  parentNames: string;
}

export interface VotesPayload {
  votes: Vote[];
  settings: EventSettings;
}
