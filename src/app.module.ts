import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { MongooseModule } from '@nestjs/mongoose';
import { envs } from './config/envs';

@Module({
  imports: [
    MongooseModule.forRoot(envs.mongoUri),
    ProductsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
