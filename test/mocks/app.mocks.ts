/* eslint @typescript-eslint/no-unused-vars: 0 */

export const queryBuilderMock = {
  where: jest.fn().mockReturnThis(),
  getMany: jest.fn(),
  getOne: jest.fn(),
  take: jest.fn().mockReturnThis(),
  skip: jest.fn().mockReturnThis(),
  orWhere: jest.fn().mockReturnThis(),
  innerJoinAndSelect: jest.fn().mockReturnThis(),
  leftJoinAndSelect: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
  andWhere: jest.fn().mockReturnThis(),
  getManyAndCount: jest.fn(),
};

export const entityManagerMock = {
  save: jest.fn(),
  remove: jest.fn(),
  create: jest.fn(),
  findOne: jest.fn(),
  find: jest.fn(),
  createQueryBuilder: jest.fn(() => queryBuilderMock),
};

// For mocking the DB, you can use { provide: DataSource, useValue: DatasourceMock } in your test module, you can then assert the methods of the mock entity manager or query builder directly (expect(entityManagerMock.save).toHaveBeenCalled();)
export const DatasourceMock = {
  manager: entityManagerMock,
};

export const AppServiceMock = {
  getVersion: jest.fn().mockReturnValue('1.0.0'),
};

export const classesMock = {
  user: {
    email: 'test@mock.com',
    user_id: 'id',
    username: 'test',
    user_metadata: {
      first_name: 'John',
      last_name: 'Doe',
    },
  },
};

export const mockFactory = (target: string, props: Record<string, unknown>) => {
  const mockedEntity = classesMock[target] ?? {};
  return { ...mockedEntity, ...props };
};

export const AuthServiceMock = {
  login: jest.fn(),
  logout: jest.fn(),
  validateUserSession: jest.fn(),
  setSession: jest.fn(),
  getSession: jest.fn(),
  getSessionId: jest.fn(),
};

export const Auth0ServiceMock = {
  getUserTokens: jest.fn(),
  refreshTokens: jest.fn(),
  getUser: jest.fn(),
};

export const CacheMock = {
  set: jest.fn(),
  get: jest.fn(),
  del: jest.fn(),
};

export const Auth0ManagementApiMock = {
  users: {
    get: jest.fn(),
  },
};

export const Auth0TokenSetMock = {
  access_token: 'access_token',
  id_token: 'id_token',
  refresh_token: 'refresh_token',
  expires_in: 3600,
};

export const Auth0AuthenticationApiMock = {
  oauth: {
    passwordGrant: jest.fn(),
    refreshTokenGrant: jest.fn(),
  },
};
