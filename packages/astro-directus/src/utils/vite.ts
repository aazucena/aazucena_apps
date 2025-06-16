import type { ClientConfig } from "../types";
import serialize from 'serialize-javascript';
import { upperFirst } from 'lodash-es';

const generateRetrieveExtensions = (config: ClientConfig) => {
  const hasAccessTokens = generateHasAccessTokens(config);
  const { 
      authentication, 
      websocket,
      graphql,
    } = config;
  return () => {
    const extensions: string[] = [];
    if (graphql && graphql.enabled) {
      extensions.push('graphql')
    }
    if (websocket && websocket.enabled) {
      extensions.push('realtime')
    }
    if (authentication && authentication.enabled) {
      extensions.push('authentication')
    }
    if (hasAccessTokens) {
      extensions.push('staticToken');
    }
    return extensions
  }
}

const generateHasAccessTokens = (config: ClientConfig) => {
  const { accessToken, accessTokens } = config;
  return !!accessTokens && Object.keys(accessTokens).length > 0  || accessToken && typeof accessToken === 'string';
}

const generateGetAccessToken = (config: ClientConfig) => {
  return (name?: string) => {
    if (!name) {
      return config.accessToken;
    }
    const token = config.accessTokens?.[name];
    if (token) {
      return token;
    }
    return null;
  }
}

const generateBuildClientVariable = (config: ClientConfig) => {
  const { 
    url, 
    authentication, 
    websocket,
    graphql,
    accessToken,
    accessTokens,
    config: restConfig,
    ...options
  } = config;
  const hasAccessTokens = generateHasAccessTokens(config);
  const getAccessToken = generateGetAccessToken(config);
  const extensions = generateRetrieveExtensions(config)();
  const retrieveVariableName = generateRetrieveClientVariableName(config);
  return (name: string = "") => {
    let clientScript = `createDirectus(${serialize(url)}${options ? ", "+ JSON.stringify(options) : ''})`;
    const variable = retrieveVariableName(name);
    let client = `export const ${variable} = ${clientScript}`
    const token = name ? getAccessToken(name) : getAccessToken();
    if (hasAccessTokens && token) {
      client += `.with(staticToken(${serialize(token)}))`;
    }
    if (name === 'websocket') {
      const { config } = websocket!;
      client += `.with(realtime(${config ? JSON.stringify(config) : ''}))`;
    } else if (name === 'authentication') {
      const { mode, config } = authentication!;
      if (mode) {
        client += `.with(authentication(${serialize(mode)}${config ? ", "+ JSON.stringify(config) : ""}))`;
      }
      client += `.with(rest(${restConfig ? JSON.stringify(restConfig) : ''}))`;
    } else {
      if (extensions.includes('graphql')) {
        const { config } = graphql!
        client += `.with(graphql(${config ? JSON.stringify(config) : ''}))`;
      }
      client += `.with(rest(${restConfig ? JSON.stringify(restConfig) : ''}))`;
    }
    return client;
  }
}

const generateRetrieveClientVariableName = (config: ClientConfig) => {
  return (name: string = "") => {
    let varId = upperFirst(name === 'authentication' ? "auth" : name);
    let variable = `directus${varId}Client`;
    return variable
  }
}

const generateRetrieveClientVariableNames = (config: ClientConfig) => {
  const { 
    authentication, 
    websocket,
    accessTokens,
  } = config;
  const retrieveName = generateRetrieveClientVariableName(config);
  return () => {
    
    const names: string[] = [];
    names.push(retrieveName());
    if (authentication && authentication.enabled) {
      names.push(retrieveName('authentication'));
    }
    if (websocket && websocket.enabled) {
      names.push(retrieveName('websocket'));
    }
    if (accessTokens && Object.keys(accessTokens).length > 0) {
      const tokens = Object.keys(accessTokens)
        .filter((name) => !['authentication', 'websocket'].includes(name))
      for (const name of tokens) {
        names.push(retrieveName(name));
      }
    }
    return names;
  }
  
}

const generateBuildClientVariables = (config: ClientConfig) => {
  const { 
    authentication, 
    websocket,
    accessTokens,
  } = config;
  const buildClient = generateBuildClientVariable(config);
  return () => {
    const clients: string[] = [];
    clients.push(buildClient() + `;`);
    if (authentication && authentication.enabled) {
      clients.push(buildClient('authentication') + `;`);
    }
    if (websocket && websocket.enabled) {
      clients.push(buildClient('websocket') + `;`);
    }
    if (accessTokens && Object.keys(accessTokens).length > 0) {
      const tokens = Object.keys(accessTokens)
        .filter((name) => !['authentication', 'websocket'].includes(name))
      for (const name of tokens) {
        clients.push(buildClient(name)+';');
      }
    }
    return clients;
  }
}

const generateRetrieveScriptImports = (config: ClientConfig) => {
  const retrieveExtensions = generateRetrieveExtensions(config);
  return () => {
    const extensions = retrieveExtensions();
    const imports = [
      'createDirectus',
      'rest'
    ];
    if (extensions.length > 0) {
      imports.push(...extensions)
    }
    return imports;
  }
}

const generateBuildPluginScript = (config: ClientConfig) => {
  const retrieveImports = generateRetrieveScriptImports(config);
  const buildClients = generateBuildClientVariables(config);
  return () => {
    const imports = retrieveImports();
    const script = [
      ``,
      `import { ${imports.join(', ')} } from '@directus/sdk';`
    ];
    const clients = buildClients();
    if (clients.length > 0) {
      script.push(...clients);
    }
    const result = script.join('\n');
    return result;

  }
}
const generateBuildIntegrationScript = (config: ClientConfig) => {
  const retrieveNames = generateRetrieveClientVariableNames(config);
  return () => {
    const imports = retrieveNames();
    const script = [
      `import { ${imports.join(', ')} } from 'directus:client';`      
    ]
    for (const _import of imports) {
      script.push(`globalThis.${_import} = ${_import};`)
    }

    const result = script.join('\n');
    return result;
  }
}


const initVite = (config: ClientConfig) => {
  return {
    retrieveExtensions: generateRetrieveExtensions(config),
    retrieveScriptImports: generateRetrieveScriptImports(config),
    hasAccessTokens: generateHasAccessTokens(config),
    getAccessToken: generateGetAccessToken(config),
    buildClient: generateBuildClientVariable(config),
    buildClients: generateBuildClientVariables(config),
    buildPluginScript: generateBuildPluginScript(config),
    buildIntegrationScript: generateBuildIntegrationScript(config),
  }
}

export default initVite