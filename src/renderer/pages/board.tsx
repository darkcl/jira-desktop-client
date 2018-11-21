import * as React from "react";
import Board from "react-trello";
import { ipcRenderer } from "electron";

interface BoardState {
  host: string;
  data: any;
  isLoad: boolean;
}

export class BoardPage extends React.Component<{}, BoardState> {
  constructor(props) {
    super(props);
    this.state = {
      isLoad: false,
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

  componentDidMount() {
    const { data, host } = ipcRenderer.sendSync("request-issue");

    if (data !== undefined) {
      this.setState({ data, host });
    }
  }

  render() {
    return (
      <Board
        data={this.state.data}
        draggable={false}
        onCardClick={(cardId, metadata, laneId) =>
          this.handleCardClick(cardId, metadata, laneId)
        }
      />
    );
  }
  handleCardClick(cardId, metadata, laneId): any {
    require("electron").shell.openExternal(
      `${this.state.host}/browse/${cardId}`
    );
  }
}
