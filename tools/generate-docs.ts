import * as fs from 'fs';
import { join, resolve } from 'path';

const DOCS_OUTPUT_DIR = 'dist/docs';

const MAIN_README_INPUT = '.github/README.md';
const MAIN_README_OUTPUT = 'dist/docs/sdk_main.md';

const WEB_README_INPUT = 'packages/web/README.md';
const WEB_README_OUTPUT = 'dist/docs/web.md';

const SDK_README_INPUT = 'packages/sdk/README.md';
const SDK_README_OUTPUT = 'dist/docs/sdk.md';

const ACCOUNTS_README_INPUT = 'packages/accounts/README.md';
const ACCOUNTS_README_OUPUT = 'dist/docs/accounts.md';

const RECIPES_README_INPUT = 'recipes/README.md';
const RECIPES_README_OUPUT = 'dist/docs/recipes.md';

const SDK_TOKENS_DIR = 'packages/sdk/tokens/methods';
const SDK_METHODS_README_OUTPUT = 'dist/docs/sdk_methods.md';

const GITHUB_URL = 'https://github.com/UniqueNetwork/unique-sdk/tree/master';

const LINK_REGEX = /\[(.*?)\]\((.*?)\)/g;
const PARAGRAPH_1_REGEX = /^\#{1} .+/gm;
const PARAGRAPH_2_REGEX = /^\#{2} .+/gm;

function deleteHeader(content: string) {
  const regex = /<div align="center">[\W\w]*?<\/div>/;

  return content.replace(regex, '');
}

function generateDir() {
  const output = resolve(DOCS_OUTPUT_DIR);

  fs.mkdirSync(output, { recursive: true });
}

function generateMain() {
  const input = resolve(MAIN_README_INPUT);
  const output = resolve(MAIN_README_OUTPUT);

  let content = fs.readFileSync(input, 'utf8');

  content = deleteHeader(content);

  content = content.replace(
    LINK_REGEX,
    (_match, title, link, _offset, _string) => {
      if (/\.\.\/packages\/web/.test(link))
        link = link.replace(/\.\.\/packages\/web/, './web.md');

      if (/\.\.\/packages\/sdk/.test(link))
        link = link.replace(/\.\.\/packages\/sdk/, './sdk.md');

      if (/\.\.\/packages\/accounts/.test(link))
        link = link.replace(/\.\.\/packages\/accounts/, './accounts.md');

      if (/\.\.\/recipes/.test(link))
        link = link.replace(/\.\.\/recipes/, './recipes.md');

      return `[${title}](${link})`;
    },
  );

  fs.writeFileSync(output, content);
}

function generateWeb() {
  const input = resolve(WEB_README_INPUT);
  const output = resolve(WEB_README_OUTPUT);

  let content = fs.readFileSync(input, 'utf8');

  content = deleteHeader(content);

  fs.writeFileSync(output, content);
}

function generateSdk() {
  const input = resolve(SDK_README_INPUT);
  const output = resolve(SDK_README_OUTPUT);

  let content = fs.readFileSync(input, 'utf8');

  content = deleteHeader(content);

  content = content.replace(
    LINK_REGEX,
    (_match, title, link, _offset, _string) => {
      if (/\.\//.test(link))
        link = link.replace(/\.\//, `${GITHUB_URL}/packages/sdk/`);

      return `[${title}](${link})`;
    },
  );

  fs.writeFileSync(output, content);
}

function generateAccounts() {
  const input = resolve(ACCOUNTS_README_INPUT);
  const output = resolve(ACCOUNTS_README_OUPUT);

  let content = fs.readFileSync(input, 'utf8');

  content = deleteHeader(content);

  content = content.replace(
    LINK_REGEX,
    (_match, title, link, _offset, _string) => {
      if (/\.\//.test(link))
        link = link.replace(/\.\//, `${GITHUB_URL}/packages/accounts/`);

      return `[${title}](${link})`;
    },
  );

  fs.writeFileSync(output, content);
}

function generateRecipes() {
  const input = resolve(RECIPES_README_INPUT);
  const output = resolve(RECIPES_README_OUPUT);

  let content = fs.readFileSync(input, 'utf8');

  content = deleteHeader(content);

  content = content.replace(
    LINK_REGEX,
    (_match, title, link, _offset, _string) => {
      if (/\.\//.test(link))
        link = link.replace(/\.\//, `${GITHUB_URL}/recipes/`);

      return `[${title}](${link})`;
    },
  );

  fs.writeFileSync(output, content);
}

function generateMethods() {
  const dir = resolve(SDK_TOKENS_DIR);
  const output = resolve(SDK_METHODS_README_OUTPUT);

  const methods = fs.readdirSync(dir, { withFileTypes: true });

  let content = '# SDK Methods \n\n# Table of Contents \n\n';

  for (const method of methods) {
    const path = join(dir, method.name, 'README.md');

    if (!fs.existsSync(path)) continue;

    const input = fs.readFileSync(path, 'utf8');

    const match = input.match(/\# (.+)/);

    if (match) {
      const title = match[1];
      const link = title
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .replace(/\s+/g, '-')
        .toLowerCase();

      const line = `- [${title}](#${link}) \n`;

      content = content.concat(line);
    }
  }

  content = content.concat('\n');

  for (const method of methods) {
    const path = join(dir, method.name, 'README.md');

    if (!fs.existsSync(path)) continue;

    let methodContent = fs.readFileSync(path, 'utf8');

    methodContent = methodContent.replace(PARAGRAPH_2_REGEX, (match) => {
      return `##${match}`;
    });

    methodContent = methodContent.replace(PARAGRAPH_1_REGEX, (match) => {
      return `#${match}`;
    });

    methodContent = methodContent.replace(
      LINK_REGEX,
      (_match, title, link, _offset, _string) => {
        if (/\.\.\//.test(link))
          link = link.replace(
            /\.\.\//,
            `${GITHUB_URL}/packages/sdk/tokens/methods/`,
          );

        return `[${title}](${link})`;
      },
    );

    content = content.concat(methodContent).concat('\n');
  }

  fs.writeFileSync(output, content);
}

function main() {
  generateDir();
  generateMain();
  generateWeb();
  generateSdk();
  generateAccounts();
  generateRecipes();
  generateMethods();
}

main();
