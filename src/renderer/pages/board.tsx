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
}

export class BoardPage extends React.Component<{}, BoardState> {
  constructor(props) {
    super(props);
    this.state = {
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
    ipcRenderer.send("request-issue");
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
        this.setState({ components });
      }
    });

    ipcRenderer.on("response-assignee", (event, payload) => {
      const { assignees } = payload;
      if (assignees !== undefined) {
        this.setState({ assignees });
      }
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
            ipcRenderer.send("request-issue");
            this.setState({ isLoading: true });
          }}
          onComponentsItemClick={(id, name) => {
            console.log(`${id}: ${name}`);
          }}
          onAssigneeItemClick={(idx, key) => {
            console.log(`${idx}: ${key}`);
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
