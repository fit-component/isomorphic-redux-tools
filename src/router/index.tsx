import * as React from 'react'
import {Router, useRouterHistory} from 'react-router'
import {createHistory} from 'history'
import {syncHistoryWithStore} from 'react-router-redux'
import {Provider} from 'react-redux'
import configureStore from '../store/index'

// 定义ts丢失的属性
interface MyWindow extends Window {
    __INITIAL_STATE__:any
}
declare const window:MyWindow

export default (routes:any, basename:string, reducer:any)=> {
    const initialState = window.__INITIAL_STATE__
    const store = configureStore(initialState, reducer)
    const appHistory = useRouterHistory(createHistory)({basename: basename})
    const history = syncHistoryWithStore(appHistory, store)
    return (
        <Provider store={store}>
            <Router history={history}>{routes}</Router>
        </Provider>
    )
}