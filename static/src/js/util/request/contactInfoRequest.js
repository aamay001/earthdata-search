import Request from './request'
import { getEnvironmentConfig } from '../../../../../sharedUtils/config'

export default class ContactInfoRequest extends Request {
  constructor(authToken) {
    super(getEnvironmentConfig().apiHost)
    this.authenticated = true
    this.authToken = authToken
  }

  fetch() {
    return this.get('contact_info')
  }

  updateNotificationLevel(data) {
    return this.post('contact_info', data)
  }
}
