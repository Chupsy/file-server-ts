/**
 * The following lines intialize dotenv,
 * so that env vars from the .env file are present in process.env
 */
import * as dotenv from 'dotenv';
import 'reflect-metadata';
import { Runner } from './runner';
dotenv.config();
const runner = new Runner();

runner.start();
