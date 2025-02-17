import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from 'src/schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  async createProduct(
    createProductDto: CreateProductDto,
  ): Promise<ProductDocument> {
    const product = new this.productModel(createProductDto);
    await this.cacheManager.del('all_products');

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
    await this.cacheManager.del('all_products');

    return this.productModel.findByIdAndUpdate(id, updateProductDto);
  }

  async removeProduct(id: string): Promise<ProductDocument> {
    await this.cacheManager.del('all_products');

    return this.productModel.findByIdAndDelete(id);
  }
}
