import { JIRARequest } from "./JIRARequest";
import fetch, { Body, RequestInit } from "node-fetch";
import * as btoa from "btoa";

export class JIRA {
  constructor(
    private host: string,
    private email?: string,
    private password?: string
  ) {}

  public async sendRequest(req: JIRARequest) {
    const url = `${this.host}${req.pathString()}`;

    const reqInit: RequestInit = {
      method: req.method
    };

    if (req.isLoginRequired) {
      reqInit.headers = {
        "Content-Type": "application/json",
        Authorization: `Basic ${btoa(`${this.email}:${this.password}`)}`
      };
    } else {
      reqInit.headers = {
        "Content-Type": "application/json"
      };
    }

    if (req.body !== null && req.body !== undefined) {
      reqInit.body = JSON.stringify(req.body);
    }

    const res = await fetch(url, reqInit);
    if (res.status >= 400) {
      const buffer = await res.buffer();
      throw new Error(buffer.toString());
    }

    const json = await res.json();
    return json;
  }
}
