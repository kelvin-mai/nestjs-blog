import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TagEntity } from './entities/tag.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(TagEntity) private tagRepo: Repository<TagEntity>,
  ) {}

  async findTags(): Promise<string[]> {
    const tags = await this.tagRepo.find();
    return tags.map(tag => tag.tag);
  }
}
