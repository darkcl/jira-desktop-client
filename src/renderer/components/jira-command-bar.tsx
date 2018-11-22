import * as React from "react";
import { CommandBar, ICommandBarItemProps } from "office-ui-fabric-react";

interface IJIRACommandBarProps {
  isHidden: boolean;
  onRefresh: () => any;
  onLogout: () => any;
}

export class JIRACommandBar extends React.Component<IJIRACommandBarProps, {}> {
  // Data for CommandBar
  private getFarItems(): ICommandBarItemProps[] {
    return [
      {
        key: "logout",
        name: "Logout",
        onClick: () => this.props.onLogout()
      }
    ];
  }

  private getItems(): ICommandBarItemProps[] {
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
        onClick: () => this.props.onRefresh()
      }
    ];
  }

  render() {
    return this.props.isHidden ? null : (
      <CommandBar
        items={this.getItems()}
        farItems={this.getFarItems()}
        ariaLabel={"Use left and right arrow keys to navigate between commands"}
      />
    );
  }
}
