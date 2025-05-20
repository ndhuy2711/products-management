import { IsOptional, IsString, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class SearchProductDto {
  @ApiProperty({
    description: 'Từ khóa tìm kiếm sản phẩm',
    required: false,
    example: 'iPhone',
    type: String,
  })
  @IsOptional()
  @IsString()
  q?: string;

  @ApiProperty({
    description: 'Danh mục sản phẩm',
    required: false,
    example: 'Electronics',
    type: String,
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({
    description: 'Danh mục con',
    required: false,
    example: 'Smartphones',
    type: String,
  })
  @IsOptional()
  @IsString()
  subcategory?: string;

  @ApiProperty({
    description: 'Giá tối thiểu',
    required: false,
    example: 100,
    type: Number,
    minimum: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @ApiProperty({
    description: 'Giá tối đa',
    required: false,
    example: 1000,
    type: Number,
    minimum: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @ApiProperty({
    description: 'Số lượt thích tối thiểu',
    required: false,
    example: 5,
    type: Number,
    minimum: 0,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  minLikes?: number;
}
