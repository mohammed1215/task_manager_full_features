import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import cloudinary from 'cloudinary';
@Injectable()
export class CloudinaryService {
  constructor(private readonly config: ConfigService) {
    cloudinary.v2.config({
      cloud_name: this.config.get('CLOUDINARY_CLOUD_NAME'),
      api_key: this.config.get('CLOUDINARY_API_KEY'),
      api_secret: this.config.get('CLOUDINARY_API_SECRET'),
    });
  }

  isCloudinaryEnabled(): boolean {
    return (
      !!this.config.get('CLOUDINARY_CLOUD_NAME') &&
      !!this.config.get('CLOUDINARY_API_KEY') &&
      !!this.config.get('CLOUDINARY_API_SECRET')
    );
  }

  async uploadFile(
    file: Express.Multer.File,
    resourceType: 'image' | 'video' | 'raw',
  ): Promise<{ url: string; publicId: string; filename: string }> {
    const result = await cloudinary.v2.uploader.upload(file.path, {
      folder: 'task_manager/attachments',
      resource_type: resourceType,
    });

    return {
      url: result.url,
      publicId: result.public_id,
      filename: file.originalname,
    };
  }

  async upload(file: Express.Multer.File) {
    const result = await cloudinary.v2.uploader.upload(file.path, {
      folder: 'task_manager/profile_images',
      resource_type: 'auto',
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
      filename: result.original_filename,
    };
  }

  async deleteProfile(publicId: string) {
    await cloudinary.v2.uploader.destroy(publicId);
  }
}
