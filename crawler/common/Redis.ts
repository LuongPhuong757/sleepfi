const redis = require('redis');

export default class Redis {
  private static instance: Redis
  private client: any

  constructor() {
    this.client = redis.createClient({
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      legacyMode: true,
    })
  }

  public static getInstance(): Redis {
    if (!Redis.instance) {
      Redis.instance = new Redis();
    }

    return Redis.instance;
  }

  async getDataFromCache(key) {
    try {
      await this.client.connect();
      return this.client.get(key, (err, res) => {
        if (err) {
          console.log('error');
        }
        console.log('res   ', res)
        return res;
      })
    } catch (e) {
      console.log('error in get catch');
    }
  }

  async setDataToCache(key, data) {
    try {
      await this.client.connect();
      this.client.set(key, data);
    } catch (e) {
      console.error('erorr in set cahce');
    }
  }

}