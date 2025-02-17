import { HttpException, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderDocument } from 'src/schemas/order.schema';
import { Model } from 'mongoose';
import { Product, ProductDocument } from 'src/schemas/product.schema';
import { ExpressRequestWithUser } from 'src/auth/interfaces/express-request-with-user.interface';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name)
    private readonly orderModel: Model<OrderDocument>,
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  async createOrder(
    { products, customerName, customerEmail }: CreateOrderDto,
    req: ExpressRequestWithUser,
  ): Promise<OrderDocument> {
    let totalAmount = 0;

    for (const { productId, quantity: orderQuantity } of products) {
      const findProduct = await this.findProductById(productId);
      this.checkStockAvailability(findProduct, orderQuantity);

      totalAmount += this.calculateTotalAmount(findProduct, orderQuantity);

      await this.updateProductStock(findProduct, orderQuantity);
    }

    const order = await this.createOrderInDatabase({
      products,
      totalAmount,
      customerEmail: customerEmail,
      customerName: customerName,
    });

    return order;
  }

  private async findProductById(productId: string): Promise<ProductDocument> {
    const product = await this.productModel.findById(productId);
    if (!product) {
      throw new HttpException('Product not found', 404);
    }
    return product;
  }

  private checkStockAvailability(
    product: ProductDocument,
    quantity: number,
  ): void {
    if (product.quantity < quantity) {
      throw new HttpException('Insufficient stock', 400);
    }
  }

  private calculateTotalAmount(
    product: ProductDocument,
    quantity: number,
  ): number {
    return product.price * quantity;
  }

  private async createOrderInDatabase(
    createOrderDto: CreateOrderDto & {
      totalAmount: number;
      customerEmail: string;
      customerName: string;
    },
  ): Promise<OrderDocument> {
    const order = new this.orderModel(createOrderDto);
    return order.save();
  }

  private async updateProductStock(
    product: ProductDocument,
    quantity: number,
  ): Promise<void> {
    product.quantity -= quantity;
    await product.save();
  }

  async findAllOrders(): Promise<OrderDocument[]> {
    return this.orderModel.find();
  }
}
