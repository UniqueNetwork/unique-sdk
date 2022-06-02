/* eslint-disable max-classes-per-file */
import { ApiProperty } from '@nestjs/swagger';

export class SignHeaders {
  @ApiProperty({
    type: String,
    description: `You can use Seed or Uri authorization:
<ul>
<li><code>Authorization: Seed &lt;your mnemonic phrase&gt;</code> </li>
<li><code>Authorization: Seed &lt;uri name&gt;</code></li>
</ul>
For example:
<ul>
<li><code>Authorization: Seed word1 word2 word3 ...</code> </li>
<li><code>Authorization: Seed //Alice</code></li>
</ul>
`,
  })
  authorization: string;
}

export class VerificationResultResponse {
  @ApiProperty()
  isValid: boolean;

  @ApiProperty()
  errorMessage: string | null;
}

export class ImageUploadResponse {
  @ApiProperty({
    description: 'Image address',
  })
  address: string;
}
