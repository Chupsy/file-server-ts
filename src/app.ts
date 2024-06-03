/**
 * The following lines intialize dotenv,
 * so that env vars from the .env file are present in process.env
 */
import * as dotenv from 'dotenv';
import config from 'config';
import 'reflect-metadata';
import { Runner } from './runner';
import { HTTP_ROUTES } from '@presentations/entrypoints/http/http_routes_enabled.interceptor';
dotenv.config();
const runner = new Runner();
runner.registerDataPersister(config.get('persistence.config'));
runner.registerFilePersister();
runner.registerControllers();
runner.registerEntrypoints({ port: 3000, routes: [HTTP_ROUTES.FILES_GET_ONE] });
runner.registerLoggers();
runner.start();
