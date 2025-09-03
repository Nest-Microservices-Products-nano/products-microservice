import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { AxiosAdapter } from '../common/adapters/axios.adapter';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './schemas/product.schema';
import { Counter, CounterSchema } from './schemas/counter.schema';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: Counter.name, schema: CounterSchema },
    ]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService, AxiosAdapter]
})
export class ProductsModule {}
