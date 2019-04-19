/**
 * @todo keep in sync with react by generating typings & having 1 source of truth
 */
export interface BasicLocation {
  address: string
  postalCode: string
  city: string
  countryCode: string
  region: string
}

export interface Profile {
  network: string
  username: string
  url: string
}

/** in jsonresume, is phone (insteadof telephone) & address is in .location */
export interface Basics extends BasicLocation {
  name: string
  label: string
  picture: string
  email: string

  telephone: string
  website: string
  summary: string
  profiles: Profile[]

  skills: string[]
  resumeWebsite: string
}

export interface Work {
  company: string
  position: string
  website: string
  startDate: string
  endDate: string
  summary: string
  highlights: string[]
}

export interface Resume {
  basics: Basics
  work: Work[]
}

export interface ResumeIndexedResponse {
  resume: Required<Resume>
}
