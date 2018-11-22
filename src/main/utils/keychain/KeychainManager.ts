import * as keytar from "keytar";

export class LoginToken {
  public email: string;
  public password: string;
  public host: string;
}

export class KeychainManger {
  private applicationName = "jira-desktop-client";

  constructor(
    private host?: string,
    private email?: string,
    private password?: string
  ) {}

  public save() {
    keytar.setPassword(
      this.applicationName,
      `${this.host}::${this.email}`,
      this.password
    );
  }

  public async find(): Promise<LoginToken> {
    const result = await keytar.findCredentials(this.applicationName);

    if (result.length !== 0) {
      const token = new LoginToken();
      const sp = result[0].account.split("::");
      token.host = sp[0];
      token.email = sp[1];
      token.password = result[0].password;
      return token;
    } else {
      throw new Error("Token Not Found");
    }
  }
}
