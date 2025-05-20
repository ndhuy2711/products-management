import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { SearchProductDto } from './dto/search-product.dto';
import { SortDto, SortOrder } from './dto/sort.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productsRepository.create(createProductDto);
    const savedProduct = await this.productsRepository.save(product);
    // Invalidate cache when a new product is added
    await this.cacheManager.del('products');
    return savedProduct;
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: Product[]; total: number; page: number; limit: number }> {
    // Try to get from cache first
    const cacheKey = `products:${page}:${limit}`;
    const cachedData = await this.cacheManager.get<{
      data: Product[];
      total: number;
      page: number;
      limit: number;
    }>(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    // If not in cache, get from database
    const [data, total] = await this.productsRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: {
        createdAt: 'DESC',
      },
    });

    const result = {
      data,
      total,
      page,
      limit,
    };

    // Store in cache for 5 minutes
    await this.cacheManager.set(cacheKey, result, 300000);
    return result;
  }

  async findOne(id: number): Promise<Product> {
    // Validate id is a valid number
    if (isNaN(id) || id <= 0) {
      throw new NotFoundException('Invalid product ID');
    }

    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['likedBy'], // Load likedBy relation
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async update(
    id: number,
    updateProductDto: CreateProductDto,
  ): Promise<Product> {
    const product = await this.findOne(id);
    Object.assign(product, updateProductDto);
    return this.productsRepository.save(product);
  }

  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);
    await this.productsRepository.remove(product);
  }

  async search(
    searchDto: SearchProductDto,
    sortDto: SortDto = { order: SortOrder.DESC, sortBy: 'createdAt' },
  ): Promise<Product[]> {
    const queryBuilder = this.productsRepository.createQueryBuilder('product');

    // Xử lý tìm kiếm theo từ khóa
    if (searchDto.q) {
      queryBuilder.andWhere('product.name LIKE :q', {
        q: `%${searchDto.q}%`,
      });
    }

    // Xử lý tìm kiếm theo category
    if (searchDto.category) {
      queryBuilder.andWhere('product.category = :category', {
        category: searchDto.category,
      });
    }

    // Xử lý tìm kiếm theo subcategory
    if (searchDto.subcategory) {
      queryBuilder.andWhere('product.subcategory = :subcategory', {
        subcategory: searchDto.subcategory,
      });
    }

    // Xử lý tìm kiếm theo giá tối thiểu
    if (searchDto.minPrice !== undefined && searchDto.minPrice !== null) {
      const minPrice = Number(searchDto.minPrice);
      if (!isNaN(minPrice) && minPrice >= 0) {
        queryBuilder.andWhere('product.price >= :minPrice', {
          minPrice: minPrice,
        });
      }
    }

    // Xử lý tìm kiếm theo giá tối đa
    if (searchDto.maxPrice !== undefined && searchDto.maxPrice !== null) {
      const maxPrice = Number(searchDto.maxPrice);
      if (!isNaN(maxPrice) && maxPrice >= 0) {
        queryBuilder.andWhere('product.price <= :maxPrice', {
          maxPrice: maxPrice,
        });
      }
    }

    // Xử lý tìm kiếm theo số lượt thích tối thiểu
    if (searchDto.minLikes !== undefined && searchDto.minLikes !== null) {
      const minLikes = Number(searchDto.minLikes);
      if (!isNaN(minLikes) && minLikes >= 0) {
        queryBuilder.andWhere('product.likesCount >= :minLikes', {
          minLikes: minLikes,
        });
      }
    }

    // Xử lý sắp xếp
    if (sortDto.sortBy) {
      queryBuilder.orderBy(`product.${sortDto.sortBy}`, sortDto.order);
    }

    return queryBuilder.getMany();
  }

  async likeProduct(productId: number, userId: number): Promise<Product> {
    const product = await this.findOne(productId);

    // Kiểm tra xem user đã like sản phẩm chưa
    const hasLiked = product.likedBy?.some((user) => user.id === userId);
    if (hasLiked) {
      throw new Error('User has already liked this product');
    }

    // Thêm user vào danh sách likedBy
    if (!product.likedBy) {
      product.likedBy = [];
    }

    product.likedBy.push({ id: userId } as any);
    product.likesCount += 1;

    const savedProduct = await this.productsRepository.save(product);
    // Invalidate cache when likes change
    await this.cacheManager.del('products');
    return savedProduct;
  }

  async unlikeProduct(productId: number, userId: number): Promise<Product> {
    const product = await this.findOne(productId);

    // Kiểm tra xem user đã like sản phẩm chưa
    const hasLiked = product.likedBy?.some((user) => user.id === userId);
    if (!hasLiked) {
      return product;
    }

    // Xóa user khỏi danh sách likedBy
    product.likedBy = product.likedBy.filter((user) => user.id !== userId);
    product.likesCount = Math.max(0, product.likesCount - 1);

    const savedProduct = await this.productsRepository.save(product);
    // Invalidate cache when likes change
    await this.cacheManager.del('products');
    return savedProduct;
  }
}
