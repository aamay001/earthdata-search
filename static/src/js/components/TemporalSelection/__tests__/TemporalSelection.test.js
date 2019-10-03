import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import moment from 'moment'

import Alert from 'react-bootstrap/Alert'

import TemporalSelection from '../../TemporalSelection/TemporalSelection'
import Datepicker from '../../Datepicker/Datepicker'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    temporal: {},
    controlId: 'test-id',
    onSubmitStart: jest.fn(),
    onSubmitEnd: jest.fn(),
    onInvalid: jest.fn(),
    onValid: jest.fn()
  }

  const enzymeWrapper = shallow(<TemporalSelection {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('TemporalSelection component', () => {
  test('when passed a start date renders DatePicker component correctly', () => {
    const { enzymeWrapper } = setup()
    enzymeWrapper.setProps({
      temporal: {
        startDate: '2019-03-30T00:00:00.000Z'
      }
    })

    expect(enzymeWrapper.find(Datepicker).at(0).prop('type')).toBe('start')
    expect(enzymeWrapper.find(Datepicker).at(0).prop('value')).toBe('2019-03-30T00:00:00.000Z')
    expect(enzymeWrapper.find(Datepicker).at(1).prop('type')).toBe('end')
    expect(enzymeWrapper.find(Datepicker).at(1).prop('value')).toBe('')
  })

  test('when passed a end date renders DatePicker component correctly', () => {
    const { enzymeWrapper } = setup()
    enzymeWrapper.setProps({
      temporal: {
        endDate: '2019-03-30T00:00:00.000Z'
      }
    })

    expect(enzymeWrapper.find(Datepicker).at(0).prop('type')).toBe('start')
    expect(enzymeWrapper.find(Datepicker).at(0).prop('value')).toBe('')
    expect(enzymeWrapper.find(Datepicker).at(1).prop('type')).toBe('end')
    expect(enzymeWrapper.find(Datepicker).at(1).prop('value')).toBe('2019-03-30T00:00:00.000Z')
  })

  test('when passed a both start and end dates renders DatePicker components correctly', () => {
    const { enzymeWrapper } = setup()
    enzymeWrapper.setProps({
      temporal: {
        endDate: '2019-03-30T00:00:00.000Z',
        startDate: '2019-03-29T00:00:00.000Z'
      }
    })

    expect(enzymeWrapper.find(Datepicker).at(0).prop('type')).toBe('start')
    expect(enzymeWrapper.find(Datepicker).at(0).prop('value')).toBe('2019-03-29T00:00:00.000Z')
    expect(enzymeWrapper.find(Datepicker).at(1).prop('type')).toBe('end')
    expect(enzymeWrapper.find(Datepicker).at(1).prop('value')).toBe('2019-03-30T00:00:00.000Z')
  })

  test('when passed a start date after the end date renders DatePicker components correctly', () => {
    const { enzymeWrapper } = setup()
    enzymeWrapper.setProps({
      temporal: {
        endDate: '2019-03-29T00:00:00.000Z',
        startDate: '2019-03-30T00:00:00.000Z'
      }
    })

    expect(enzymeWrapper.find(Datepicker).at(0).prop('type')).toBe('start')
    expect(enzymeWrapper.find(Datepicker).at(0).prop('value')).toBe('2019-03-30T00:00:00.000Z')
    expect(enzymeWrapper.find(Datepicker).at(1).prop('type')).toBe('end')
    expect(enzymeWrapper.find(Datepicker).at(1).prop('value')).toBe('2019-03-29T00:00:00.000Z')
  })

  test('when passed a start date after the end date fires isInvalid', () => {
    const { enzymeWrapper, props } = setup()
    enzymeWrapper.setProps({
      temporal: {
        endDate: '2019-03-29T00:00:00.000Z',
        startDate: '2019-03-30T00:00:00.000Z'
      }
    })

    // expect(enzymeWrapper.find('.temporal-selection-dropdown__button--apply').prop('disabled')).toBe(true)
    expect(props.onInvalid).toBeCalledTimes(1)
  })

  test('when passed a start date before the end date renders Alert correctly', () => {
    const { enzymeWrapper } = setup()
    enzymeWrapper.setProps({
      temporal: {
        endDate: '2019-03-30T00:00:00.000Z',
        startDate: '2019-03-29T00:00:00.000Z'
      }
    })

    expect(enzymeWrapper.find(Alert).at(0).prop('show')).toBe(false)
    expect(enzymeWrapper.find(Alert).at(1).prop('show')).toBe(false)
  })

  test('when passed a start date after the end date renders Alert correctly', () => {
    const { enzymeWrapper } = setup()
    enzymeWrapper.setProps({
      temporal: {
        endDate: '2019-03-29T00:00:00.000Z',
        startDate: '2019-03-30T00:00:00.000Z'
      }
    })

    expect(enzymeWrapper.find(Alert).at(0).prop('show')).toBe(true)
    expect(enzymeWrapper.find(Alert).at(1).prop('show')).toBe(false)
  })

  test('sets the start date correctly when an invalid date is passed', () => {
    const { enzymeWrapper, props } = setup()
    enzymeWrapper.find(Datepicker).at(0).props().onSubmit('2012-01-efss 12:00:00')
    expect(props.onSubmitStart).toBeCalledTimes(1)
    expect(props.onSubmitStart).toHaveBeenCalledWith('2012-01-efss 12:00:00')
  })

  test('sets the end date correctly when an invalid date is passed', () => {
    const { enzymeWrapper, props } = setup()
    const testObj = moment('2012-01-efss 12:00:00', 'YYYY-MM-DD HH:mm:ss', true)

    enzymeWrapper.find(Datepicker).at(1).props().onSubmit(testObj)
    expect(props.onSubmitEnd).toBeCalledTimes(1)
  })
})