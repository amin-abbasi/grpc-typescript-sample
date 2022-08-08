import { ServerUnaryCall, sendUnaryData, UntypedServiceImplementation } from '@grpc/grpc-js'
import {
  CreateRequest,
  CreateResponse,
  ListRequest,
  ListResponse,
  GetRequest,
  GetResponse,
  RemoveRequest,
  RemoveResponse
} from '../configs/user_pr'
import * as User from '../models/user'

const implementation: UntypedServiceImplementation = {

  async	create(call: ServerUnaryCall<CreateRequest, CreateResponse>, callback: sendUnaryData<CreateResponse>): Promise<void> {
    const user = await User.create(call.request as any)
		callback(null, user)
	},

	async list(_call: ServerUnaryCall<ListRequest, ListResponse>, callback: sendUnaryData<ListResponse>): Promise<void> {
    const list = await User.listAll()
		callback(null, list as any)
	},

	async get(call: ServerUnaryCall<GetRequest, GetResponse>, callback: sendUnaryData<GetResponse>): Promise<void> {
    const user = await User.getByID(call.request.user_id)
    callback(null, user as any)
	},

	async remove(call: ServerUnaryCall<RemoveRequest, RemoveResponse>, callback: sendUnaryData<RemoveResponse>): Promise<void> {
    const result = await User.archive(call.request.user_id)
    callback(null, result as any)
	},
}

export default implementation
