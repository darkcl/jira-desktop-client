import * as React from "react";
import Board from "react-trello";

import { JIRACommandBar } from "../components";

import { ipcRenderer, clipboard, shell } from "electron";
import { LoadingIndicator } from "../components/loading-indicator";
import { fillContainer, fillScreen } from "../style";

interface BoardState {
  host: string;
  data: any;
  isLoad: boolean;
}

export class BoardPage extends React.Component<{}, BoardState> {
  constructor(props) {
    super(props);
    this.state = {
      isLoad: true,
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

    ipcRenderer.on("response-issue", (event, payload) => {
      const { data, host } = payload;
      if (data !== undefined) {
        this.setState({ data, host, isLoad: false });
      }
    });
  }

  render() {
    return (
      <div style={fillScreen}>
        <JIRACommandBar
          isHidden={this.state.isLoad}
          onRefresh={() => {
            ipcRenderer.send("request-issue");
            this.setState({ isLoad: true });
          }}
        />
        {this.state.isLoad ? (
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
