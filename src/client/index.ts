import grpc from '@grpc/grpc-js'
import protoLoader from '@grpc/proto-loader'

const protoPath = require('path').join(__dirname, '../..', 'proto')
const proto = protoLoader.loadSync(protoPath)

const { SERVER_HOST: host, SERVER_PORT: port } = config.env
const url = `${host}:${port}`

const client = new proto.users.UserService(url, grpc.credentials.createInsecure())

client.List({}, (error, response) => {
  if (!error) {
    console.log('Response : ', response)
  } else {
    console.log('Error:', error.message)
  }
})

client.get(
  {
    employee_id: 1,
  },
  (error, response) => {
    if (!error) {
      console.log('Response : ', response)
    } else {
      console.log('Error:', error.message)
    }
  }
)

client.remove(
  {
    employee_id: 1,
  },
  (error, response) => {
    if (!error) {
      console.log('Response : ', response)
    } else {
      console.log('Error:', error.message)
    }
  }
)

client.Insert(
  {
    employee_id: parseInt(Math.random() * 1000000),
    name: 'Amulya Kashyap',
    email: 'amulyakashyap09@gmail.com',
  },
  (error, response) => {
    if (!error) {
      console.log('Response : ', response)
    } else {
      console.log('Error:', error.message)
    }
  }
)
