// @babel ignore

import * as React from 'react'
import * as fs from 'fs'
import * as path from 'path'
import {renderToString} from 'react-dom/server'
import {match, RouterContext} from 'react-router'
import {Provider} from 'react-redux'
import ServerRequestHelper from '../server-request'
import {setServerRender} from '../fetch'
import configureStore from '../store'
import service from '../service'

// 渲染整个页面
const renderFullPage = (htmlText: string, element: string, initialState: any, initialTitle:string)=> {
    let content = htmlText
    // 将内容塞到 #react-dom
    content = content.replace(/<div id=\"react-dom\"><\/div>/g, `<div id="react-dom">${element}</div>`)
    // 设置 Redux 初始状态
    content = content.replace(/__serverData\((\'|\")__INITIAL_STATE__(\'|\")\)/g, JSON.stringify(initialState))
    // 设置 title
    content = content.replace(/__serverData\((\'|\")__INITIAL_TITLE__(\'|\")\)/g, initialTitle)

    return content
}

export interface Option {
    req: any
    routes: ReactRouter.RouteConfig
    basename: string
    rootReducer: any
    htmlText: string
    enableServerRender?: boolean
}

/**
 * 后端渲染 promise
 */
const getMatch = (option: Option)=> {
    return new Promise((resolve, reject)=> {
        match({
            routes: option.routes,
            location: option.req.url,
            basename: option.basename
        }, (error: Error, redirectLocation: any, renderProps: any) => {
            if (error) {
                resolve({
                    status: 500,
                    result: error.message
                })
            } else if (redirectLocation) {
                resolve({
                    status: 302,
                    result: redirectLocation.pathname + redirectLocation.search
                })
            } else if (renderProps) {
                const serverRequestHelper = new ServerRequestHelper(service, option.req)

                // 初始化 fetch
                setServerRender(serverRequestHelper.Request as Function)

                // 初始化 redux
                const store = configureStore({}, option.rootReducer)
                const InitialView = React.createElement(Provider, {store: store}, React.createElement(RouterContext, renderProps))

                // 找到最深层组件的 title
                const title = renderProps.components[renderProps.components.length-1].title

                try {
                    // 初次渲染触发所有需要的网络请求
                    renderToString(InitialView)

                    // 拿到这些请求的action
                    const actions = serverRequestHelper.getActions()
                    Promise.all(actions.map((action: any)=> {
                        return store.dispatch(action)
                    })).then(()=> {
                        const componentHTML = renderToString(InitialView)
                        const initialState = store.getState()
                        // 将初始状态输出到 html
                        resolve({
                            status: 200,
                            result: renderFullPage(option.htmlText, componentHTML, initialState, title)
                        })
                    })
                } catch (err) {
                    resolve({
                        status: 200,
                        result: renderFullPage(option.htmlText, `Server Render Error: ${err.toString()}`, {}, title)
                    })
                }
            } else {
                resolve({
                    status: 404,
                    result: 'Not Found'
                })
            }
        })
    })
}

// 后端渲染
export default async(option: Option)=> {
    // 如果不启动后端渲染,直接返回未加工的模板
    if (!option.enableServerRender) {
        return {
            status: 200,
            result: renderFullPage(option.htmlText, '', {}, '')
        }
    }
    return await getMatch(option)
}