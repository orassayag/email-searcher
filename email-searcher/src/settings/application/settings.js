// This file load the global settings according to the current environment
// (Development, test or production) for the entire
// site application, settings that require some logic to process and
// for other global settings that may be different between the environments.

const { getEnvironment } = require('../../utils/coreUtils.js');
const applicationSettings = require(`./settings.${getEnvironment()}.js`);

export default applicationSettings.default;