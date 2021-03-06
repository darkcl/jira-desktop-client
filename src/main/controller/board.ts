import { JIRA, JIRARequest } from "../utils/jira-client";
import {
  BoardStatus,
  BoardResponse,
  BoardCard,
  BoardComponent,
  BoardAssignee
} from "../../common/interfaces";
import { LoginToken } from "../utils/keychain";
import { JIRAQuery } from "../utils/jira-client/JIRAQuery";

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

  private async getListByStatus(
    status: BoardStatus,
    assignee?: string,
    component?: string
  ): Promise<BoardCard[]> {
    const jql = new JIRAQuery();
    const query = jql
      .and()
      .currentSprint()
      .status(status);

    if (assignee !== null && assignee !== undefined) {
      query.assignee(assignee);
    }

    if (component !== null && component !== undefined) {
      query.component(component);
    }

    const req = JIRARequest.listBoardIssue(
      this.boardId,
      ["summary", "description", "status"],
      jql.build()
    );
    const res = await this.jira.sendRequest(req);

    const cards: BoardCard[] = res.issues.map(val => {
      return <BoardCard>{
        id: val.key,
        title: val.key,
        description: `${val.fields.summary}\n${val.fields.description}`,
        label: status
      };
    });
    return cards;
  }

  async getAssignee(): Promise<BoardAssignee[]> {
    const req = JIRARequest.listBoardIssue(
      this.boardId,
      ["assignee"],
      `sprint in openSprints()`
    );
    const res = await this.jira.sendRequest(req);
    try {
      const assigneeMap: { [key: string]: BoardAssignee } = res.issues
        .map(val => val.fields.assignee)
        .filter(val => val !== undefined && val !== null)
        .reduce((map, assignee) => {
          map[assignee.key] = <BoardAssignee>{
            key: assignee.key,
            name: assignee.name,
            avatarUrls: assignee.avatarUrls,
            displayName: assignee.displayName
          };
          return map;
        }, {});
      const result: BoardAssignee[] = Object.keys(assigneeMap).map(
        val => assigneeMap[val]
      );
      return result;
    } catch (e) {
      return [];
    }
  }

  async getComponents(): Promise<BoardComponent[]> {
    const req = JIRARequest.listBoardIssue(
      this.boardId,
      ["components"],
      `sprint in openSprints()`
    );
    const res = await this.jira.sendRequest(req);
    const compMap: { [key: string]: BoardComponent } = {};
    try {
      res.issues.forEach(val =>
        val.fields.components.forEach(
          comp =>
            (compMap[comp.id] = <BoardComponent>{
              id: comp.id,
              name: comp.name
            })
        )
      );
      const result: BoardComponent[] = Object.keys(compMap).map(
        val => compMap[val]
      );
      return result;
    } catch (e) {
      return [];
    }
  }

  async getTickets(
    component?: string,
    assignee?: string
  ): Promise<BoardResponse> {
    const todoList = await this.getListByStatus(
      BoardStatus.ToDo,
      assignee,
      component
    );
    const inProgressList = await this.getListByStatus(
      BoardStatus.InProgress,
      assignee,
      component
    );
    const doneList = await this.getListByStatus(
      BoardStatus.Done,
      assignee,
      component
    );

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
