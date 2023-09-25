import { Injectable } from '@nestjs/common';

@Injectable()
export class CacheService {
  private tempStoreMap = new Map();
  async set(key: string, data: string | object): Promise<boolean> {
    console.log(key, data);
    const dataString = JSON.stringify(data);
    this.tempStoreMap.set(key, dataString);

    return true;
  }
  async get<T>(key: string): Promise<T> {
    const dataString = this.tempStoreMap.get(key);

    try {
      if (dataString) {
        return JSON.parse(dataString) as T;
      }
      return null;
    } catch (error) {
      return dataString;
    }
  }
}
