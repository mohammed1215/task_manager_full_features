import { ArgumentMetadata, BadRequestException, Injectable,PipeTransform } from "@nestjs/common";


@Injectable()
export class ParsePositivePipe implements PipeTransform {
    constructor(public optional:boolean=false){}
    transform(value: any, metadata: ArgumentMetadata):number | undefined {
        if(this.optional && (value === undefined || value === null)){
            return undefined
        }
        value = Number(value)
        
        if(isNaN(value)||value<0){
            throw new BadRequestException(`${metadata.data || 'Value'} should be positive`)
        }
        return value
    }
}