import jwt from 'jsonwebtoken';
import { Response } from 'express';
import authenticateToken from '../app/middleware/auth';
import { mock } from 'jest-mock-extended';
import getToken from '../app/controllers/token';

describe('authenticateToken middleware', () => {
  it('should call next() if token is valid', () => {
    const req:any = {
      headers: {
        authorization: 'Bearer validToken',
      },
    };

    const res = mock<Response>();
    const next = jest.fn();

    jwt.verify = jest.fn().mockImplementation((token, secret, callback) => {
      callback(null, 'test@example.com');
    });

    authenticateToken(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.email).toBe('test@example.com');
  });

  it('should return 401 Unauthorized if token is missing', () => {
    const req = {
      headers: {},
    };

    const res = mock<Response>();
    const next = jest.fn();

    authenticateToken(req, res, next);

    expect(res.sendStatus).toHaveBeenCalledWith(401);
  });

  it('should return 403 Forbidden if token is invalid', () => {
    const req = {
      headers: {
        authorization: 'Bearer invalidToken',
      },
    };

    const res = mock<Response>();
    const next = jest.fn();

    jwt.verify = jest.fn().mockImplementation((token, secret, callback) => {
      callback(new Error('Invalid token'));
    });

    authenticateToken(req, res, next);

    expect(res.sendStatus).toHaveBeenCalledWith(403);
  });

  it('should return 400 Bad Request if email is missing', () => {
    const req :any = {
      body: {},
    } as Request;

    const res = mock<Response>({
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    })  as unknown as Response;

    getToken(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith('An email is required');
  });
});