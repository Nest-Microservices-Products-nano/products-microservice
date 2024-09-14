import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('ProductService');

  onModuleInit() {
    this.$connect();
    this.logger.log('DATABASE CONNECTED');
  }
  create(createProductDto: CreateProductDto) {
    return this.product.create({ data: createProductDto });
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    const totatlPage = await this.product.count({ where: { available: true } });
    const lastPage = Math.ceil(totatlPage / limit);
    return {
      data: await this.product.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: {
          available: true,
        },
      }),
      meta: {
        total: totatlPage,
        page: page,
        lastPage: lastPage,
      },
    };
  }

  async findOne(id: number) {
    const product = await this.product.findFirst({
      where: { id, available: true },
    });
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

    return await this.product.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    const product = await this.findOne(id);
    if (!product) {
      throw new RpcException(`Product with id: #${id} Not Found`);
    }
    return await this.product.update({
      where: { id },
      data: {
        available: false,
      },
    });
  }
  async validateProducts(ids: number[]) {
    ids = Array.from(new Set(ids));
    const products = await this.product.findMany({
      where: { id: { in: ids } },
    });
    if(products.length !== ids.length) {
      throw new RpcException({
        message: `Some Product with Not Found`,
        status: HttpStatus.BAD_REQUEST,
      });
    }

    return products;
  }
}
