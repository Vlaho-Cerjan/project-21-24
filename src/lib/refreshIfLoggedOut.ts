export function RefreshIfLoggedOut(err: string) {
    if(err === "invalid_user_token") location.reload();
}