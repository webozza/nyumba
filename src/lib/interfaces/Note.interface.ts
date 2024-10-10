export default interface INote {
  parentId: string
  _id?: string
  message?: string
  user?: string
}

export interface INoteResponse {
  _id: string
  message: string
  user: string
  date: Date
}

export interface IGetNote {
  _id: string
}
export interface IAddNoteReponse {
  _id: string
}
export interface IDeleteNoteParams {
  _id: string
}
