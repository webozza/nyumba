import nyumbaApi from '../data/axios'
import INote, { IDeleteNoteParams } from '../interfaces/Note.interface'

const getNote = async (id: string): Promise<INote> => {
  const data: INote = await nyumbaApi({
    method: 'get',
    url: `/note/${id}`,
  })
    
    .then((res: any) => {
      return res.data.note
    })
    .catch((reason) => {
      throw new Error(reason.response.data.message)
    })
  return data
}

const getNotes = async (): Promise<INote[]> => {
  const data: INote[] = await nyumbaApi({
    method: 'get',
    url: '/note',
  })
    
    .then((res: any) => {
      return res.data.notes
    })
    .catch((reason) => {
      throw new Error(reason.response.data.message)
    })
  return data
}

const addNote = async (note: INote): Promise<INote> => {
  const data: INote = await nyumbaApi({
    method: 'post',
    url: '/note',
    data: JSON.stringify(note),
  })
    
    .then((res: any) => {
      return res.data.note
    })
    .catch((reason) => {
      throw new Error(reason.response.data.message)
    })
  return data
}

const updateNote = async (note: INote): Promise<INote> => {
  const data: INote = await nyumbaApi({
    method: 'patch',
    url: `/note/${note._id}`,
    data: JSON.stringify(note),
  })
    
    .then((res: any) => {
      return res.data.note
    })
    .catch((reason) => {
      throw new Error(reason.response.data.message)
    })
  return data
}

const deleteNote = async (note: IDeleteNoteParams): Promise<unknown> => {
  await nyumbaApi({
    method: 'delete',
    url: `/note/${note._id}`,
    data: JSON.stringify(note),
  }).catch((reason) => {
    throw new Error(reason.response.data.message)
  })
  return { status: 'success' }
}

const NoteService = {
  getNote,
  getNotes,
  addNote,
  updateNote,
  deleteNote,
}

export default NoteService
