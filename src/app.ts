/**
 * The following lines intialize dotenv,
 * so that env vars from the .env file are present in process.env
 */
import * as dotenv from 'dotenv';
import config from 'config';
import 'reflect-metadata';
import { Runner } from './runner';

dotenv.config();
(async () => {
  const runner = new Runner();
  runner.registerDataPersister(config.get('persistence.config'));
  await runner.registerFilePersister();
  runner.registerControllers();
  runner.registerEntrypoints({ port: 3000 });
  runner.registerLoggers();
  runner.start();
})();
