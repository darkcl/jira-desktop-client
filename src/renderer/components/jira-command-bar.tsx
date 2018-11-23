import * as React from "react";
import { CommandBar, ICommandBarItemProps } from "office-ui-fabric-react";
import { BoardComponent, BoardAssignee } from "../../common/interfaces";

interface IJIRACommandBarProps {
  isHidden: boolean;
  componentsItem: BoardComponent[];
  assigneeItem: BoardAssignee[];
  onComponentsItemClick: (id: string, name: string) => any;
  onAssigneeItemClick: (idx: number, key: string) => any;
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
          items: this.props.componentsItem.map(val => {
            return {
              key: val.id,
              name: val.name,
              onClick: () => this.props.onComponentsItemClick(val.id, val.name)
            };
          })
        }
      },
      {
        key: "assignee",
        name: "Assignee",
        subMenuProps: {
          items: this.props.assigneeItem.map(val => {
            return {
              key: val.key,
              name: val.displayName,
              onClick: () =>
                this.props.onAssigneeItemClick(
                  this.props.assigneeItem.indexOf(
                    this.props.assigneeItem.find(
                      assignee => assignee.key === val.key
                    )
                  ),
                  val.key
                )
            };
          })
        }
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
