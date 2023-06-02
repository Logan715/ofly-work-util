import {Base64} from 'js-base64'

const Base64Util = {
  encode(text) {
    return Base64.encode(text)
  },
  decode(text) {
    return Base64.decode(text)
  }
}

const URLUtil = {
  encode(text) { return encodeURIComponent(text)},
  decode(text) {return decodeURIComponent(text)}
}


const encode = (type, text) => {
  switch(type) {
    case'base64':
      return Base64Util.encode(text)
    case'url':
      return URLUtil.encode(text)
  }
} 

const decode = (type, text) => {
  switch(type) {
    case'base64':
      return Base64Util.decode(text)
    case'url':
      return URLUtil.decode(text)
  }
}
export default {
  encode,
  decode
}