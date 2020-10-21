export class UserData {
  constructor(
    public username: string,
    // tslint:disable-next-line: variable-name
    private _clientToken: string,
    private tokenExpiry: Date
  ) {}

  get clientToken(): string {
    if (!this.tokenExpiry || new Date() > this.tokenExpiry) {
      return null;
    } else {
      return this._clientToken;
    }
  }
}
