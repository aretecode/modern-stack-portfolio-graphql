import { FireBaseStore } from '../firebase'

describe('firebase', () => {
  it('should be able to create an instance without an error', () => {
    expect(() => new FireBaseStore()).not.toThrow()
  })
  it.skip('should work in sandbox mode', () => {
    // @todo
  })
  it.skip('should use redis', () => {
    // @todo
  })
})
