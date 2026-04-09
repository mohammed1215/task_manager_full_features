import { Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service.ts';

@Module({
  providers: [CloudinaryService],
  exports: [CloudinaryService]
})
export class CloudinaryModule {}
