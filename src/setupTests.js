const { prisma } = require('./prismaClient')

beforeEach(async () => {
  await prisma.$executeRaw(`SELECT  SETVAL(c.oid, 1)
    from pg_class c JOIN pg_namespace n 
    on n.oid = c.relnamespace 
    where c.relkind = 'S' and n.nspname = 'public'`)
})
