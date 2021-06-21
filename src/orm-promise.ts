import { MikroORM } from '@mikro-orm/core'
import { TsMorphMetadataProvider } from '@mikro-orm/reflection'

export const ormPromise = MikroORM.init({
  entities: ['./dist/entities/**/*.js'],
  entitiesTs: ['./src/entities/**/*.ts'],
  metadataProvider: TsMorphMetadataProvider,
  dbName: 'fiat-import-worker',
  type: 'postgresql',
  port: 6432,
  user: 'postgres',
  password: 'postgres'
})
