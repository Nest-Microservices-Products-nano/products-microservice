import { Type } from "class-transformer";
import { IsNegative, IsNumber, IsString, Min } from "class-validator";

export class CreateProductDto {

    @IsString()
    public name: string;
    
    @IsNumber({maxDecimalPlaces:4,})
    @Min(0)
    @Type(()=> Number)
    price: number

}
