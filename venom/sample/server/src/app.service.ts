import { Injectable } from '@nestjs/common';
import { OnModuleInit } from '@nestjs/common/interfaces';
import { ConfigService } from '@nestjs/config';
import { VenomIntegration } from './venom/venom.integration';

@Injectable()
export class AppService implements OnModuleInit {

  private readonly venomIntegration: VenomIntegration;

  constructor(configService: ConfigService) {
    this.venomIntegration = new VenomIntegration(configService);
  }

  async onModuleInit() {
    await this.venomIntegration.init();
  }

}
