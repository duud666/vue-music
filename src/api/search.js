import jsonp from 'common/js/jsonp'
import {commonParams, options} from './config'

export function getHotKey() {
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'
               
  const data = Object.assign({}, commonParams, {
    needNewCode: 0,
    notice:0,
    platform: 'yqq',
    loginUin:0,
   	hostUin:0,
	  g_tk:5381
  })

  return jsonp(url, data, options)
}

export function search(query, page,zhida,perpage) {
  const url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp'
               
  const data = Object.assign({}, commonParams, {
    w:query,
    p:page,
    catZhida:zhida?1:0,
    perpage,
    needNewCode: 1,
    platform: 'h5',
    g_tk:5381,
    t:0,
    flag:1,
    ie:'utf-8',
    sem:1,
    aggr:0,
    n:20,
    notice:0,
    zhidaqu:1,
    remoteplace:'txt.mqq.all',
    uin:0

  })

  return jsonp(url, data, options)
}