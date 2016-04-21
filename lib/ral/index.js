'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _yog2Kernel = require('yog2-kernel');

var yog = _interopRequireWildcard(_yog2Kernel);

var _lodash = require('lodash');

var _ = _interopRequireWildcard(_lodash);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var __awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator.throw(value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : new P(function (resolve) {
                resolve(result.value);
            }).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};

exports.default = function (settings) {
    return __awaiter(undefined, void 0, void 0, regeneratorRuntime.mark(function _callee() {
        var defaults, tmp;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        defaults = {
                            headers: {
                                'x_bd_product': yog.log.req.headers.x_bd_product,
                                'x_bd_subsys': yog.log.req.headers.x_bd_subsys,
                                'x_bd_logid': yog.log.req.headers.x_bd_logid,
                                'x_bd_userip': yog.log.req.headers.x_bd_userip,
                                'x_bd_routerip': yog.log.req.headers.x_bd_routerip,
                                'x-forwarded-for': yog.log.req['headers.x-forwarded-for'],
                                'x_bd_idc': yog.log.req.headers.x_bd_idc,
                                'x_bd_dna': yog.log.req.headers.x_bd_dna,
                                'user-agent': yog.log.req.headers['user-agent'],
                                'bfe-atk': yog.log.req.headers['bfe-atk'],
                                'bfe_logid': yog.log.req.headers.bfe_logid,
                                'bfeip': yog.log.req.headers.bfeip
                            }
                        };
                        _context.next = 3;
                        return yog.ralP('service', _.defaultsDeep(settings, defaults));

                    case 3:
                        tmp = _context.sent;
                        return _context.abrupt('return', tmp);

                    case 5:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));
};