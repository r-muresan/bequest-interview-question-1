export function savedToken(token: any) {
  localStorage.setItem("auth_token", token);
}
export function getToken() {
  return localStorage.getItem("auth_token");
}
