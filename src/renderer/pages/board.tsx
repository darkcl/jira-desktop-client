import * as React from "react";
import Board from "react-trello";
import {
  CommandBar,
  Spinner,
  Label,
  SpinnerSize
} from "office-ui-fabric-react";

import { ipcRenderer, clipboard, shell } from "electron";

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
    ipcRenderer.send("request-issue");

    ipcRenderer.on("response-issue", (event, payload) => {
      const { data, host } = payload;
      if (data !== undefined) {
        this.setState({ data, host, isLoad: true });
      }
    });
  }

  // Data for CommandBar
  private getItems = () => {
    return [
      {
        key: "components",
        name: "Components",
        cacheKey: "myCacheKey",
        subMenuProps: {
          items: [
            {
              key: "jobs-api",
              name: "Jobs API"
            },
            {
              key: "jobs-recruiter-web",
              name: "Jobs Recruiter Web"
            },
            {
              key: "jobs-web",
              name: "Jobs Web"
            },
            {
              key: "jobs-ios",
              name: "Jobs iOS"
            },
            {
              key: "jobs-aos",
              name: "Jobs Android"
            }
          ]
        }
      },
      {
        key: "assignee",
        name: "Assignee"
      },
      {
        key: "refresh",
        name: "Refresh",
        onClick: () => console.log("Refresh")
      }
    ];
  };

  render() {
    return (
      <div>
        <CommandBar
          items={this.getItems()}
          ariaLabel={
            "Use left and right arrow keys to navigate between commands"
          }
        />
        {this.state.isLoad && (
          <Board
            data={this.state.data}
            draggable={false}
            onCardClick={(cardId, metadata, laneId) =>
              this.handleCardClick(cardId, metadata, laneId)
            }
          />
        )}
        {!this.state.isLoad && (
          <div>
            <Label />
            <Spinner
              size={SpinnerSize.large}
              label="Seriously, it is still loading..."
              ariaLive="assertive"
            />
          </div>
        )}
      </div>
    );
  }
  handleCardClick(cardId, metadata, laneId): any {
    clipboard.writeText(cardId);
    shell.openExternal(`${this.state.host}/browse/${cardId}`);
  }
}
