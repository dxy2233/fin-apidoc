import request from '@/utils/request'

/**
 * @description 登陆
 * @param code 微信浏览器获取的code
 */
export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data,
  })
}
