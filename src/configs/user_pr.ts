export interface User {
  user_id: string
  email: string
  name: string
}

// Create new User
export interface CreateRequest {
  user: User
}
export interface CreateResponse {}

// List Users
export interface ListRequest {}
export interface ListResponse {
  user: User[]
}

// Get User
export interface GetResponse {
  user: User
}
export interface GetRequest {
  user_id: string
}

// Remove User
export interface RemoveRequest {
  user_id: string
}
export interface RemoveResponse {}
