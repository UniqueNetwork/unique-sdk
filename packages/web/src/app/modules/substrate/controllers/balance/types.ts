/* eslint-disable max-classes-per-file */

import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsPositive } from 'class-validator';
import {
  BalanceTransferResult,
  BalanceTransferArguments,
} from '@unique-nft/sdk/balance/types';

import { NotYourselfAddress, ValidAddress } from '../../../../validation';
import { AddressApiProperty } from '../../../../types/sdk-methods';
import { MutationResponse } from '../../../../decorators/mutation-method';

export class BalanceTransferBody implements BalanceTransferArguments {
  @IsString()
  @ValidAddress()
  @NotYourselfAddress('destination')
  @AddressApiProperty()
  address: string;

  @ValidAddress()
  @ApiProperty({ example: 'unjKJQJrRd238pkUZZvzDQrfKuM39zBSnQ5zjAGAGcdRhaJTx' })
  @AddressApiProperty()
  destination: string;

  @IsNumber()
  @IsPositive()
  @ApiProperty({
    example: 0.01,
  })
  amount: number;
}

export class BalanceTransferParsed implements BalanceTransferResult {
  @ApiProperty({ type: Boolean })
  success: boolean;
}

export class BalanceTransferResponse extends MutationResponse {
  @ApiProperty()
  parsed: BalanceTransferParsed;
}
