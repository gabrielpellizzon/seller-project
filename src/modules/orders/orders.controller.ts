import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrdersService } from './orders.service';
import { ExpressRequestWithUser } from 'src/auth/interfaces/express-request-with-user.interface';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  createOrder(
    @Body() createOrderDto: CreateOrderDto,
    @Request() req: ExpressRequestWithUser,
  ) {
    return this.ordersService.createOrder(createOrderDto, req);
  }

  @Get()
  findAllOrders() {
    return this.ordersService.findAllOrders();
  }
}
