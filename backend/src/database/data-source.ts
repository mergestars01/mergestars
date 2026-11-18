import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import { buildTypeOrmOptions } from './typeorm.options';

ConfigModule.forRoot({ envFilePath: ['.env', '../.env'] });

// Migration CLI and application share certificate verification.
// Loading the CLI never synchronizes or runs migrations implicitly.
export default new DataSource({
  ...buildTypeOrmOptions(),
  synchronize: false,
  migrationsRun: false,
} as DataSourceOptions);
