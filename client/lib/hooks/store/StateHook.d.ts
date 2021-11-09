interface IPayload {
    showModal?: boolean | null;
}
declare const StateHook: () => {
    globalState: IPayload;
    actions: any;
};
export default StateHook;
