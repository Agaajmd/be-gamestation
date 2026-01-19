import {prisma} from "../database"

export const OwnerRepository = {
  // Find owner by ID
  findByUserId(userId: bigint) {
    return prisma.owner.findUnique({where: {userId}})
  },
}