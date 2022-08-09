import { CategoriesService } from '@/api/categories/categories.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { Product } from '../entities/product.entity';
import PDFDocument from 'pdfkit-table';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly repository: Repository<Product>,
    private categoryService: CategoriesService,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Object> {
    const category = await this.categoryService.findOne(
      createProductDto.categoryId,
    );

    if (!category) {
      return {
        message: `category with ${createProductDto.categoryId} not found`,
      };
    }

    delete createProductDto.categoryId;

    const newProduct = {
      ...createProductDto,
      category,
    };

    const product = await this.repository.save(newProduct);
    return { message: 'Product saved successfully', data: product };
  }

  findAll(): Promise<Product[]> {
    return this.repository.find({
      relations: {
        category: true,
      },
    });
  }

  findOne(id: string): Promise<Product> {
    return this.repository.findOne({
      relations: { category: true },
      where: { id },
    });
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.findOne(id);

    if (updateProductDto.name) product.name = updateProductDto.name;
    if (updateProductDto.amountInStock)
      product.amountInStock = updateProductDto.amountInStock;
    if (updateProductDto.maximumStock)
      product.maximumStock = updateProductDto.maximumStock;
    if (updateProductDto.reorderQuantity)
      product.reorderQuantity = updateProductDto.reorderQuantity;
    if (updateProductDto.vat) product.vat = updateProductDto.vat;
    if (updateProductDto.warranty) product.warranty = updateProductDto.warranty;

    await this.repository.save(product);

    return { message: 'Product update successfully', data: product };
  }

  async remove(id: string) {
    const product = await this.findOne(id);

    await this.repository.delete(product.id);

    return {
      message: `product with the name of '${product.name}' deleted successfully`,
    };
  }

  async countAll(): Promise<number> {
    return this.repository.count();
  }

  async generatePDF(): Promise<Buffer> {
    const data: any = await this.findAll();
    const pdfBuffer: Buffer = await new Promise((resolve) => {
      const doc = new PDFDocument({
        margin: 30,
        size: 'A4',
      });

      (async function () {
        // table
        const table = {
          title: 'Inspections',
          subtitle: 'List of inspections Saved',
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
              width: 50,
              property: 'name',
              renderer: null,
            },
            {
              label: 'Amount in stock',
              property: 'amountInStock',
              width: 100,
              renderer: null,
            },
            {
              label: 'Max Stock',
              width: 100,
              property: 'maximumStock',
              renderer: (value, i, irow) => `${value}`,
            },
            {
              label: 'Vat Inclusive',
              width: 150,
              property: 'vat',
              renderer: (value, i, irow) => `${value ? 'True' : 'False'}`,
            },
            {
              label: 'Reorder Qty',
              width: 150,
              property: 'reorderQuantity',
              renderer: null,
            },
          ],
          datas: data,
        };
        await doc.table(table, {
          width: 600,
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
