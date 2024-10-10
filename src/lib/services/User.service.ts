import { IDeleteUserParams } from './../interfaces/User.interface'
import nyumbaApi from '../data/axios'
import IUser, {
  ICreateUserParams,
  IUpdateUserParams,
  IUpdateUserPasswordParams,
} from '../interfaces/User.interface'

const getUsers = async (): Promise<IUser[]> => {
  const data: IUser[] = await nyumbaApi({
    method: 'get',
    url: '/user',
  })
    
    .then((res: any) => {
      return res.data.users
    })
    .catch((reason) => {
      throw new Error(reason.response.data.message)
    })
  return data
}

const addUser = async (user: ICreateUserParams): Promise<IUser> => {
  const data: IUser = await nyumbaApi({
    method: 'post',
    url: '/user',
    data: JSON.stringify(user),
  })
    
    .then((res: any) => {
      return res.data.user
    })
    .catch((reason) => {
      throw new Error(reason.response.data.message)
    })
  return data
}

const updateUser = async (user: IUpdateUserParams): Promise<IUser> => {
  const data: IUser = await nyumbaApi({
    method: 'patch',
    url: `/user/${user._id}`,
    data: JSON.stringify(user),
  })
    
    .then((res: any) => {
      return res.data.user
    })
    .catch((reason) => {
      throw new Error(reason.response.data.message)
    })
  return data
}

const resetPassword = async (
  user: IUpdateUserPasswordParams,
): Promise<IUser> => {
  const data: IUser = await nyumbaApi({
    method: 'post',
    url: `/user/${user._id}/password`,
    data: JSON.stringify(user),
  })
    
    .then((res: any) => {
      return res.data.user
    })
    .catch((reason) => {
      throw new Error(reason.response.data.message)
    })
  return data
}

const deleteUser = async (user: IDeleteUserParams): Promise<unknown> => {
  await nyumbaApi({
    method: 'delete',
    url: `/user/${user._id}`,
    data: JSON.stringify(user),
  }).catch((reason) => {
    throw new Error(reason.response.data.message)
  })
  return { status: 'success' }
}

const UserService = {
  getUsers,
  addUser,
  updateUser,
  resetPassword,
  deleteUser,
}

export default UserService
