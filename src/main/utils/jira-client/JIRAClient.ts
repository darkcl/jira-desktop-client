import { JIRARequest } from "./JIRARequest";
import fetch, { Body } from "node-fetch";
import * as btoa from "btoa";

export class JIRA {
  constructor(
    private host: string,
    private email: string,
    private password: string
  ) {}

  public async sendRequest(req: JIRARequest) {
    const url = `${this.host}${req.pathString()}`;
    const res = await fetch(url, {
      headers: {
        Authorization: `Basic ${btoa(`${this.email}:${this.password}`)}`
      },
      method: req.method
    });
    const json = await res.json();
    return json;
  }
}
