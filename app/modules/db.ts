import { Prisma, PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient().$extends({
    model: {
      $allModels: {
        async exists<T>(
          this: T,
          where: Prisma.Args<T, 'findFirst'>['where']
        ): Promise<boolean> {
          // Get the current model at runtime
          const context = Prisma.getExtensionContext(this)
  
          const result = await (context as any).findFirst({ where })
          return result !== null
        },
      },
    },
  })
}

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

const db = globalThis.prismaGlobal ?? prismaClientSingleton()

export default db

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = db