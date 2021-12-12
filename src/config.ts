import * as yenv from 'yenv'

const envConfigs = yenv()

// TODO: define all value with types for autocomplete
const defaultConfigs = {
    // nothing here yet...
}

export default {
    ...defaultConfigs,
    ...envConfigs,
}
