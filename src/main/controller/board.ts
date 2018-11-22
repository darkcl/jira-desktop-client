import { JIRA, JIRARequest } from "../utils/jira-client";
import { BoardStatus, BoardResponse, BoardCard } from "../interfaces";
import { LoginToken } from "../utils/keychain";

export class BoardController {
  private boardId = "1390";
  private jira: JIRA;
  constructor(private loginToken: LoginToken) {
    this.jira = new JIRA(
      this.loginToken.host,
      this.loginToken.email,
      this.loginToken.password
    );
  }

  private async getListByStatus(status: BoardStatus): Promise<BoardCard[]> {
    const req = JIRARequest.listBoardIssue(
      this.boardId,
      ["description", "status"],
      `sprint in openSprints() AND assignee=currentUser() AND status='${status}' AND component='Jobs API'`
    );
    const res = await this.jira.sendRequest(req);

    const cards: BoardCard[] = res.issues.map(val => {
      return <BoardCard>{
        id: val.key,
        title: val.key,
        description: val.fields.description,
        label: status
      };
    });
    return cards;
  }

  async getTickets(): Promise<BoardResponse> {
    const todoList = await this.getListByStatus(BoardStatus.ToDo);
    const inProgressList = await this.getListByStatus(BoardStatus.InProgress);
    const doneList = await this.getListByStatus(BoardStatus.Done);

    return <BoardResponse>{
      lanes: [
        {
          id: "to-do-board",
          title: "To Do",
          label: "",
          cards: todoList
        },
        {
          id: "in-progress-board",
          title: "In Progress",
          label: "",
          cards: inProgressList
        },
        {
          id: "done-board",
          title: "Done",
          label: "",
          cards: doneList
        }
      ]
    };
  }
}
