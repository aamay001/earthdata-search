import nock from 'nock'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import {
  onAutocompleteLoading,
  onAutocompleteLoaded,
  clearAutocompleteSuggestions,
  updateAutocompleteSuggestions,
  updateAutocompleteSelected,
  deleteAutocompleteValue,
  fetchAutocomplete,
  selectAutocompleteSuggestion,
  removeAutocompleteValue,
  clearAutocompleteSelected
} from '../autocomplete'
import {
  LOADING_AUTOCOMPLETE,
  LOADED_AUTOCOMPLETE,
  CLEAR_AUTOCOMPLETE_SUGGESTIONS,
  UPDATE_AUTOCOMPLETE_SUGGESTIONS,
  UPDATE_AUTOCOMPLETE_SELECTED,
  DELETE_AUTOCOMPLETE_VALUE,
  CLEAR_AUTOCOMPLETE_SELECTED,
  ADD_CMR_FACET,
  REMOVE_CMR_FACET
} from '../../constants/actionTypes'
import actions from '..'

const mockStore = configureMockStore([thunk])

beforeEach(() => {
  jest.clearAllMocks()
})

describe('onAutocompleteLoading', () => {
  test('should create an action to update the store', () => {
    const expectedAction = {
      type: LOADING_AUTOCOMPLETE
    }
    expect(onAutocompleteLoading()).toEqual(expectedAction)
  })
})

describe('onAutocompleteLoaded', () => {
  test('should create an action to update the store', () => {
    const payload = { loaded: true }
    const expectedAction = {
      type: LOADED_AUTOCOMPLETE,
      payload
    }
    expect(onAutocompleteLoaded(payload)).toEqual(expectedAction)
  })
})

describe('clearAutocompleteSelected', () => {
  test('should create an action to update the store', () => {
    const expectedAction = {
      type: CLEAR_AUTOCOMPLETE_SELECTED
    }
    expect(clearAutocompleteSelected()).toEqual(expectedAction)
  })
})

describe('clearAutocompleteSuggestions', () => {
  test('should create an action to update the store', () => {
    const expectedAction = {
      type: CLEAR_AUTOCOMPLETE_SUGGESTIONS
    }
    expect(clearAutocompleteSuggestions()).toEqual(expectedAction)
  })
})

describe('updateAutocompleteSuggestions', () => {
  test('should create an action to update the store', () => {
    const payload = [{
      type: 'mock_type',
      value: 'mock value'
    }]
    const expectedAction = {
      type: UPDATE_AUTOCOMPLETE_SUGGESTIONS,
      payload
    }
    expect(updateAutocompleteSuggestions(payload)).toEqual(expectedAction)
  })
})

describe('updateAutocompleteSelected', () => {
  test('should create an action to update the search query', () => {
    const payload = {
      type: 'mock_type',
      value: 'mock value'
    }
    const expectedAction = {
      type: UPDATE_AUTOCOMPLETE_SELECTED,
      payload
    }
    expect(updateAutocompleteSelected(payload)).toEqual(expectedAction)
  })
})

describe('deleteAutocompleteValue', () => {
  test('should create an action to update the search query', () => {
    const payload = {
      type: 'mock_type',
      value: 'mock value'
    }
    const expectedAction = {
      type: DELETE_AUTOCOMPLETE_VALUE,
      payload
    }
    expect(deleteAutocompleteValue(payload)).toEqual(expectedAction)
  })
})

describe('fetchAutocomplete', () => {
  test('calls lambda to get autocomplete suggestions', async () => {
    nock(/localhost/)
      .post(/autocomplete/)
      .reply(200, {
        feed: {
          entry: [{
            type: 'mock_type',
            value: 'mock value'
          }]
        }
      })

    // mockStore with initialState
    const store = mockStore({
      authToken: ''
    })

    // call the dispatch
    await store.dispatch(fetchAutocomplete({ value: 'test value' })).then(() => {
      const storeActions = store.getActions()
      expect(storeActions[0]).toEqual({ type: LOADING_AUTOCOMPLETE })
      expect(storeActions[1]).toEqual({
        type: LOADED_AUTOCOMPLETE,
        payload: { loaded: true }
      })
      expect(storeActions[2]).toEqual({
        type: UPDATE_AUTOCOMPLETE_SUGGESTIONS,
        payload: {
          suggestions: [{
            type: 'mock_type',
            value: 'mock value'
          }]
        }
      })
    })
  })

  test('does not call updateAutocompleteSuggestions on error', async () => {
    nock(/localhost/)
      .post(/autocomplete/)
      .reply(500)

    nock(/localhost/)
      .post(/error_logger/)
      .reply(200)

    const store = mockStore({
      authToken: ''
    })

    const consoleMock = jest.spyOn(console, 'error').mockImplementation(() => jest.fn())

    await store.dispatch(fetchAutocomplete({ value: 'test value' })).then(() => {
      const storeActions = store.getActions()
      expect(storeActions[0]).toEqual({ type: LOADING_AUTOCOMPLETE })
      expect(storeActions[1]).toEqual({
        type: LOADED_AUTOCOMPLETE,
        payload: { loaded: false }
      })
      expect(consoleMock).toHaveBeenCalledTimes(1)
    })
  })
})

describe('selectAutocompleteSuggestion', () => {
  test('calls updateAutocompleteSelected and changeQuery', () => {
    const changeQueryMock = jest.spyOn(actions, 'changeQuery')
    changeQueryMock.mockImplementation(() => jest.fn())

    const store = mockStore({})

    const data = {
      suggestion: {
        type: 'instrument',
        value: 'mock value'
      }
    }

    store.dispatch(selectAutocompleteSuggestion(data))

    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual({
      type: ADD_CMR_FACET,
      payload: {
        instrument_h: 'mock value'
      }
    })
    expect(storeActions[1]).toEqual({
      type: UPDATE_AUTOCOMPLETE_SELECTED,
      payload: data
    })

    // was getCollections called
    expect(changeQueryMock).toHaveBeenCalledTimes(1)
    expect(changeQueryMock).toHaveBeenCalledWith({ collection: { pageNum: 1, keyword: '' } })
  })
})

describe('removeAutocompleteValue', () => {
  test('calls deleteAutocompleteValue and getCollections', () => {
    const getCollectionsMock = jest.spyOn(actions, 'getCollections')
    getCollectionsMock.mockImplementation(() => jest.fn())

    const store = mockStore({})

    const data = {
      type: 'instrument',
      value: 'mock value'
    }

    store.dispatch(removeAutocompleteValue(data))

    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual({
      type: REMOVE_CMR_FACET,
      payload: {
        instrument_h: 'mock value'
      }
    })
    expect(storeActions[1]).toEqual({
      type: DELETE_AUTOCOMPLETE_VALUE,
      payload: data
    })

    // was getCollections called
    expect(getCollectionsMock).toHaveBeenCalledTimes(1)
  })
})
