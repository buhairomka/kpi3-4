import { Module } from '@nestjs/common';
import { Supplier1,Supplier2 } from './app.controller';
import { DbSingletonService } from '../../app/src/dbsingleton/dbsingleton.service';
import { FirstSupplierService } from './firstsupplier.service';
import { SecondSupplierService } from './secondsupplier.service';

@Module({
  imports: [],
  controllers: [Supplier1,Supplier2],
  providers: [DbSingletonService, FirstSupplierService, SecondSupplierService],
})
export class AppModule {}
