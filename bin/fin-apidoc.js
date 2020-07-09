#!/usr/bin/env node

const axios = require('axios')
const fs = require('fs')

const params = process.argv.slice(2)
if (!params[0]) {
  console.log('target空')
  return
}

const apiUrl = params[0]
const apiPath = params[1] ? `./src/${params[1]}/` : './src/api/' // 文件夹路径

/* 拉取原始数据 */
const getApiData = async () => {
  let apiData = await axios(apiUrl).then((res) => {
    return res.data.slice(res.data.indexOf('['), res.data.lastIndexOf(']') + 1)
  })
  return JSON.parse(apiData)
}
/* 重新整理原始数据 */
const handleData = (data) => {
  const res = {}
  for (const item of data) {
    if (!res[item.group]) res[item.group] = []
    res[item.group].push(item)
  }
  return res
}
/* 生成api文件 */
const createFile = (data) => {
  try {
    fs.accessSync(apiPath, fs.constants.R_OK | fs.constants.W_OK)
  } catch (error) {
      fs.mkdirSync(apiPath)
  } finally {
      for (const [key, group] of Object.entries(data)) {
        fs.writeFile(`${apiPath}${key}.js`, fileTemplate(group), (err) => {
          if (err) console.log(err)
       })
      }
  }
}
/* 文件模板 */
const fileTemplate = (gruop) => {
  // 引入封装的ajax
  let res = `import request from '@/utils/request'
`
  for (const item of gruop) {
    // 参数
    let params = ''
    for (const item2 of item.parameter.fields.Parameter) {
      params = `${params}
 * @param ${item2.field} ${removeLabel(item2.description)}`
    }
    // 最终输出
    res = `${res}
/**
 * @description ${removeLabel(item.description)}${params ? `${params}` : ''}
 */
export function ${item.title}(data) {
  return request({
    url: '${item.url}',
    method: '${item.type}',
    ${item.type === 'get' ? 'params: data' : 'data'},
  })
}
`
  }
  return res
}
/* 去除html标签 */
const removeLabel = (html) => {
  return html.slice(html.indexOf('>') + 1, html.lastIndexOf('<'))
}

const run = async () => {
  const apiData = await getApiData()
  const resData = handleData(apiData)
  createFile(resData)
}
run()
