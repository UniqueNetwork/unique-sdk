/* eslint-disable max-classes-per-file */
import { ApiProperty } from '@nestjs/swagger';

export class ExtrinsicResultEvent {
  @ApiProperty()
  section: string;

  @ApiProperty()
  method: string;

  @ApiProperty()
  data: any;
}

export class ExtrinsicResultResponse {
  @ApiProperty()
  status: string;

  @ApiProperty()
  isCompleted: boolean;

  @ApiProperty()
  isError: boolean;

  @ApiProperty()
  blockHash?: string;

  @ApiProperty()
  blockIndex?: number;

  @ApiProperty()
  errorMessage?: string;

  @ApiProperty({ type: ExtrinsicResultEvent })
  events: ExtrinsicResultEvent[];
}
