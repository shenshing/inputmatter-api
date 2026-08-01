import { IsArray, ArrayMinSize, ArrayUnique, IsIn } from 'class-validator';
import { SHOP_CATEGORIES, ShopCategory } from '../shop.entity';

export class AddShopCategoriesDto {
  @IsArray()
  @ArrayMinSize(1)
  @ArrayUnique()
  @IsIn(SHOP_CATEGORIES, { each: true })
  categories!: ShopCategory[];
}
