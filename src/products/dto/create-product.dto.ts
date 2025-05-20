import { IsString, IsNumber, Min, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({
    description: 'Tên sản phẩm',
    example: 'iPhone 13',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Mô tả sản phẩm',
    example: 'iPhone 13 128GB',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Giá sản phẩm',
    example: 999.99,
    type: Number,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({
    description: 'Danh mục sản phẩm',
    example: 'Electronics',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({
    description: 'Danh mục con',
    example: 'Smartphones',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  subcategory: string;

  @ApiProperty({
    description: 'Số lượng tồn kho',
    example: 100,
    type: Number,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  stock: number;
}
