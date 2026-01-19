import { UserWithOwnerAndAdmin } from "../../../repository/type/user/userWithOwnerAndAdmin";

export type LoginResult = {
  status: "SUCCESS";
  user: UserWithOwnerAndAdmin;
  accessToken: string;
  refreshToken: string;
};
