export class UserData {
  constructor(
    public username: string,
    private _token: string,
    private tokenExpiry: Date
  ) {}

  get token(): string {
    if (!this.tokenExpiry || new Date() > this.tokenExpiry) {
      return null;
    } else {
      return this._token;
    }
  }
}
