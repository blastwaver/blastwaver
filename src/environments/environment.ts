// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyBaeb9jFqbZcJ2WO6L_YfTOD7gvgodF3VE",
    authDomain: "ng-auth-18cab.firebaseapp.com",
    databaseURL: "https://ng-auth-18cab.firebaseio.com",
    projectId: "ng-auth-18cab",
    storageBucket: "ng-auth-18cab.appspot.com",
    messagingSenderId: "853684605083"
  }
};
