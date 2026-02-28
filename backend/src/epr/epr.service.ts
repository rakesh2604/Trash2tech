import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { stringify } from 'csv-stringify/sync';
import { Repository } from 'typeorm';
import { DomainError } from '../common/domain-error';
import { Brand } from '../entities/reference.entity';
import { EprCredit } from '../entities/epr.entity';
import { Lot, RecyclerIntake } from '../entities/lot.entity';

@Injectable()
export class EprService {
  constructor(
    @InjectRepository(EprCredit)
    private readonly eprRepo: Repository<EprCredit>,
    @InjectRepository(Brand)
    private readonly brandRepo: Repository<Brand>,
    @InjectRepository(Lot) private readonly lotRepo: Repository<Lot>,
    @InjectRepository(RecyclerIntake)
    private readonly intakeRepo: Repository<RecyclerIntake>,
  ) {}

  async generateCreditsForLot(params: { lotId: string; brandId: string; reportingPeriod: string }) {
    const [lot, brand] = await Promise.all([
      this.lotRepo.findOne({
        where: { id: params.lotId },
        relations: { materialCategory: true },
      }),
      this.brandRepo.findOne({ where: { id: params.brandId } }),
    ]);
    if (!lot) throw new DomainError('LOT_NOT_FOUND', 'Lot not found', { lotId: params.lotId });
    if (!brand)
      throw new DomainError('BRAND_NOT_FOUND', 'Brand not found', { brandId: params.brandId });

    const latestIntake = await this.intakeRepo.findOne({
      where: { lot: { id: lot.id } },
      order: { receivedTime: 'DESC' },
    });
    if (!latestIntake) {
      throw new DomainError('LOT_NO_INTAKE', 'Lot has no recycler intake', { lotId: lot.id });
    }

    const credit = this.eprRepo.create({
      brand,
      lot,
      materialCategory: lot.materialCategory,
      weightKg: latestIntake.receivedWeightKg,
      reportingPeriod: params.reportingPeriod,
    });
    return await this.eprRepo.save(credit);
  }

  async exportCsv(query: { brandId: string; reportingPeriod: string }) {
    const brand = await this.brandRepo.findOne({ where: { id: query.brandId } });
    if (!brand)
      throw new DomainError('BRAND_NOT_FOUND', 'Brand not found', { brandId: query.brandId });

    const credits = await this.eprRepo.find({
      where: { brand: { id: query.brandId }, reportingPeriod: query.reportingPeriod },
      relations: { lot: true, materialCategory: true },
    });

    const rows = credits.map((c) => ({
      brandId: brand.id,
      brandName: brand.name,
      reportingPeriod: c.reportingPeriod ?? '',
      lotCode: c.lot?.lotCode ?? '',
      materialCategoryCode: c.materialCategory?.code ?? '',
      materialCategoryEprCode: c.materialCategory?.eprCategoryCode ?? '',
      weightKg: c.weightKg ?? '',
      generatedAt: c.generatedAt ? new Date(c.generatedAt).toISOString() : '',
    }));

    return stringify(rows, { header: true });
  }
}
