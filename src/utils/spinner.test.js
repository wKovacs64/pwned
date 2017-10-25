import spinner from './spinner';

describe('util: spinner', () => {
  it('should return an object with "start" and "stop" functions', () => {
    expect(spinner).toEqual(
      expect.objectContaining({
        start: expect.any(Function),
        stop: expect.any(Function),
      }),
    );
  });
});
