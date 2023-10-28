import justify from '../app/controllers/justify'
import { mock } from 'jest-mock-extended';
import { Response } from 'express';

describe('justify', () => {
  it('should return justified text if word count does not exceed limit', () => {
    const req = {
      body: {
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      },
      email: 'test@example.com',
    };

    const res = {
      send: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response;

    justify(req, res);

    expect(res.send).toHaveBeenCalledWith(
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
    );
  });

  it('should return 402 Payment Required if word count exceeds limit', () => {
    const req = {
      body: {
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      },
      email: 'test@example.com',
    };

    const res = {
      send: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response;

    // Set the word count limit to a low value for testing purposes
    const originalWordCountLimit = process.env.WORD_COUNT_LIMIT;
    process.env.WORD_COUNT_LIMIT = '10';
    console.log(process.env.WORD_COUNT_LIMIT)
    justify(req, res);

    expect(res.status).toHaveBeenCalledWith(402);
    expect(res.send).toHaveBeenCalledWith('Payment Required');

    // Restore the original word count limit
    process.env.WORD_COUNT_LIMIT = originalWordCountLimit;
  });

});