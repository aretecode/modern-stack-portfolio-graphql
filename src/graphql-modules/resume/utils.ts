import { Resume, ResumeIndexedResponse } from './typings'

/**
 * @todo @@perf @@codeSmell replace with composition & exotic
 */
export function isObj(x: any): x is { [key: string]: any } | any[] {
  return x !== null && typeof x === 'object'
}

export function isValidResumeValue(resume: Partial<Resume>): resume is Resume {
  return (
    isObj(resume) === true &&
    Array.isArray(resume.work) &&
    isObj(resume.basics) === true &&
    Object.keys(resume.basics).length > 0
  )
}

/**
 * @todo I am not sure where it was being indexed with `resume`
 */
export function isValidResponse(
  response: { resume?: Partial<Resume> } | Resume | null | undefined
): response is ResumeIndexedResponse | Resume {
  if (isObj(response) === false) {
    return false
  } else {
    return (
      isValidResumeValue((response as ResumeIndexedResponse).resume) === true ||
      isValidResumeValue(response as Resume) === true
    )
  }
}
