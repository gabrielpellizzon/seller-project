import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrdersService } from './orders.service';
import { ExpressRequestWithUser } from 'src/auth/interfaces/express-request-with-user.interface';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Public()
  @Post()
  createOrder(
    @Body() createOrderDto: CreateOrderDto,
    @Request() req: ExpressRequestWithUser,
  ) {
    return this.ordersService.createOrder(createOrderDto, req);
  }

  @Public()
  @Get()
  findAllOrders() {
    return this.ordersService.findAllOrders();
  }
}
