enum JIRAConstant {
  CurrentSprint = "openSprints()",
  CurrentUser = "currentUser()"
}

enum JIRAOperand {
  And = "AND",
  Or = "OR",
  In = "in",
  Equal = "="
}

class JIRAQueryComponent {
  field?: string;
  operand: string;
  value?: string;
  childQuery: JIRAQueryComponent[] = [];

  public currentSprint(): JIRAQueryComponent {
    const query = new JIRAQueryComponent();
    query.operand = JIRAOperand.In;
    query.field = "sprint";
    query.value = JIRAConstant.CurrentSprint;
    this.childQuery.push(query);
    return this;
  }

  public sprint(sprintName: string): JIRAQueryComponent {
    const query = new JIRAQueryComponent();
    query.operand = JIRAOperand.In;
    query.field = "sprint";
    query.value = `'${sprintName}'`;
    this.childQuery.push(query);
    return this;
  }

  public me(): JIRAQueryComponent {
    const query = new JIRAQueryComponent();
    query.operand = JIRAOperand.Equal;
    query.field = "assignee";
    query.value = JIRAConstant.CurrentUser;
    this.childQuery.push(query);
    return this;
  }

  public assignee(userKey: string): JIRAQueryComponent {
    const query = new JIRAQueryComponent();
    query.operand = JIRAOperand.Equal;
    query.field = "assignee";
    query.value = `'${userKey}'`;
    this.childQuery.push(query);
    return this;
  }

  public component(component: string): JIRAQueryComponent {
    const query = new JIRAQueryComponent();
    query.operand = JIRAOperand.Equal;
    query.field = "component";
    query.value = `'${component}'`;
    this.childQuery.push(query);
    return this;
  }

  public status(status: string): JIRAQueryComponent {
    const query = new JIRAQueryComponent();
    query.operand = JIRAOperand.Equal;
    query.field = "status";
    query.value = `'${status}'`;
    this.childQuery.push(query);
    return this;
  }

  public build(): string {
    return this.childQuery
      .map(val => `${val.field} ${val.operand} ${val.value}`)
      .join(` ${this.operand} `);
  }
}

export class JIRAQuery {
  private query: JIRAQueryComponent = new JIRAQueryComponent();

  public and(): JIRAQueryComponent {
    this.query.operand = JIRAOperand.And;
    return this.query;
  }

  public build(): string {
    return this.query.build();
  }
}
