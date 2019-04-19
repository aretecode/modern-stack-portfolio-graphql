import { resolve } from 'path'
import {
  dbAbsolutePath,
  mkdirpAsync,
  existsAsync,
  // covered by json
  readFileAsync,
  writeFileAsync,
  //
  readFileAsyncJson,
  writeFileAsyncJson,
  ensureFile,
  deleteAsync,
} from '../fs'

const TEST_DIR = resolve(__dirname, './__fixture__')
const TEST_FILE_PATH = resolve(__dirname, './__fixture__/test.json')

describe('storage/fs', () => {
  it('should make dir', async () => {
    // initially not there
    // currently ignoring this
    // expect(await existsAsync(TEST_DIR)).toBe(false)

    // create it
    await mkdirpAsync(TEST_DIR)
    expect(await existsAsync(TEST_DIR)).toBe(true)

    // delete it
    try {
      await deleteAsync(TEST_DIR)
      expect(await existsAsync(TEST_DIR)).toBe(false)
    } catch (unlinkError) {
      // we will ignore this since it's unused currently
      // if we want more support, we'll use a lib, such as jet-fs, or trash
    }

    // ensure file
    expect(await existsAsync(TEST_FILE_PATH)).toBe(false)
    await ensureFile(TEST_FILE_PATH)
    expect(await existsAsync(TEST_FILE_PATH)).toBe(true)

    // write a test file
    await writeFileAsyncJson(TEST_FILE_PATH, { eh: 'canada' })
    const testObjFromFile = await readFileAsyncJson(TEST_FILE_PATH)
    expect(testObjFromFile.eh).toBe('canada')

    // default db
    const mockDb = await readFileAsyncJson(dbAbsolutePath)
    expect(typeof mockDb === 'object').toBe(true)

    // could put in setup
    try {
      await deleteAsync(TEST_FILE_PATH)
      // await deleteAsync(TEST_DIR)
    } catch (unlinkError) {
      // see above
    }
  })
})
