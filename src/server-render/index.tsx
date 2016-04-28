import * as React from 'react'
import * as fs from 'fs'
import * as path from 'path'
import {renderToString} from 'react-dom/server'
import {match, RouterContext} from 'react-router'
import {Provider} from 'react-redux'
import ServerRequestHelper from '../server-request'
import configureStore from '../store'

interface YogInterface {
    log:any
    ralP:any
}
declare var yog:YogInterface

// 渲染整个页面
const renderFullPage = (htmlText:string, element:string, initialState:any)=> {
    let content = htmlText
    // 将内容塞到 #react-dom
    content = content.replace(/<div id=\"react-dom\"><\/div>/g, `<div id="react-dom">${element}</div>`)
    // 设置初始状态
    content = content.replace(/__serverData\((\'|\")__INITIAL_STATE__(\'|\")\)/g, JSON.stringify(initialState))
    return content
}

export interface Option {
    req:any
    res:any
    routes:ReactRouter.RouteConfig
    basename:string
    rootReducer:any
    htmlText:string
    service:any
    enableServerRender?:boolean
}

// 后端渲染
export default(option:Option)=> {
    // 如果不启动后端渲染,直接返回未加工的模板
    if (!option.enableServerRender) {
        return option.res.status(200).send(renderFullPage(option.htmlText, '', {}))
    }

    match({
        routes: option.routes,
        location: option.req.url,
        basename: option.basename
    }, (error:any, redirectLocation:any, renderProps:any) => {
        if (error) {
            option.res.status(500).send(error.message)
        } else if (redirectLocation) {
            option.res.redirect(302, redirectLocation.pathname + redirectLocation.search)
        } else if (renderProps) {
            const serverRequestHelper = new ServerRequestHelper(option.service)
            renderProps.params.SERVERRENDER = serverRequestHelper.Request
            // 初始化 redux
            const store = configureStore({}, option.rootReducer)
            const InitialView = React.createElement(Provider, {store: store}, React.createElement(RouterContext, renderProps))

            try {
                // 初次渲染触发所有需要的网络请求
                renderToString(InitialView)

                // 拿到这些请求的action
                const actions = serverRequestHelper.getActions()
                Promise.all(actions.map(action=> {
                    return store.dispatch(action)
                })).then(()=> {
                    const componentHTML = renderToString(InitialView)
                    const initialState = store.getState()
                    // 将初始状态输出到 html
                    option.res.status(200).send(renderFullPage(option.htmlText, componentHTML, initialState))
                })
            } catch (err) {
                yog.log.fatal(err)
                option.res.status(200).send(renderFullPage(option.htmlText, '', {err: 'Server Render Error'}))
            }
        } else {
            option.res.status(404).send('Not Found')
        }
    })
}