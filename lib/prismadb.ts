import { PrismaClient } from '@prisma/client'

declare global {
  var prisma: PrismaClient | undefined;
}

//This line creates a new instance of the PrismaClient named prismadb if globalThis.prisma is undefined. If globalThis.prisma already exists (has been previously defined), it uses that existing instance.
const prismadb = globalThis.prisma || new PrismaClient();
if(process.env.NODE_ENV !== 'production') globalThis.prisma = prismadb;

export default prismadb;
