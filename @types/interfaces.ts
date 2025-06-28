export interface IComments {
  username: string;
  createdAt: string;
  text: string;
  upvote_count: number;
  replies?: IReplies[];
}

export interface IReplies {
  username: string;
  createdAt: string;
  text: string;
  upvote_count: number;
}

export interface ICoords {
  latitude: number;
  longitude: number;
}
