import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true, collection: 'products' })
export class Product {
  @Prop({ type: Number, unique: true, index: true, required: true })
  id: number;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: Number, required: true, min: 0 })
  price: number;

  @Prop({ type: Boolean, default: true })
  available: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
