 import { User } from "src/modules/users/schmas/users.schema";
import { MongoDbId } from "../DTOS/mongodb-Id.dto";
 
 
export type TokenData = {
  token: string;
  secret: string;
};
export type Token = {
  payload: Payload;
  secret: string;
  expiresIn: string;
};

 
export type Payload = {
  user:User

};

export type Secrets={
  authSecret:string
   refreshSecret?:string
}