import * as fs from 'fs';

const FIX_FILE = 'packages/client/src/types/api.ts';

function main() {
  let content = fs.readFileSync(FIX_FILE, 'utf8');
  content = content
    .replace(
      / ExtrinsicResultResponse {/gi,
      () => ' ExtrinsicResultResponse<T> {',
    )
    .replace(
      /interface ExtrinsicResultResponse[<>\n ;A-Za-z{:]*(parsed\?: object;)/gi,
      (match) => match.replace('parsed?: object;', 'parsed?: T;'),
    );
  if (
    !content.includes(
      `import { arrayNumberRecordStringAny } from './missingApiTypes'`,
    )
  )
    content =
      content +
      "\nimport { arrayNumberRecordStringAny } from './missingApiTypes';\n";
  fs.writeFileSync(FIX_FILE, content);
}

main();
