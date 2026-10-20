export class ApiConfigurationError extends Error {}

// Only the API consumes this configuration. Never include input values in errors.
export function readApiConfig(env: NodeJS.ProcessEnv): { port: number } {
  const mode = env.NODE_ENV ?? 'development';
  if (!['development', 'test', 'production'].includes(mode)) {
    throw new ApiConfigurationError('Invalid API configuration: NODE_ENV.');
  }

  const value = env.PORT;
  if (value === undefined) {
    if (mode === 'production') {
      throw new ApiConfigurationError('Missing API configuration: PORT.');
    }
    return { port: 3002 };
  }

  if (!/^[1-9][0-9]{0,4}$/.test(value) || Number(value) > 65535) {
    throw new ApiConfigurationError('Invalid API configuration: PORT.');
  }
  return { port: Number(value) };
}
