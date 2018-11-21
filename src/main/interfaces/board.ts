export enum BoardStatus {
  ToDo = "1",
  InProgress = "In Progress",
  Done = "Done"
}

export interface BoardCard {
  id: string;
  title: string;
  description: string;
  label: string;
  metadata: { [key: string]: string };
}

export interface BoardLane {
  id: string;
  title: string;
  label: string;
  cards: BoardCard[];
}

export interface BoardResponse {
  lanes: BoardLane[];
}
