import { emptyDecodedResult } from './url.mocks'
import { decodeUrlParams, encodeUrlQuery } from '../url'

describe('url#decodeAutocomplete', () => {
  test('decodes autocompleteSelected correctly', () => {
    const expectedResult = {
      ...emptyDecodedResult,
      autocompleteSelected: [
        { type: 'platform', value: 'aqua' },
        { type: 'platform', value: 'terra' },
        { type: 'instrument', value: 'modis' }
      ]
    }
    expect(decodeUrlParams('?as[platform][0]=aqua&as[platform][1]=terra&as[instrument][0]=modis')).toEqual(expectedResult)
  })
})

describe('url#encodeAutocomplete', () => {
  test('does not encode the value if there are no autocomplete selected params', () => {
    const props = {
      autocompleteSelected: [],
      hasGranulesOrCwic: true,
      pathname: '/path/here'
    }
    expect(encodeUrlQuery(props)).toEqual('/path/here')
  })

  test('encodes autocompleteSelected correctly', () => {
    const props = {
      autocompleteSelected: [
        { type: 'platform', value: 'aqua' },
        { type: 'platform', value: 'terra' },
        { type: 'instrument', value: 'modis' }
      ],
      hasGranulesOrCwic: true,
      pathname: '/path/here'
    }
    expect(encodeUrlQuery(props)).toEqual('/path/here?as[platform][0]=aqua&as[platform][1]=terra&as[instrument][0]=modis')
  })
})
