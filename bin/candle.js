'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _csvtojson = require('csvtojson');

var _csvtojson2 = _interopRequireDefault(_csvtojson);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _xml2js = require('xml2js');

var _xml2js2 = _interopRequireDefault(_xml2js);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var fsAsync = _bluebird2.default.promisifyAll(_fs2.default),
    xmlAsync = _bluebird2.default.promisifyAll(_xml2js2.default);

var Candle = function () {
	function Candle(Models) {
		_classCallCheck(this, Candle);

		this.Models = Models;
	}

	_createClass(Candle, [{
		key: 'fileToDatabase',
		value: function fileToDatabase(options) {
			var _this = this;

			return new _bluebird2.default(function (resolve, reject) {
				var _fileToDatabase = void 0;
				switch (_path2.default.extname(options.file).toLowerCase()) {
					case '.csv':
						_fileToDatabase = function _fileToDatabase(opt) {
							return _this._csvToDatabase(opt);
						};
						break;
					case '.json':
						_fileToDatabase = function _fileToDatabase(opt) {
							return _this._jsonToDatabase(opt);
						};
						break;
					case '.xml':
						_fileToDatabase = function _fileToDatabase(opt) {
							return _this._xmlToDatabase(opt);
						};
						break;
					default:
						return reject(new Error('File type not supported'));
				}
				return _fileToDatabase(options).then(function () {
					return resolve();
				}).catch(function (err) {
					return reject(err);
				});
			});
		}
	}, {
		key: '_csvToDatabase',
		value: function _csvToDatabase(options) {
			var _this2 = this;

			return new _bluebird2.default(function (resolve, reject) {
				(0, _csvtojson2.default)({ delimiter: options.delimiter || ';' }).fromFile('' + process.cwd() + options.file).on('json', function (line) {
					_this2._lineToDatabase(_extends({ line: line }, options)).then(function (err) {
						if (err) console.log(err);
					}).catch(function (err) {
						return reject(err);
					});
				}).on('done', function (err) {
					if (err) return reject(err);
					return resolve();
				});
			});
		}
	}, {
		key: '_jsonToDatabase',
		value: function _jsonToDatabase(options) {
			var _this3 = this;

			return new _bluebird2.default(function (resolve, reject) {
				fsAsync.readFileAsync('' + process.cwd() + options.file, 'utf8').then(function (data) {
					return JSON.parse(data).reduce(function (promises, line) {
						return _this3._lineToDatabase(_extends({ line: line }, options));
					}, _bluebird2.default.resolve());
				}).then(function () {
					return resolve();
				}).catch(function (err) {
					return reject(err);
				});
			});
		}
	}, {
		key: '_xmlToDatabase',
		value: function _xmlToDatabase(options) {
			var _this4 = this;

			return new _bluebird2.default(function (resolve, reject) {
				fsAsync.readFileAsync('' + process.cwd() + options.file, 'utf8').then(function (data) {
					return xmlAsync.parseStringAsync(data);
				}).then(function (json) {
					return json[options.root ? options.root : 'root.line'].reduce(function (promises, line) {
						return _this4._lineToDatabase(_extends({ line: line }, options));
					});
				}, _bluebird2.default.resolve()).then(function () {
					return resolve();
				}).catch(function (err) {
					return reject(err);
				});
			});
		}
	}, {
		key: '_lineToDatabase',
		value: function _lineToDatabase(options) {
			var _this5 = this;

			return new _bluebird2.default(function (resolve, reject) {
				var line = _extends({
					database: options.database ? options.database : null,
					date: options.date ? Date.now() : null
				}, options.line);
				return new _this5.Models[options.type](line).save().then(function () {
					return resolve();
				}).catch(function (err) {
					if (!options.safe) return resolve(err);
					return _this5.removeFromDatabase(options).then(function () {
						return reject(err);
					}).catch(function (err2) {
						return reject(err2);
					});
				});
			});
		}
	}, {
		key: 'linesFromDatabase',
		value: function linesFromDatabase(options) {
			var _this6 = this;

			return new _bluebird2.default(function (resolve, reject) {
				return _this6.Models[options.type].find({ database: options.database }).then(function (lines) {
					return resolve(lines);
				}).catch(function (err) {
					return reject(err);
				});
			});
		}
	}, {
		key: 'removeFromDatabase',
		value: function removeFromDatabase(options) {
			var _this7 = this;

			return new _bluebird2.default(function (resolve, reject) {
				return _this7.Models[options.type].deleteMany({ database: options.database }).then(function () {
					return resolve();
				}).catch(function (err) {
					return reject(err);
				});
			});
		}
	}]);

	return Candle;
}();

exports.default = Candle;
module.exports = exports['default'];
