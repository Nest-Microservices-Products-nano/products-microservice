import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CounterDocument = HydratedDocument<Counter>;

@Schema({ collection: 'counters' })
export class Counter {
  @Prop({ type: String, required: true, unique: true })
  _id: string; // sequence name, e.g., 'productId'

  @Prop({ type: Number, required: true, default: 0 })
  seq: number;
}

export const CounterSchema = SchemaFactory.createForClass(Counter);
