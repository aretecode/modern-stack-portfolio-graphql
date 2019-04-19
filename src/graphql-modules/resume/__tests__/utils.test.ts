import 'jest'
import { isValidResponse } from '../utils'

/**
 * we may want to validate without top level key, or check 2 types
 */
const MOCK_RESUME_OBJ = {
  basics: {
    name: '',
    label: '',
    picture: '',
    email: '',
    telephone: '',
    website: '',
    summary: '',
    profiles: [],
    address: '',
    postalCode: '',
    city: '',
    countryCode: '',
    region: '',
    resumeWebsite: '',
    skills: [],
  },
  work: [],
}
const MOCK_VALID_RESPONSE = {
  resume: MOCK_RESUME_OBJ,
}

describe('resume/utils', () => {
  it('should identify a valid response', () => {
    expect(isValidResponse(MOCK_VALID_RESPONSE)).toBe(true)
    expect(isValidResponse(MOCK_RESUME_OBJ)).toBe(true)
  })
  it('should not pass for false positives', () => {
    const LIST_OF_INVALID_RESPONSES = [
      { work: [] },
      { work: [], basics: {} },
      { resume: null },
      { resume: {} },
      { resume: { work: [] } },
      { resume: { work: [], basics: {} } },
    ] as any[]

    const LIST_OF_VALIDATED_RESPONSES = LIST_OF_INVALID_RESPONSES.map(
      isValidResponse
    )

    expect(
      LIST_OF_VALIDATED_RESPONSES.every(validation => validation === false)
    ).toBe(true)
  })
})
