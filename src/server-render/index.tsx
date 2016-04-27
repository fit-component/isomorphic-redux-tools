import * as React from 'react'
import * as fs from 'fs'
import * as path from 'path'
import {renderToString} from 'react-dom/server'
import {match, RouterContext} from 'react-router'
import {Provider} from 'react-redux'
import ServerRequestHelper from '../server-request'
import configureStore from '../store/index'

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

// 后端渲染
export default(req:any, res:any, routes:ReactRouter.RouteConfig, basename:string, rootReducer:any, htmlText:string, enable:boolean = true)=> {
    // 如果不启动后端渲染,直接返回未加工的模板
    if (!enable) {
        return res.status(200).send(renderFullPage(htmlText, '', {}))
    }

    match({
        routes: routes,
        location: req.url,
        basename: basename
    }, (error:any, redirectLocation:any, renderProps:any) => {
        if (error) {
            res.status(500).send(error.message)
        } else if (redirectLocation) {
            res.redirect(302, redirectLocation.pathname + redirectLocation.search)
        } else if (renderProps) {
            const serverRequestHelper = new ServerRequestHelper()
            renderProps.params.SERVERRENDER = serverRequestHelper.Request
            // 初始化 redux
            const store = configureStore()
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
                    res.status(200).send(renderFullPage(htmlText, componentHTML, initialState))
                })
            } catch (err) {
                yog.log.fatal(err)
                res.status(200).send(renderFullPage(htmlText, '', {err: 'Server Render Error'}))
            }
        } else {
            res.status(404).send('Not Found')
        }
    })
}