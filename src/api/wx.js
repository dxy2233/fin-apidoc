import request from '@/utils/request'

/**
 * @description 地理位置
 * @param provinceName 省级名称
 * @param lat 纬
 * @param lng 经
 */
export function georesolve(data) {
  return request({
    url: '/wx/georesolve',
    method: 'get',
    params: data,
  })
}

/**
 * @description 调用wxjssdk所需参数
 * @param url 当前页面的url(去除#号)
 */
export function getWxToken(data) {
  return request({
    url: '/wx/getWxToken',
    method: 'get',
    params: data,
  })
}
