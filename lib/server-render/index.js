'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var React = _interopRequireWildcard(_react);

var _fs = require('fs');

var fs = _interopRequireWildcard(_fs);

var _path = require('path');

var path = _interopRequireWildcard(_path);

var _server = require('react-dom/server');

var _reactRouter = require('react-router');

var _reactRedux = require('react-redux');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// 获取 html
var htmlText = fs.readFileSync(path.join(__dirname, '../../client/index.html'), 'utf-8');
// 渲染整个页面
var renderFullPage = function renderFullPage(element, initialState) {
    var content = htmlText;
    // 将内容塞到 #react-dom
    content = content.replace(/<div id=\"react-dom\"><\/div>/g, '<div id="react-dom">' + element + '</div>');
    // 设置初始状态
    content = content.replace(/__serverData\((\'|\")__INITIAL_STATE__(\'|\")\)/g, JSON.stringify(initialState));
    return content;
};

exports.default = function (req, res, routes, basename, configureStore) {
    var enable = arguments.length <= 5 || arguments[5] === undefined ? true : arguments[5];

    // 如果不启动后端渲染,直接返回未加工的模板
    if (!enable) {
        return res.status(200).send(renderFullPage('', {}));
    }
    (0, _reactRouter.match)({
        routes: routes,
        location: req.url,
        basename: basename
    }, function (error, redirectLocation, renderProps) {
        if (error) {
            res.status(500).send(error.message);
        } else if (redirectLocation) {
            res.redirect(302, redirectLocation.pathname + redirectLocation.search);
        } else if (renderProps) {
            // 初始化 redux
            var store = configureStore();
            var InitialView = React.createElement(_reactRedux.Provider, { store: store }, React.createElement(_reactRouter.RouterContext, renderProps));
            var componentHTML = (0, _server.renderToString)(InitialView);
            var initialState = store.getState();
            // 将初始状态输出到 html
            res.status(200).send(renderFullPage(componentHTML, initialState));
        } else {
            res.status(404).send('Not Found');
        }
    });
};