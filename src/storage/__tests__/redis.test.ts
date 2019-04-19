import { get, set, has, clear } from '../redis'

describe('storage/redis', () => {
  it('should work as a mock when no env values are provided', async () => {
    expect(await has('@@EMPTY')).toBe(false)
    await set('__example__', true)
    await set('__eh__', { isSaved: true })
    expect(await has('__example__')).toBe(true)
    const eh = await get('__eh__')
    expect(eh.isSaved).toBe(true)
    await clear()
    expect(await has('__example__')).toBe(false)
  })
})
