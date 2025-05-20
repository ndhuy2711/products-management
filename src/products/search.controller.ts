import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { SearchProductDto } from './dto/search-product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Search')
@ApiBearerAuth('JWT-auth')
@Controller('search')
@UseGuards(JwtAuthGuard)
export class SearchController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiOperation({ summary: 'Tìm kiếm sản phẩm' })
  @ApiResponse({ status: 200, description: 'Danh sách sản phẩm tìm được.' })
  @Get()
  search(@Query() searchDto: SearchProductDto) {
    return this.productsService.search(searchDto);
  }
}
