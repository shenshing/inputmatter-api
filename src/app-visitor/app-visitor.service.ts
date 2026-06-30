import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppVisitor } from './app-visitor.entity';

type Period = '12h' | '1d' | '2d' | '5d' | '7d' | '30d' | 'all';

const PERIOD_CONFIG: Record<Period, { interval: string | null; granularity: 'hour' | 'day' }> = {
  '12h': { interval: '12 hours', granularity: 'hour' },
  '1d':  { interval: '1 day',    granularity: 'hour' },
  '2d':  { interval: '2 days',   granularity: 'hour' },
  '5d':  { interval: '5 days',   granularity: 'day'  },
  '7d':  { interval: '7 days',   granularity: 'day'  },
  '30d': { interval: '30 days',  granularity: 'day'  },
  'all': { interval: null,       granularity: 'day'  },
};

@Injectable()
export class AppVisitorService {
  constructor(
    @InjectRepository(AppVisitor)
    private readonly repo: Repository<AppVisitor>,
  ) {}

  logVisit(type: string): Promise<AppVisitor> {
    return this.repo.save(this.repo.create({ type }));
  }

  async getStats(type?: string, period: Period = '30d'): Promise<{
    total: number;
    chartData: { bucket: string; count: number }[];
    granularity: 'hour' | 'day';
    recentVisitors: AppVisitor[];
  }> {
    const where = type ? { type } : {};
    const total = await this.repo.count({ where });
    const recentVisitors = await this.repo.find({
      where,
      order: { createdAt: 'DESC' },
      take: 50,
    });

    const { interval, granularity } = PERIOD_CONFIG[period] ?? PERIOD_CONFIG['30d'];
    const truncUnit = granularity === 'hour' ? 'hour' : 'day';

    const params: string[] = [];
    const conditions: string[] = [];

    if (interval) {
      conditions.push(`created_at >= NOW() - INTERVAL '${interval}'`);
    }
    if (type) {
      params.push(type);
      conditions.push(`type = $${params.length}`);
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const chartData: { bucket: string; count: number }[] = await this.repo.query(
      `SELECT DATE_TRUNC('${truncUnit}', created_at) AS bucket, COUNT(*)::int AS count
       FROM app_visitors
       ${whereClause}
       GROUP BY DATE_TRUNC('${truncUnit}', created_at)
       ORDER BY bucket ASC`,
      params,
    );

    return { total, chartData, granularity, recentVisitors };
  }
}
