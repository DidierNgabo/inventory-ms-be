import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  @InjectRepository(Category)
  private readonly repository: Repository<Category>;

  async create(createCategoryDto: CreateCategoryDto) {
    const category = new Category();
    category.name = createCategoryDto.name;
    category.description = createCategoryDto.description;

    await this.repository.save(category);

    return { message: 'category saved successfully', data: category };
  }

  findAll(): Promise<Category[]> {
    return this.repository.find();
  }

  async findOne(id: string): Promise<Category> {
    return this.repository.findOneBy({ id });
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.findOne(id);
    if (updateCategoryDto.name) category.name = updateCategoryDto.name;

    if (updateCategoryDto.description)
      category.description = updateCategoryDto.description;

    await this.repository.save(category);

    return { message: 'Category updated successfully', data: category };
  }

  async remove(id: string): Promise<Object> {
    const category = await this.findOne(id);
    await this.repository.delete(category);

    return { message: 'category delete successfully' };
  }
}
