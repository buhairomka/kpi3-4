import { Module, CacheModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { CoFService } from './cofservice/cofservice.service';
import { QueryBuilderService } from './querybuilder/querybuilder.service';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { EmployeeResolver } from "./app.resolver";

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      ttl: 86400000,
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'schema.gql'),
    })
  ],
  controllers: [AppController],
  providers: [CoFService, QueryBuilderService,EmployeeResolver],
})
export class AppModule {}
