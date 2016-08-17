'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _path = require('path');

var _depcheck = require('depcheck');

var _depcheck2 = _interopRequireDefault(_depcheck);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var IGNORE_DIRS_DEFAULT = ['node_modules', 'bower_components'];

var IGNORE_DEFAULT = [];

var Depcheck = function () {
  function Depcheck(targetPath) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, Depcheck);

    this.targetPath = targetPath;
    this.packageJson = require((0, _path.resolve)(this.targetPath, 'package.json'));
    this.options = _extends({
      strict: true,
      unused: true
    }, options);

    this.options.ignore = IGNORE_DEFAULT.concat(options.ignore || []);
    this.options.ignoreDirs = IGNORE_DIRS_DEFAULT.concat(options.ignoreDirs || []);
  }

  _createClass(Depcheck, [{
    key: 'checkStrictDependencies',
    value: function checkStrictDependencies() {
      var errors = [];

      var dependencies = Object.entries(this.packageJson.dependencies || {}).concat(Object.entries(this.packageJson.devDependencies || {}));

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = dependencies[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _step$value = _slicedToArray(_step.value, 2);

          var name = _step$value[0];
          var version = _step$value[1];

          var isStrict = this.isStrict(version);

          if (!isStrict) {
            errors.push(name);
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return errors;
    }
  }, {
    key: 'isStrict',
    value: function isStrict(version) {
      if (version.includes('#')) {
        version = version.split('#')[1].replace(/^v/, '');
      }

      if (!(version.match(/^pull\/\d+\/head$/) || version[0].match(/([0-9])/))) {
        return false;
      }

      return true;
    }
  }, {
    key: 'checkUnusedDependencies',
    value: function () {
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        var _ref2, dependencies, devDependencies;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return (0, _depcheck2.default)(this.targetPath, {
                  ignoreMatches: this.options.ignore,
                  ignoreDirs: this.options.ignoreDirs
                });

              case 2:
                _ref2 = _context.sent;
                dependencies = _ref2.dependencies;
                devDependencies = _ref2.devDependencies;
                return _context.abrupt('return', [].concat(dependencies).concat(devDependencies));

              case 6:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function checkUnusedDependencies() {
        return _ref.apply(this, arguments);
      }

      return checkUnusedDependencies;
    }()
  }, {
    key: 'run',
    value: function () {
      var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
        var nonStrictDeps, unusedDeps;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (!this.options.strict) {
                  _context2.next = 4;
                  break;
                }

                nonStrictDeps = this.checkStrictDependencies();

                if (!nonStrictDeps.length) {
                  _context2.next = 4;
                  break;
                }

                throw this._dependenciesError('You have non strict dependencies', nonStrictDeps);

              case 4:
                if (!this.options.unused) {
                  _context2.next = 10;
                  break;
                }

                _context2.next = 7;
                return this.checkUnusedDependencies();

              case 7:
                unusedDeps = _context2.sent;

                if (!unusedDeps.length) {
                  _context2.next = 10;
                  break;
                }

                throw this._dependenciesError('You have unused dependencies', unusedDeps);

              case 10:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function run() {
        return _ref3.apply(this, arguments);
      }

      return run;
    }()
  }, {
    key: '_dependenciesError',
    value: function _dependenciesError(cause, deps) {
      return new Error(cause + ':\n\n' + deps.join(',\n'));
    }
  }]);

  return Depcheck;
}();

exports.default = Depcheck;