import * as React from "react";
import Board from "react-trello";

import { JIRACommandBar } from "../components";

import { ipcRenderer, clipboard, shell } from "electron";
import { LoadingIndicator } from "../components/loading-indicator";
import { fillScreen } from "../style";
import { BoardComponent, BoardAssignee } from "../../common/interfaces";

interface BoardState {
  host: string;
  data: any;
  isLoading: boolean;
  components: BoardComponent[];
  assignees: BoardAssignee[];
  selectedComp: string;
  selectedAssignee: string;
}

export class BoardPage extends React.Component<{}, BoardState> {
  constructor(props) {
    super(props);
    this.state = {
      selectedComp: null,
      selectedAssignee: null,
      components: [],
      assignees: [],
      isLoading: true,
      host: "",
      data: {
        lanes: [
          {
            id: "lane1",
            title: "Todo",
            label: "",
            cards: []
          },
          {
            id: "lane2",
            title: "In Progress",
            label: "",
            cards: []
          },
          {
            id: "lane3",
            title: "Completed",
            label: "",
            cards: []
          }
        ]
      }
    };
  }

  handleCardClick(cardId, metadata, laneId): any {
    clipboard.writeText(cardId);
    shell.openExternal(`${this.state.host}/browse/${cardId}`);
  }

  componentDidMount() {
    this.refreshBoard();
    ipcRenderer.send("request-components");
    ipcRenderer.send("request-assignee");

    ipcRenderer.on("response-issue", (event, payload) => {
      const { data, host } = payload;
      if (data !== undefined) {
        this.setState({ data, host, isLoading: false });
      }
    });

    ipcRenderer.on("response-components", (event, payload) => {
      const { components } = payload;
      if (components !== undefined) {
        const allComp = { id: "all-component", name: "All Component" };
        components.push(allComp);
        this.setState({ components });
      }
    });

    ipcRenderer.on("response-assignee", (event, payload) => {
      const { assignees } = payload;
      if (assignees !== undefined) {
        const allAssignee = {
          key: "all-assignee",
          displayName: "All Assignee"
        };
        assignees.push(allAssignee);
        this.setState({ assignees });
      }
    });
  }

  refreshBoard() {
    this.setState({ isLoading: true });
    console.log({
      assignee: this.state.selectedAssignee,
      component: this.state.selectedComp
    });
    ipcRenderer.send("request-issue", {
      assignee: this.state.selectedAssignee,
      component: this.state.selectedComp
    });
  }

  render() {
    return (
      <div style={fillScreen}>
        <JIRACommandBar
          componentsItem={this.state.components}
          assigneeItem={this.state.assignees}
          isHidden={this.state.isLoading}
          onLogout={() => {}}
          onRefresh={() => {
            this.setState(
              {
                selectedAssignee: null,
                selectedComp: null
              },
              () => {
                this.refreshBoard();
              }
            );
          }}
          onComponentsItemClick={(id, name) => {
            console.log(`${id}: ${name}`);
            this.setState(
              { selectedComp: id !== "all-comp" ? name : null },
              () => {
                this.refreshBoard();
              }
            );
          }}
          onAssigneeItemClick={(idx, key) => {
            console.log(`${idx}: ${key}`);
            this.setState(
              { selectedAssignee: key !== "all-assignee" ? key : null },
              () => {
                this.refreshBoard();
              }
            );
          }}
        />
        {this.state.isLoading ? (
          <LoadingIndicator />
        ) : (
          <Board
            data={this.state.data}
            draggable={false}
            onCardClick={(cardId, metadata, laneId) =>
              this.handleCardClick(cardId, metadata, laneId)
            }
          />
        )}
      </div>
    );
  }
}
