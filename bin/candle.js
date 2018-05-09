'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _csvtojson = require('csvtojson');

var _csvtojson2 = _interopRequireDefault(_csvtojson);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Candle = function () {
	function Candle(Models) {
		_classCallCheck(this, Candle);

		this.Models = Models;
	}

	_createClass(Candle, [{
		key: 'databaseInsert',
		value: function databaseInsert(options) {
			var _this = this;

			return new _bluebird2.default(function (resolve, reject) {
				(0, _csvtojson2.default)({ delimiter: options.delimiter }).fromFile(options.file).on('json', function (line) {
					var value = _extends({ date: Date.now(), candle: options.candle }, line);
					new _this.Models[options.type](value).save(function (err) {
						if (err) console.log(err);
					});
				}).on('done', function (err) {
					if (err) return reject(err);
					return resolve(options);
				});
			});
		}
	}]);

	return Candle;
}();

exports.default = Candle;
module.exports = exports['default'];
