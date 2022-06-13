/* eslint-disable max-classes-per-file */
import { ApiProperty } from '@nestjs/swagger';

export class VerificationResultResponse {
  @ApiProperty()
  isValid: boolean;

  @ApiProperty()
  errorMessage: string | null;
}

export class IpfsUploadResponse {
  @ApiProperty({
    description: 'File address',
  })
  cid: string;
}
