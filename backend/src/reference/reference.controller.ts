import { Controller, Get, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brand, Hub, MaterialCategory, Recycler } from '../entities/reference.entity';
import { User, UserStatus } from '../entities/user.entity';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('reference')
@UseGuards(RolesGuard)
@Roles('ADMIN', 'COORDINATOR', 'FIELD_CAPTAIN', 'RECYCLER')
export class ReferenceController {
  constructor(
    @InjectRepository(Hub) private readonly hubRepo: Repository<Hub>,
    @InjectRepository(MaterialCategory)
    private readonly categoryRepo: Repository<MaterialCategory>,
    @InjectRepository(Recycler) private readonly recyclerRepo: Repository<Recycler>,
    @InjectRepository(Brand) private readonly brandRepo: Repository<Brand>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  @Get('hubs')
  async listHubs() {
    return await this.hubRepo.find({
      where: { active: true },
      order: { name: 'ASC' },
      select: ['id', 'name', 'city', 'pincode'],
    });
  }

  @Get('material-categories')
  async listMaterialCategories() {
    return await this.categoryRepo.find({
      order: { code: 'ASC' },
      select: ['id', 'code', 'description'],
    });
  }

  @Get('recyclers')
  async listRecyclers() {
    return await this.recyclerRepo.find({
      order: { name: 'ASC' },
      select: ['id', 'name', 'city'],
    });
  }

  @Get('brands')
  @Roles('ADMIN', 'BRAND')
  async listBrands() {
    return await this.brandRepo.find({
      order: { name: 'ASC' },
      select: ['id', 'name', 'eprRegistrationNumber'],
    });
  }

  @Get('users')
  async listUsers() {
    return await this.userRepo.find({
      where: { status: UserStatus.ACTIVE },
      order: { name: 'ASC' },
      select: ['id', 'name', 'phone', 'role'],
    });
  }
}
