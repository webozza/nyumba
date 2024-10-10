export default interface ILoginParams {
  email: string
  password: string
}
export interface ILoginResponse {
  user: {
    name: string
    email: string
    roles: [string]
  }
  token: string
}
