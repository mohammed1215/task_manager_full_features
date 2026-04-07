## File Upload Solutions for Vercel

Your system currently uses local filesystem storage which **won't work on Vercel** (serverless is ephemeral). You need to migrate to cloud storage.

### Best Options:

| Service | Pros | Cons | Cost |
|---------|------|------|------|
| **AWS S3** | Most reliable, scales infinitely | Complex setup | Pay-per-use (~$0.023/GB) |
| **Cloudinary** | Easy for images, free tier generous | Limited file types | Free tier: 25GB |
| **DigitalOcean Spaces** | Simple, affordable | Limited geo-distribution | $5/month + bandwidth |
| **Supabase Storage** | Built for Postgres users | Limited customization | Included with Supabase |

---

## Option 1: AWS S3 (Recommended for Production)

### Step 1: Install Dependencies

```bash
npm install aws-sdk dotenv
```

### Step 2: Create S3 Service

Create `src/storage/s3-storage.service.ts`:

```typescript
import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3StorageService {
  private s3: AWS.S3;

  constructor(private configService: ConfigService) {
    this.s3 = new AWS.S3({
      accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      region: this.configService.get('AWS_REGION'),
    });
  }

  async uploadFile(
    file: Express.Multer.File,
    folder: string,
  ): Promise<{ url: string; key: string }> {
    const key = `${folder}/${Date.now()}-${file.originalname}`;
    
    const params = {
      Bucket: this.configService.get('AWS_S3_BUCKET'),
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read' as any,
    };

    const result = await this.s3.upload(params).promise();
    return {
      url: result.Location,
      key: result.Key,
    };
  }

  async deleteFile(key: string): Promise<void> {
    const params = {
      Bucket: this.configService.get('AWS_S3_BUCKET'),
      Key: key,
    };

    await this.s3.deleteObject(params).promise();
  }

  async getSignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    const params = {
      Bucket: this.configService.get('AWS_S3_BUCKET'),
      Key: key,
      Expires: expiresIn,
    };

    return this.s3.getSignedUrl('getObject', params);
  }
}
```

### Step 3: Update Environment Variables

```env
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name
```

### Step 4: Update Attachment Service

Replace `src/attachment/attachment.service.ts`:

```typescript
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attachment } from './entities/attachment.entity';
import { Task } from 'src/task/entities/task.entity';
import { S3StorageService } from 'src/storage/s3-storage.service';

@Injectable()
export class AttachmentService {
  constructor(
    @InjectRepository(Attachment) private readonly attachmentRepo: Repository<Attachment>,
    @InjectRepository(Task) private readonly taskRepo: Repository<Task>,
    private readonly s3Storage: S3StorageService,
  ) {}

  async create(userId: string, taskId: string, file: Express.Multer.File) {
    const task = await this.taskRepo.findOne({
      where: { id: taskId },
      relations: ['attachments'],
    });

    if (!task) throw new NotFoundException('task not found');

    if (task.attachments.length >= 10) {
      throw new BadRequestException('max attachments reached (10/10)');
    }

    // Upload to S3
    const { url, key } = await this.s3Storage.uploadFile(file, 'attachments');

    // Save metadata to database
    const attachment = this.attachmentRepo.create({
      filename: file.originalname,
      fileSize: file.size,
      originalFilename: file.originalname,
      uploadedBy: { id: userId },
      task: { id: taskId },
      storagePath: key, // Store S3 key instead of local path
      contentType: file.mimetype,
      url: url, // Store S3 URL
    });

    return this.attachmentRepo.save(attachment);
  }

  async download(attachmentId: string) {
    const attachment = await this.attachmentRepo.findOne({
      where: { id: attachmentId },
    });

    if (!attachment) throw new NotFoundException('attachment not found');

    // Return signed URL from S3 instead of file stream
    const signedUrl = await this.s3Storage.getSignedUrl(attachment.storagePath);
    return { downloadUrl: signedUrl };
  }

  async remove(attachmentId: string, userId: string) {
    const attachment = await this.attachmentRepo.findOne({
      where: { id: attachmentId },
      relations: ['uploadedBy'],
    });

    if (!attachment) throw new NotFoundException('attachment not found');

    if (attachment.uploadedBy.id !== userId) {
      throw new BadRequestException('unauthorized');
    }

    // Delete from S3
    await this.s3Storage.deleteFile(attachment.storagePath);

    // Delete from database
    await this.attachmentRepo.delete(attachmentId);
    return { message: 'attachment deleted' };
  }
}
```

### Step 5: Update User Service for Avatars

```typescript
async uploadAvatar(userId: string, file: Express.Multer.File) {
  const user = await this.userRepo.findOne({ where: { id: userId } });

  // Delete old avatar from S3 if exists
  if (user.avatar) {
    await this.s3Storage.deleteFile(user.avatar);
  }

  // Upload new avatar
  const { url, key } = await this.s3Storage.uploadFile(file, 'avatars');

  // Update user
  user.avatar = key;
  await this.userRepo.save(user);

  return { 
    message: 'avatar uploaded',
    avatarUrl: url 
  };
}
```

---

## Option 2: Cloudinary (Easiest for Images)

### Step 1: Install & Setup

```bash
npm install cloudinary next-cloudinary
```

### Step 2: Create Cloudinary Service

```typescript
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadFile(file: Express.Multer.File, folder: string) {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder, resource_type: 'auto' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        },
      );
      stream.end(file.buffer);
    });
  }

  async deleteFile(publicId: string) {
    return cloudinary.uploader.destroy(publicId);
  }
}
```

### Step 3: Environment Variables

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## Migration Checklist

- [ ] Choose cloud storage provider (S3 recommended)
- [ ] Create service account / access keys
- [ ] Install SDK / package
- [ ] Create storage service class
- [ ] Update attachment service to use cloud storage
- [ ] Update user avatar upload to use cloud storage
- [ ] Update attachment entity to store cloud URLs
- [ ] Add environment variables to Vercel
- [ ] Test file uploads locally
- [ ] Deploy to Vercel

---

## WebSockets & Socket.io on Vercel

**Important**: WebSockets have limitations on Vercel:
- Free tier: NO WebSocket support
- Pro tier: WebSockets use polling fallback (not true WS)

**Solution**: Use **fallback polling** or migrate to:
- Pusher.com (real-time)
- Supabase Realtime
- Firebase Realtime Database

For notifications, consider replacing with polling for now.

---

## Quick Migration Path

1. **Start with S3** (most reliable)
2. **Or use Cloudinary** (easier setup for images)
3. **Keep database for metadata** (file names, users, etc.)
4. **Update Attachment entity** to include cloud URLs
5. **Test locally** with Minio (local S3 alternative)

---

## Testing Locally

Use Minio for local S3-compatible testing:

```bash
docker run -p 9000:9000 minio/minio server /data
# Access at http://localhost:9000
```

Then update AWS credentials in .env to point to local Minio.
