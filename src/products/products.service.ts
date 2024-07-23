import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common';

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
      throw new NotFoundException(`Product with id: #${id} Not Found`);
    }
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const {id:__, ...data}= updateProductDto;
    const product = await this.findOne(id);
    if (!product) {
      throw new NotFoundException(`Product with id: #${id} Not Found`);
    }

    return await this.product.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    try {
      const product = await this.findOne(id);
      if (!product) {
        throw new NotFoundException(`Product with id: #${id} Not Found`);
      }

      return await this.product.update({
        where: { id },
        data: {
          available: false,
        },
      });
    } catch (error) {
      throw new HttpException(
        `Ha ocurrido un error: ${error.message}`,
        HttpStatus.I_AM_A_TEAPOT,
      );
    }
  }
}
