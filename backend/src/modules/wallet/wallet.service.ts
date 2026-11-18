import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  WalletTransaction,
  walletTxView,
} from '../../database/entities/wallet-transaction.entity';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(WalletTransaction)
    private readonly txs: Repository<WalletTransaction>,
  ) {}

  private async getBalance(userId: string): Promise<number> {
    const row = await this.txs
      .createQueryBuilder('t')
      .select(
        "COALESCE(SUM(CASE WHEN t.type = 'credit' THEN t.amount ELSE -t.amount END), 0)",
        'balance',
      )
      .where('t.userId = :userId', { userId })
      .getRawOne<{ balance: string }>();
    return Number(row?.balance ?? 0);
  }

  async getMe(userId: string, limit = 30) {
    const balance = await this.getBalance(userId);
    const rows = await this.txs.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: Number.isFinite(limit)
        ? Math.max(1, Math.min(Math.floor(limit), 100))
        : 30,
    });
    return {
      balance,
      readOnly: true as const,
      currency: 'USD',
      transactions: rows.map(walletTxView),
    };
  }
}
