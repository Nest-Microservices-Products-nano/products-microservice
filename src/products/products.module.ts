import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { AxiosAdapter } from '../common/adapters/axios.adapter';

@Module({
  imports: [HttpModule],
  controllers: [ProductsController],
  providers: [ProductsService, AxiosAdapter]
})
export class ProductsModule {}
