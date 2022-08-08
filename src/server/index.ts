import path from 'path'
import grpc from '@grpc/grpc-js'
import protoLoader from '@grpc/proto-loader'

import implementation from './implementation'
import config from '../configs'

const { SERVER_HOST: host, SERVER_PORT: port } = config.env
const url = `${host}:${port}`

// Load proto
const PROTO_PATH = path.join(__dirname, '/proto/users/v1/user.proto')
console.log(PROTO_PATH)
const packageConfig: protoLoader.Options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
}
const packageDefinition: protoLoader.PackageDefinition = protoLoader.loadSync(PROTO_PATH, packageConfig)
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition).user as any

// Initiate Server
const server: grpc.Server = new grpc.Server()
server.addService(protoDescriptor.UserService.service, implementation)
server.bindAsync(url, grpc.ServerCredentials.createInsecure(), (err) => {
  if(err) {
    console.log('>>>> gRPC Server Error: ', err)
    process.exit()
  }
  server.start()
  console.log('>>>> gRPC Server is running on:', url)
})
