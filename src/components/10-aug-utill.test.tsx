import { getLocalMFEDetails, getServiceURL, getConfig, setConfig, getPegaServiceHost, setPegaServiceHost, MFE_DEV_TEST_IDENTIFIERS } from './file';

jest.mock('process.env', () => ({
  LOCAL_SERVICE_HOST: 'http://localhost:3001',
  APACHE_PATH: '/path',
  LOCAL_MFE_DEV_TEST_IDENTIFIER: 'test-identifier',
}));

describe('getLocalMFEDetails', () => {
  it('should return the correct details', () => {
    const result = getLocalMFEDetails();
    expect(result).toEqual([
      {
        url: 'http://localhost:3001/path/',
        enabled: true,
        name: 'dq-remote',
        serviceHost: 'http://localhost:3001',
      },
    ]);
  });
});

describe('getServiceURL', () => {
  it('should return the correct service URL', () => {
    const mockLocation = { origin: 'http://localhost:3000', hostname: 'localhost' };
    const mockWindowLocation = jest.spyOn(window, 'location', 'get').mockReturnValue(mockLocation);
    const result = getServiceURL();
    expect(result).toEqual('http://localhost:3001/path/');
    mockWindowLocation.mockRestore();
  });

  it('should return the correct service URL with APACHE_PATH', () => {
    const mockLocation = { origin: 'http://localhost:3000', hostname: 'localhost' };
    const mockWindowLocation = jest.spyOn(window, 'location', 'get').mockReturnValue(mockLocation);
    process.env.APACHE_PATH = '/path2';
    const result = getServiceURL();
    expect(result).toEqual('http://localhost:3001/path2/');
    mockWindowLocation.mockRestore();
  });

  it('should return the correct service URL with a custom service host', () => {
    const mockLocation = { origin: 'http://localhost:3000', hostname: 'localhost' };
    const mockWindowLocation = jest.spyOn(window, 'location', 'get').mockReturnValue(mockLocation);
    const result = getServiceURL('http://localhost:3002');
    expect(result).toEqual('http://localhost:3002/path/');
    mockWindowLocation.mockRestore();
  });
});

describe('getConfig', () => {
  it('should return the appConfig object', () => {
    const mockConfig = { key: 'value' };
    setConfig(mockConfig);
    const result = getConfig();
    expect(result).toEqual(mockConfig);
  });

  it('should return undefined if appConfig is not set', () => {
    const result = getConfig();
    expect(result).toBeUndefined();
  });
});

describe('getPegaServiceHost', () => {
  it('should return the pegaServiceHost value', () => {
    const mockPegaServiceHost = 'http://localhost:3003';
    setPegaServiceHost(mockPegaServiceHost);
    const result = getPegaServiceHost();
    expect(result).toEqual(mockPegaServiceHost);
  });

  it('should return the origin value if pegaServiceHost is not set', () => {
    const mockLocation = { origin: 'http://localhost:3000' };
    const mockWindowLocation = jest.spyOn(window, 'location', 'get').mockReturnValue(mockLocation);
    const result = getPegaServiceHost();
    expect(result).toEqual(mockLocation.origin);
    mockWindowLocation.mockRestore();
  });
});

describe('MFE_DEV_TEST_IDENTIFIERS', () => {
  it('should return the correct mfeTestRoutePathPrefix and mfeTestNavItemSuffix', () => {
    const result = M
