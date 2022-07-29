import * as fs from 'fs';

const FIX_FILE = 'packages/client/src/types/api.ts';

function main() {
  fs.appendFileSync(
    FIX_FILE,
    "\nimport { arrayNumberRecordStringAny } from './missingApiTypes';\n",
    'utf8',
  );
}

main();
