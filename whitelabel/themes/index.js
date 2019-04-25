const styles = require('./solarized-dark').default;

module.exports = fileName => styles[fileName] || {};
