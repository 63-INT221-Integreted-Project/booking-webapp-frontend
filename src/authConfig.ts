import { LogLevel, PublicClientApplication } from '@azure/msal-browser';
import {
  UserAgentApplication,
  AuthenticationParameters,
  Configuration,
} from "@azure/msal";

const config: Configuration = {
  auth: {
    clientId: '4c791376-4828-4a7d-8f75-507a29faebdf',
    authority: 'https://login.microsoftonline.com/6f4432dc-20d2-441d-b1db-ac3380ba633d',
    redirectUri: 'https://intproj21.sit.kmutt.ac.th/kp2/azure',
  },
};

export const params: AuthenticationParameters = {
  authority: 'https://login.microsoftonline.com/6f4432dc-20d2-441d-b1db-ac3380ba633d',
  scopes: [`api://4c791376-4828-4a7d-8f75-507a29faebdf/access_as_user`], 
};

export const msalConfig = {
  auth: {
    clientId: '4c791376-4828-4a7d-8f75-507a29faebdf',
    authority: 'https://login.microsoftonline.com/6f4432dc-20d2-441d-b1db-ac3380ba633d',
    redirectUri: 'https://intproj21.sit.kmutt.ac.th/kp2/azure', // Must be registered as a SPA redirectURI on your app registration
    postLogoutRedirectUri: '/' // Must be registered as a SPA redirectURI on your app registration
  },
  cache: {
    cacheLocation: 'localStorage'
  },
  system: {
      loggerOptions: {
          loggerCallback: (level: LogLevel, message: string, containsPii: boolean) => {
              if (containsPii) {
                  return;
              }
              switch (level) {
                  case LogLevel.Error:
                      console.error(message);
                      return;
                  case LogLevel.Info:
                      console.info(message);
                      return;
                  case LogLevel.Verbose:
                      console.debug(message);
                      return;
                  case LogLevel.Warning:
                      console.warn(message);
                      return;
                  default:
                      return;
              }
          },
          logLevel: LogLevel.Verbose
      }
  }
};

export const msalInstance = new PublicClientApplication(msalConfig);

export const loginRequest = {
  scopes: ['User.Read'],
};

export const graphConfig = {
  graphMeEndpoint: 'https://graph.microsoft.com',
};

export const myMSAL = new UserAgentApplication(config);