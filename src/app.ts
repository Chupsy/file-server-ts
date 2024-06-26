/**
 * The following lines intialize dotenv,
 * so that env vars from the .env file are present in process.env
 */
import * as dotenv from 'dotenv';
import config from 'config';
import 'reflect-metadata';
import { Runner } from './runner';
import { HTTP_ROUTES, RoutesEnabledValidator, RoutesEnabledValidatorConfig } from '@presentations/middlewares/routes_enabled_validator';
import { FileSizeValidator, FileSizeValidatorConfig } from '@presentations/middlewares/filesize_validator';
import { CustomValidator } from '../examples/customMiddleware';

dotenv.config();
(async () => {
  const runner = new Runner();
  runner.registerDataPersister(config.get('persistence.config'));
  await runner.registerFilePersister();
  runner.registerControllers();
  runner.registerEntrypoints({ port: 3000 });
  runner.registerMiddleware(CustomValidator, {
    test: 123
  }),
  runner.registerMiddleware(
    RoutesEnabledValidator,
    {
      routesEnabled: [HTTP_ROUTES.FILES_GET_ONE, HTTP_ROUTES.FILES_CREATE]
    } as RoutesEnabledValidatorConfig
  );

  runner.registerMiddleware(FileSizeValidator,
    {
      minSize: 5000000,
      maxSize: 10000000,
      routes: [{
        path: '/files',
        method: 'post',
      }]
    } as FileSizeValidatorConfig
  )

  runner.registerLoggers();
  runner.start();
})();

// (async () => {
//   const runner = new Runner();
//   runner.registerDataPersister({
//      "type": "mariadb",
//      "host": "127.0.0.1",
//      "port": 3306,
//      "username": "root",
//      "database": "files",
//      "password": "my-secret-pw"
// });
//   await runner.registerFilePersister({ }, AWSS3FilePersister);
//   runner.registerControllers();
//   runner.registerEntrypoints({ port: 3000, validators:[]});
//   runner.registerLoggers();
//   runner.start();
// })();
