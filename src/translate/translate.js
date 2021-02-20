// This file takes the default culture to load all translations in the site
// application, so when import this file, the default culture translation
// will be loaded. In the future there can be logic to be added here by adding
// the selected culture of the user, to load the translations in the site
// according to the selected culture. The selected culture implemented on
// the "translate.{culture}.json" to be loaded dynamically.

const settings = require('../settings/application/settings.js').default;
export default require(`./translate.${settings.emailDefaultCulture}.json`);