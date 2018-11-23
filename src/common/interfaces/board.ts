export enum BoardStatus {
  ToDo = "Open",
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

export interface BoardComponent {
  id: string;
  name: string;
}

export interface BoardAssignee {
  key: string;
  name: string;
  emailAddress: string;
  avatarUrls: { [key: string]: string };
  displayName: string;
}
