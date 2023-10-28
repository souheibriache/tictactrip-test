import { mock } from 'jest-mock-extended';
import { Request, Response } from 'express';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import getToken from '../app/controllers/token';

describe('getToken', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 Bad Request if email is missing', () => {
    const req = {
      body: {},
    } as Request;

    const res = mock<Response>({
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    });

    getToken(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith('An email is required');
  });

  it('should create the wordCounts.json file if it does not exist', () => {
    jest.spyOn(fs, 'readFileSync').mockImplementation(() => {
      throw { code: 'ENOENT' };
    });

    const writeFileSyncMock = jest.spyOn(fs, 'writeFileSync');

    const req = {
      body: {
        userInput: {
          email: 'test@example.com',
        },
      },
    } as Request;

    const res = mock<Response>();

    getToken(req, res);

    expect(writeFileSyncMock).toHaveBeenCalledWith(
      'wordCounts.json',
      JSON.stringify({})
    );
  });

  it('should load existing user data from wordCounts.json', () => {
    const existingUserData = {
      'test@example.com': {
        count: 100,
        timestamp: null,
      },
    };

    jest.spyOn(fs, 'readFileSync').mockReturnValue(
      JSON.stringify(existingUserData)
    );

    const req = {
      body: {
        userInput: {
          email: 'test@example.com',
        },
      },
    } as Request;

    const res = mock<Response>();

    getToken(req, res);

    expect(res.json).toHaveBeenCalledWith({ token: expect.any(String) });
  });

  it('should not overwrite existing user data if email already exists', () => {
    const existingUserData = {
      'test@example.com': {
        count: 100,
        timestamp: null,
      },
    };

    jest.spyOn(fs, 'readFileSync').mockReturnValue(
      JSON.stringify(existingUserData)
    );

    const writeFileSyncMock = jest.spyOn(fs, 'writeFileSync');

    const req = {
      body: {
        userInput: {
          email: 'test@example.com',
        },
      },
    } as Request;

    const res = mock<Response>();

    getToken(req, res);

    expect(writeFileSyncMock).not.toHaveBeenCalled();
  });

  it('should add email to user data if it does not exist', () => {
    const existingUserData = {
      'another@example.com': {
        count: 200,
        timestamp: null,
      },
    };

    jest.spyOn(fs, 'readFileSync').mockReturnValue(
      JSON.stringify(existingUserData)
    );

    const writeFileSyncMock = jest.spyOn(fs, 'writeFileSync');

    const req = {
      body: {
        userInput: {
          email: 'test@example.com',
        },
      },
    } as Request;

    const res = mock<Response>();

    getToken(req, res);

    expect(writeFileSyncMock).toHaveBeenCalledWith(
      'wordCounts.json',
      JSON.stringify({
        ...existingUserData,
        'test@example.com': {
          count: 0,
          timestamp: null,
        },
      })
    );
  });

  it('should log an error if fs.writeFileSync throws an error', () => {
    jest.spyOn(fs, 'readFileSync').mockReturnValue('{}');
    jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {
      throw new Error('Write error');
    });

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    const req = {
      body: {
        userInput: {
          email: 'test@example.com',
        },
      },
    } as Request;

    const res = mock<Response>();

    getToken(req, res);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error writing users.json:',
      expect.any(Error)
    );
  });

  it('should generate a token and send it in the response', () => {
    const existingUserData = {
      'test@example.com': {
        count: 100,
        timestamp: null,
      },
    };

    jest.spyOn(fs, 'readFileSync').mockReturnValue(
      JSON.stringify(existingUserData)
    );

    const signMock = jest.spyOn(jwt, 'sign').mockReturnValue();

    const req = {
      body: {
        userInput: {
          email: 'test@example.com',
        },
      },
    } as Request;

    const res = mock<Response>({
      json: jest.fn(),
    });

    getToken(req, res);

    expect(res.json).toHaveBeenCalledWith({ token: 'test-token' });
  })
})