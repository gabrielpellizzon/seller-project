import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from 'src/schemas/product.schema';
import { Model } from 'mongoose';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
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

  async findOneProduct(id: number): Promise<ProductDocument> {
    return this.productModel.findById(id);
  }

  async updateProduct(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<ProductDocument> {
    return this.productModel.findByIdAndUpdate(id, updateProductDto);
  }

  async removeProduct(id: number): Promise<ProductDocument> {
    return this.productModel.findByIdAndDelete(id);
  }
}
