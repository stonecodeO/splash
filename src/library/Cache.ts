import { RedisClientType, createClient} from 'redis';
import {config} from '../config/config';
import Logger from '../library/Logger';


export default class RedisCache {
    private readonly cache: RedisClientType;
    private ttl: number;
    private isReady: boolean = false;

    constructor(ttl: number){
        // [1] define ttl and create redis connection
        this.ttl = ttl;
        this.cache = createClient({
            url: config.redis.url
        })       

        this.cache.on('connect', () => {
            Logger.info('Redis connection established');
        })
        this.cache.on("error", (error) => {
            console.error(`Redis error, service degraded: ${error}`);
          })
        this.cache.on('reconnecting', () => {
            this.isReady = true
            Logger.info('Redis reconnecting...')
        })
        this.cache.on('ready', () => {
            Logger.info('Redis is ready')
        })

        this.cache.connect().then(() => console.log('successfully connect redis')).catch((error) => console.log('connection failed'));

    }

     // [2] generic function, takes `fetcher` argument which is meant to refresh the cache
     async get<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
     // [3] if we're not connected to redis, bypass cache
        if(!this.isReady){
          return await fetcher();
        }
          return new Promise((resolve, reject) => {
            try {
                this.cache.get(key).then((value) => {
                  console.log(value)
                  if(value !== null)
                  // [4] if value is found in cache, return it
                  return resolve(JSON.parse(value));
                });                  
            } catch (error) {
                return reject(error);
            }

             // [5] if value is not in cache, fetch it and return it
              fetcher().then((result) => {
                  //@ts-ignore
                  this.cache.set(key, JSON.stringify(result), this.ttl);
                  return resolve(result);
              }).catch((error) => {
                  return reject(error);
              });
          });
         
          
     }

     // [6]
     del(key: string) {
        this.cache.del(key);
      }
     // [7] 
     flush() {
        this.cache.flushAll();
      }

}