interface IPayload {
    showModal?: boolean | null;
    userInfo?: IUserInfo;
}
interface IUserInfo {
    username: string | null;
    loggedIn: boolean;
}
declare const StateHook: () => {
    globalState: IPayload;
    actions: any;
};
export default StateHook;
