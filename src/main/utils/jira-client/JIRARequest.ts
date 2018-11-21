export class JIRARequest {
  public path: string = "";
  public method: string = "GET";
  public query: { [key: string]: string } = {};
  public header: { [key: string]: string } = {};
  public body: any = {};

  public pathString(): string {
    if (Object.keys(this.query).length !== 0) {
      return `${this.path}?${this.queryString()}`;
    }
    return this.path;
  }

  public queryString(): string {
    return Object.keys(this.query)
      .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(this.query[k])}`)
      .join("&");
  }

  static listBoardIssue(
    boardId: string,
    fields: string[] = [],
    jql: string = null
  ): JIRARequest {
    const result = new JIRARequest();

    result.path = `/rest/agile/latest/board/${boardId}/issue`;

    if (fields.length !== 0) {
      result.query["fields"] = fields.join(",");
    }

    if (jql !== null && jql !== undefined) {
      result.query["jql"] = jql;
    }

    return result;
  }
}
