import * as React from 'react'
import {Router, useRouterHistory} from 'react-router'
import {createHistory} from 'history'
import {syncHistoryWithStore} from 'react-router-redux'
import {Provider} from 'react-redux'
import {setBasename} from '../fetch'
import configureStore from '../store'

// 定义ts丢失的属性
interface MyWindow extends Window {
    __INITIAL_STATE__:any
}
declare const window:MyWindow

export default (routes:any, basename:string, reducer:any)=> {
    // 设置 fetch 的 basename
    setBasename(basename)

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