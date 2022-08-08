import mongoose, { Schema, Document } from 'mongoose'
import Boom   from '@hapi/boom'
import config from '../configs'

export interface IUser extends Document {
  name : string
  age? : number
  createdAt?: number
  updatedAt?: number
  deletedAt?: number
}

export interface IUserUpdate {
  name? : IUser['name']
  age?  : IUser['age']
}

// Add your own attributes in schema
const schema = new Schema({
  name: { type: Schema.Types.String, require: true, trim: true },
  age:  { type: Schema.Types.Number, default: 18 },
  createdAt: { type: Schema.Types.Number },
  updatedAt: { type: Schema.Types.Number },
  deletedAt: { type: Schema.Types.Number, default: 0 },
})

// Choose your own model name
const User = mongoose.model<IUser>('User', schema)

export async function create(data: IUser): Promise<IUser> {
  const userData = {
    ...data,
    createdAt: Date.now()
  }
  return await User.create(userData)
}

export interface IQueryData {
  page: number
  size: number
  sort: string
  deletedAt: number
  [key: string]: any
}

interface ISort {
  [key: string]: mongoose.SortOrder
}

export async function listAll(): Promise<IUser[]> {
  return await User.find({ deletedAt: 0 })
}

export async function list(queryData: IQueryData): Promise<{ total: number, list: IUser[] }> {
  const { page, size, sort, ...query } = queryData
  const setSize: number = (size > config.maxPageSizeLimit) ? config.maxPageSizeLimit : size
  const sortBy: ISort = (sort && sort !== config.sortTypes.date) ? { [config.sortTypes[sort]]: 1 } : { createdAt: -1 }

  // if(query.dateRange) {
  //   query.createdAt = {}
  //   const { from, to }: { from: number, to: number } = query.dateRange
  //   if(from) query.createdAt['$gte'] = from
  //   if(to)   query.createdAt['$lte'] = to
  //   delete query.dateRange
  // }
  if(query.name) query.name = { '$regex': query.name, '$options': 'i' }
  query.deletedAt = 0

  const total: number = await User.countDocuments(query)
  const list: IUser[] = await User.find(query).limit(setSize).skip((page - 1) * setSize).sort(sortBy)

  return { total, list }
}

export async function getByID(userId: string): Promise<IUser> {
  const user: IUser | null = await User.findById(userId)
  if(!user || user.deletedAt !== 0) throw Boom.notFound('User not found.')
  return user
}

export async function updateById(userId: string, data: IUserUpdate): Promise<IUser> {
  const user: IUser = await getByID(userId)
  const updatedUser: IUser = { ...user, ...data } as IUser
  return await User.findByIdAndUpdate(userId, updatedUser) as IUser
}

export async function archive(userId: string): Promise<IUser> {
  const user: IUser = await getByID(userId)
  return await User.findByIdAndUpdate(user._id, { deletedAt: Date.now() }) as IUser
}

export async function remove(userId: string): Promise<{ ok?: number, n?: number } & { deletedCount?: number }> {
  return await User.deleteOne({ _id: userId })
}

export async function restore(userId: string): Promise<IUser> {
  await getByID(userId)
  return await User.findByIdAndUpdate(userId, { deletedAt: 0 }) as IUser
}
