import { Injectable } from '@nestjs/common';
import { connect, JSONCodec } from 'nats';
import { natsOptions } from 'src/config/general';

@Injectable()
export class NatsService {
  private natsClient;
  private codec;

  constructor() {
    this.codec = JSONCodec();
    this.initialize();
  }

  async initialize() : Promise<void> {
    if (!natsOptions.options?.servers || natsOptions.options?.servers.length === 0) {
      throw new Error('NATS servers not configured');
    }

    this.natsClient = await connect(natsOptions.options);
  }

  publish(subject: string, data: any) : void {
    try{
      this.natsClient.publish(subject, this.codec.encode(data));
    } catch(e){
      console.error('Failed to publish message to NATS', e);
    }
  }

  // subscribe(subject: string, callback: (data: any) => void) : void{
  //   const sub = this.natsClient.subscribe(subject);
  //   (async () => {
  //     for await (const msg of sub) {
  //       callback(this.codec.decode(msg.data));
  //     }
  //   })();
  // }
}
