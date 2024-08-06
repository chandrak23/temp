import { getLocalMFEDetails, getServiceURL, getConfig, setConfig, getPegaServiceHost, setPegaServiceHost, MFE_DEV_TEST_IDENTIFIERS } from './config';

describe('config', () => {
  beforeEach(() => {
    delete process.env.LOCAL_MFE_DEV_TEST_IDENTIFIER;
    delete process.env.LOCAL_SERVICE_HOST;
    delete process.env.APACHE_PATH;
  });

  it('getLocalMFEDetails returns an array with expected properties', () => {
    const result = getLocalMFEDetails();
    expect(result).toBeInstanceOf(Array);
    expect(result[0]).toHaveProperty('url');
    expect(result[0]).toHaveProperty('enabled');
    expect(result[0]).toHaveProperty('name');
    expect(result[0]).toHaveProperty('serviceHost');
  });

  it('getServiceURL returns serviceHostUrl when serviceHost is provided', () => {
    const serviceHost = 'https://example.com';
    const result = getServiceURL(serviceHost);
    expect(result).toBe(`${serviceHost}/`);
  });

  it('getServiceURL returns serviceHostUrl with APACHE_PATH when serviceHost and APACHE_PATH are provided', () => {
    const serviceHost = 'https://example.com';
    process.env.APACHE_PATH = 'path/to/apache';
    const result = getServiceURL(serviceHost);
    expect(result).toBe(`${serviceHost}/${process.env.APACHE_PATH}`);
  });

  it('getServiceURL returns origin when serviceHost is not provided and hostname is localhost', () => {
    const origin = 'https://localhost:3000';
    Object.defineProperty(window, 'location', {
      value: {
        origin,
        hostname: 'localhost',
      },
    });
    const result = getServiceURL();
    expect(result).toBe(origin);
  });

  it('getConfig returns appConfig', () => {
    const config = { foo: 'bar' };
    setConfig(config);
    const result = getConfig();
    expect(result).toBe(config);
  });

  it('setConfig sets appConfig', () => {
    const config = { foo: 'bar' };
    setConfig(config);
    expect(getConfig()).toBe(config);
  });

  it('getPegaServiceHost returns pegaServiceHost', () => {
    const serviceHost = 'https://example.com';
    setPegaServiceHost(serviceHost);
    const result = getPegaServiceHost();
    expect(result).toBe(serviceHost);
  });

  it('setPegaServiceHost sets pegaServiceHost', () => {
    const serviceHost = 'https://example.com';
    setPegaServiceHost(serviceHost);
    expect(getPegaServiceHost()).toBe(serviceHost);
  });

  it('MFE_DEV_TEST_IDENTIFIERS returns expected object', () => {
    const result = MFE_DEV_TEST_IDENTIFIERS;
    expect(result).toHaveProperty('mfeTestRoutePathPrefix');
    expect(result).toHaveProperty('mfeTestNavItemSuffix');
  });

  it('MFE_DEV_TEST_IDENTIFIERS returns expected values when LOCAL_MFE_DEV_TEST_IDENTIFIER is set', () => {
    process.env.LOCAL_MFE_DEV_TEST_IDENTIFIER = 'test-identifier';
    const result = MFE_DEV_TEST_IDENTIFIERS;
    expect(result.mfeTestRoutePathPrefix).toBe('*/test-identifier');
    expect(result.mfeTestNavItemSuffix).toBe(' test-identifier');
  });
});
