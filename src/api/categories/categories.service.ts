import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import PDFDocument from 'pdfkit-table';

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
    return this.repository.findOne({ where:{id},relations:{products:true} });
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
    await this.repository.delete(category.id);

    return { message: 'category delete successfully' };
  }

  async generatePDF(): Promise<Buffer> {
    const data: any = await this.findAll();
    console.table(data);
    const pdfBuffer: Buffer = await new Promise((resolve) => {
      const doc = new PDFDocument({
        margin: 30,
        size: 'A4',
      });

      (async function () {
        // table
        const table = {
          title: 'Categories',
          subtitle: 'List of categories saved',
          headers: [
            {
              label: '#',
              property: '#',
              width: 50,
              renderer: function (value, i, irow) {
                return `${1 + irow}`;
              },
            },
            {
              label: 'Name',
              width: 100,
              property: 'name',
              renderer: null,
            },
            {
              label: 'Description',
              property: 'description',
              width: 250,
              renderer: null,
            },
            // {
            //   label: 'Date',
            //   width: 150,
            //   property: 'createdAt',
            //   renderer: (value, i, irow) => `${value}`,
            // },
          ],
          datas: data,
        };
        await doc.table(table, {
          width: 500,
        });
        doc.end();
      })();

      const buffer = [];
      doc.on('data', buffer.push.bind(buffer));
      doc.on('end', () => {
        const data = Buffer.concat(buffer);
        resolve(data);
      });
    });

    return pdfBuffer;
  }
}
