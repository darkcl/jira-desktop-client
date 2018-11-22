import { JIRA, JIRARequest } from "../utils/jira-client";

import { SignInResponse } from "../interfaces";
import { KeychainManger } from "../utils/keychain";

export class SignInController {
  public async signIn(
    host: string,
    email: string,
    password: string
  ): Promise<SignInResponse> {
    try {
      const jira = new JIRA(host);
      const req = JIRARequest.createSession(email, password);
      const res = await jira.sendRequest(req);
      const keychainManager: KeychainManger = new KeychainManger(
        host,
        email,
        password
      );
      keychainManager.save();
      return <SignInResponse>{
        session: res.session.value
      };
    } catch (e) {
      console.log(e);
      return <SignInResponse>{
        error: e
      };
    }
  }
}
