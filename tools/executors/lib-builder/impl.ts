import { ExecutorContext } from '@nrwl/devkit';
import { exec } from 'child_process';
import { promisify } from 'util';

export interface EchoExecutorOptions {
  packageName: string;
}

export default async function echoExecutor(
  options: EchoExecutorOptions,
  context: ExecutorContext,
): Promise<{ success: boolean }> {
  const command = `npm run build:${options.packageName}`;

  console.info('command', command);

  const { stdout, stderr } = await promisify(exec)(command);

  console.info(stdout);
  console.info(stderr);

  return { success: true };
}
