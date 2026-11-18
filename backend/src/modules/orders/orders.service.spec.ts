import { OrdersService } from './orders.service';
import { Repository } from 'typeorm';
import { Order } from '../../database/entities/order.entity';
import { OrdersController } from './orders.controller';

describe('Brand House offer enforcement', () => {
  const controller = new OrdersController({} as OrdersService);
  it('rejects legacy order creation until the verified offer handoff exists', () => {
    expect(() => controller.create()).toThrow('locked CORE pricing snapshot');
  });
  it('returns no invented courier, tracking number or estimated delivery', async () => {
    const row = {
      id: '1',
      publicId: 'ORD-1',
      status: 'shipped',
      amount: 20,
      createdAt: new Date(),
      deliveryStatus: 'pending',
    } as Order;
    const reader = new OrdersService({
      find: async () => [row],
    } as unknown as Repository<Order>);
    expect((await reader.listForUser('house'))[0]).toMatchObject({
      trackingCode: null,
      courier: null,
      estDeliveryAt: null,
    });
  });
});
