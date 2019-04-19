import { Resume, ResumeIndexedResponse } from './typings'

/**
 * @todo @@perf @@codeSmell replace with composition & exotic
 */
export function isObj(x: any): x is { [key: string]: any } | any[] {
  return x !== null && typeof x === 'object'
}

export function isValidResponse(
  response: { resume?: Partial<Resume> } | null | undefined
): response is ResumeIndexedResponse {
  return (
    isObj(response) === true &&
    isObj(response.resume) === true &&
    Array.isArray(response.resume.work) &&
    isObj(response.resume.basics) === true &&
    Object.keys(response.resume.basics).length > 0
  )
}
