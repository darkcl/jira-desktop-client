import * as keytar from "keytar";

export class KeychainManger {
  private applicationName = "jira-desktop-client";

  constructor(
    private host: string,
    private email?: string,
    private password?: string
  ) {}

  public save() {
    keytar.setPassword(
      `${this.applicationName}-${this.host}`,
      this.email,
      this.password
    );
  }

  public async find() {
    return await keytar.findPassword(`${this.applicationName}-${this.host}`);
  }
}
