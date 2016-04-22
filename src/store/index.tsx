import {createStore, applyMiddleware, compose} from 'redux'
import thunk from 'redux-thunk'
import * as process from 'process'
import promiseMiddleware from '../promise-middleware/index'

// 定义ts丢失的属性
interface MyWindow extends Window {
    devToolsExtension:any
}
declare const window:MyWindow

interface MyModule {
    hot:any
}
declare const module:MyModule

declare const require:any

// 中间件生成器
const middlewareBuilder = () => {
    let middleware:any = {}
    let universalMiddleware:any = [thunk, promiseMiddleware]
    let allComposeElements:any = []

    if (process.browser) {
        middleware = applyMiddleware(...universalMiddleware)
        if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'test') {
            allComposeElements = [
                middleware
            ]
        } else {
            allComposeElements = [
                middleware,
                window.devToolsExtension ? window.devToolsExtension() : (f:any) => f
            ]
        }
    } else {
        middleware = applyMiddleware(...universalMiddleware);
        allComposeElements = [
            middleware
        ]
    }

    return allComposeElements
}

const finalCreateStore = compose(...middlewareBuilder())(createStore)

export default (initialState?:any, rootReducer?:any) => {
    const store = finalCreateStore(rootReducer, initialState)

    if (module.hot) {
        // 开启 reducer 的 hot-loader
        // module.hot.accept('../reducer', () => {
        //     const nextRootReducer = require('../reducer').default
        //     store.replaceReducer(nextRootReducer)
        // })
    }

    return store
}