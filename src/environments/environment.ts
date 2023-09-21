// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  clientId: "7a30d32f-9dd1-4dbe-afa1-95ac9481fed9",
  clientSecret: "dcdbfb63-b0fa-4990-8206-691a2bb74739",
  oAuthTokenUrl: "http://localhost:8080/oauth/token",
  usuariosUrl: "http://localhost:8080/v1/usuarios"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
