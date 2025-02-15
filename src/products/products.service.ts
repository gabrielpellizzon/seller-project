import { Inject, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from 'src/schemas/product.schema';
import { Model } from 'mongoose';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class ProductsService {
  private readonly CACHE_TTL = 30 * 60 * 1000;

  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    @Inject(CACHE_MANAGER)
    private cacheService: Cache,
  ) {}

  async createProduct(
    createProductDto: CreateProductDto,
  ): Promise<ProductDocument> {
    const product = new this.productModel(createProductDto);

    return product.save();
  }

  async findAllProducts(): Promise<ProductDocument[]> {
    return this.productModel.find();
  }

  async findOneProduct(id: string): Promise<ProductDocument> {
    return this.productModel.findById(id);
  }

  async updateProduct(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<ProductDocument> {
    return this.productModel.findByIdAndUpdate(id, updateProductDto);
  }

  async removeProduct(id: string): Promise<ProductDocument> {
    return this.productModel.findByIdAndDelete(id);
  }
}
