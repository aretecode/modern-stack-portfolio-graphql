import 'reflect-metadata'
import gql from 'graphql-tag'
import { execute } from 'graphql'
import { resumeModule, ResumeAPI } from '../'
import { Resume as ResumeType } from '../typings'

/**
 * @note we are not currently using providers since there is no api to call
 */
describe('ResumeModule', () => {
  it('can read the default resume', async () => {
    const { schema } = resumeModule

    const result = await execute<{ resume: ResumeType }>({
      schema,
      document: gql`
        query {
          resume {
            __typename
            basics {
              __typename
              name
              label
              picture
              email
              telephone
              website
              summary
              address
              postalCode
              city
              countryCode
              region

              resumeWebsite
              skills

              profiles {
                __typename
                network
                username
                url
              }
            }
            work {
              __typename
              company
              position
              website
              startDate
              endDate
              summary
              highlights
              picture
            }
          }
        }
      `,
    })

    expect(result.errors).toBeFalsy()
    expect(typeof result.data.resume.basics.name).toBe('string')
    /**
     * would want to update this when we tweak default data
     */
    expect(result.data.resume.basics.profiles.length).toBe(0)
    expect(result.data.resume.work.length).toBe(0)
  })

  it.skip('can write + read a resume (this will require at least a keyed thing, or multi-tenant)', () => {
    //
  })
})
