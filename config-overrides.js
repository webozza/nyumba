/* config-overrides.js */
/* eslint-disable react-hooks/rules-of-hooks */
const { useBabelRc, override } = require('customize-cra');
const { alias, configPaths } = require('react-app-rewire-alias');

module.exports = override(useBabelRc());

module.exports = function override(config) {
	alias(configPaths())(config);
	return config;
};
