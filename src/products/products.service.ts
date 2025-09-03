import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './schemas/product.schema';
import { Counter } from './schemas/counter.schema';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductService');

  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<Product>,
    @InjectModel(Counter.name)
    private readonly counterModel: Model<Counter>,
  ) {}

  private async getNextSequence(seqName: string): Promise<number> {
    const updated = await this.counterModel.findByIdAndUpdate(
      seqName,
      { $inc: { seq: 1 } },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );
    return updated.seq;
  }

  async create(createProductDto: CreateProductDto) {
    const nextId = await this.getNextSequence('productId');
    const created = new this.productModel({
      id: nextId,
      name: createProductDto.name,
      price: createProductDto.price,
      available: true,
    });
    return await created.save();
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    const total = await this.productModel.countDocuments({ available: true });
    const lastPage = Math.ceil(total / limit);
    const baseQuery = this.productModel.find({ available: true });
    baseQuery.skip((page - 1) * limit);
    baseQuery.limit(limit);
    baseQuery.sort({ id: 1 });
    const data = await baseQuery.lean<Product[]>().exec();

    return {
      data,
      meta: {
        total,
        page: page,
        lastPage: lastPage,
      },
    };
  }

  async findOne(id: number) {
    const product = await this.productModel
      .findOne({ id, available: true })
      .lean<Product | null>()
      .exec();
    if (!product) {
      throw new RpcException({
        message: `Product with id: #${id} Not Found`,
        status: HttpStatus.BAD_REQUEST,
      });
    }
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const { id: __, ...data } = updateProductDto;
    const product = await this.findOne(id);
    if (!product) {
      throw new RpcException(`Product with id: #${id} Not Found`);
    }

    await this.productModel.updateOne({ id }, { $set: data });
    return await this.productModel
      .findOne({ id })
      .lean<Product | null>()
      .exec();
  }

  async remove(id: number) {
    const product = await this.findOne(id);
    if (!product) {
      throw new RpcException(`Product with id: #${id} Not Found`);
    }
    await this.productModel.updateOne(
      { id },
      { $set: { available: false } },
    );
    const removed = await this.productModel
      .findOne({ id })
      .lean<Product | null>()
      .exec();
    return removed;
  }
  async validateProducts(ids: number[]) {
    ids = Array.from(new Set(ids));
    const products = await this.productModel
      .find({ id: { $in: ids } })
      .lean<Product[]>()
      .exec();
    if(products.length !== ids.length) {
      throw new RpcException({
        message: `Some Product with Not Found`,
        status: HttpStatus.BAD_REQUEST,
      });
    }

    return products;
  }
}
