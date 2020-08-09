// <script src="http://cdn.staticfile.org/moment.js/2.24.0/moment.min.js" type="text/javascript"></script>
const colors = [1, 4, 7, 31, 32, 33, 34, 35, 36, 37, 40, 41, 42, 43, 44, 45, 46, 47, 91, 92, 93, 94, 95, 96, 97, 100, 101, 102, 103, 104, 105, 106, 107]

const Info = Error

// color_test('hello world')
// color_test('hello world')
// color_test('hello world')
// color_test('hello world')
function color_test(content) {

  for (let i = 0; i < colors.length; ++i) {
    // let color = colors[i]
    console.log(choose_color(content, i), i)
  }

  var filepath_lineno = 'http://localhost:8080/t005_v-model/:35:29'
  var message         = 'message'
  var obj             = 'hello world'
  for (let i = 0; i < colors.length; ++i) {
    var fmt = `${normal('%s')}${black(' <')}${blue('%s')}${black('> :- ')}${blue('%s')}${choose_color('| log by dlog_iterable |', i)}${black(' = ↓\n')}${choose_color('%s', i)}`
    // console.log(fmt, filepath_lineno, now_time(), message + `${type(obj)}`, obj)
  }
}

function choose_color(content, color_index) {return `\x1b[${colors[color_index]}m${content}\x1b[0m`}

function blue(content) {return `\x1b[${colors[6]}m${content}\x1b[0m`}

function red(content) {return `\x1b[${colors[3]}m${content}\x1b[0m`}

function black(content) {return `\x1b[${colors[32]}m${content}\x1b[0m`}

function cyan(content) {return `\x1b[${colors[31]}m${content}\x1b[0m`}

function normal(content) {return `\x1b[${colors[0]}m${content}\x1b[0m`}

function __analysis(temp, pattern_list) {
  var list = null
  for (let i = 0; i < pattern_list.length; ++i) {
    let regExp = pattern_list[i]
    list       = temp.match(regExp)
    if (list) {break}
  }
  if (list == null) {return 'anonymous'}
  var obj = list[0].trim()
  if (obj.length <= 0) {return 'anonymous'}
  return obj
}

function __get_filepath_lineno(temp) {
  var pattern_list = [
    /(?<=\()http.*?\d+(?=\))/img,
    /(?<=at).*/img,
  ]
  return __analysis(temp, pattern_list)
}

function __get_method(temp) {

  var pattern_list = [
    /(?<=at).*(?=\()/img,
    /(?<=at).*(?=http)/img,
  ]

  var obj = __analysis(temp, pattern_list)

  if (obj.includes('.')) {
    return obj.split('.')[1]
  } else {
    return obj
  }
}

function __parsing_information(information) {
  var infoList        = information.stack.split(/\n/)
  // console.log(JSON.stringify(infoList, null, 2))
  var message         = information.message
  var temp            = infoList[1]
  var filepath_lineno = __get_filepath_lineno(temp)
  var method          = __get_method(temp)

  return { message, filepath_lineno, method }
}

function type(obj) {
  return Object.prototype.toString.call(obj)
}

function is_iterable(obj) {
  return obj != null && typeof obj[Symbol.iterator] === 'function'
  // return typeof obj[Symbol.iterator] === 'function'
}

function run_string_code(content) {
  return eval(content)
}

function dlog(obj, information, options = {}) {
  if (obj == null) {return}
  if (information == null) {return}

  if (false) {
    //
  } else if (type(obj) == '[object Object]') {
    dlog_obj(obj, information, options)
  } else if (type(obj) == '[object Array]') {
    dlog_array(obj, information, options)
  } else if (type(obj) == '[object String]' && obj == '__func__') {
    dlog_func(obj, information, options)
  } else if (is_iterable(obj) && typeof obj != 'string') {
    dlog_iterable(obj, information, options)
  } else {
    var color = 31
    if (options.hasOwnProperty('color')) {color = options.color}
    var { message, filepath_lineno, method } = __parsing_information(information)
    var fmt                                  = `${normal('%s')}${black(' <')}${blue('%s')}${black('> :- ')}${blue('%s')}${black(' = ↓\n')}${choose_color('%s', color)}`
    console.log(fmt, filepath_lineno, now_time(), message + `${type(obj)}`, obj)
  }
}

function dlog_iterable(obj, information, options = {}) {
  var color = 31
  if (options.hasOwnProperty('color')) {color = options.color}

  var { message, filepath_lineno, method } = __parsing_information(information)

  var fmt = `${normal('%s')}${black(' <')}${blue('%s')}${black('> :- ')}${blue('%s')}${red('| log by dlog_iterable |')}${black(' = ↓\n')}${choose_color('%s', color)}`

  console.log(fmt, filepath_lineno, now_time(), message + `${type(obj)}`, JSON.stringify(obj, null, 2))
}

function dlog_property(obj, information, options = {}) {
  var color = 31
  if (options.hasOwnProperty('color')) {color = options.color}
  var { message, filepath_lineno, method } = __parsing_information(information)
  var ownKeys                              = Reflect.ownKeys(obj)
  // ownKeys.sort()
  // var ss = ''
  // for (var i = 0; i < ownKeys.length; ++i) {
  //   var ownKey     = ownKeys[i]
  //   var objElement = obj[ownKey]
  //   // m[ownKey]      = type(objElement)
  //   // console.log(`${ownKey}`.padEnd(30, ' ') + type(objElement))
  //   ss += `${message}.${ownKey}`.padEnd(30, ' ') + type(objElement) + '\n'
  // }

  var dic = {}
  for (var i = 0; i < ownKeys.length; ++i) {
    var key        = ownKeys[i]
    var objElement = obj[key]
    dic[key]       = type(objElement)
  }
  // 字典元素按value值排序:
  ownKeys = Object.keys(dic).sort(function (a, b) {return dic[a].localeCompare(dic[b])})

  var ss = ''
  for (var j = 0; j < ownKeys.length; ++j) {
    var k = ownKeys[j]
    var v = obj[k]
    ss += `${message}.${k}`.padEnd(30, ' ') + type(v) + '\n'
  }
  var fmt = `${normal('%s')}${black(' <')}${blue('%s')}${black('> :- ')}${blue('%s')}${black(' = ↓\n')}${choose_color('%s', color)}`
  console.log(fmt, filepath_lineno, now_time(), message + `${type(obj)}`, ss)
}

function dlog_array(obj, information, options) {
  var color = 31
  if (options.hasOwnProperty('color')) {color = options.color}

  var { message, filepath_lineno, method } = __parsing_information(information)

  var fmt = `${normal('%s')}${black(' <')}${blue('%s')}${black('> :- ')}${blue('%s')}${black(' = ↓\n')}${choose_color('%s', color)}`

  obj.sort()
  console.log(fmt, filepath_lineno, now_time(), message + `${type(obj)}`, JSON.stringify(obj, null, 2))
}

function dlog_func(obj, information, options) {
  var color = 31
  if (options.hasOwnProperty('color')) {color = options.color}

  var { message, filepath_lineno, method } = __parsing_information(information)

  var fmt = `${normal('%s')}${black(' <')}${blue('%s')}${black('> :- ')}${blue('%s')}${black(' = ↓\n')}${choose_color('%s', color)}`

  console.log(fmt, filepath_lineno, now_time(), message, `call【 ${method} 】`)
}

function dlog_obj(obj, information, options) {
  var { message, filepath_lineno, method } = __parsing_information(information)
  var fmt                                  = `${normal('%s')}${black(' <')}${blue('%s')}${black('> :- ')}${blue('%s')}${black(' = ↓\n')}`
  console.group(fmt, filepath_lineno, now_time(), message)
  // memory: any;
  //     assert(condition?: boolean, message?: string, ...data: any[]): void;
  //     clear(): void;
  //     count(label?: string): void;
  //     debug(message?: any, ...optionalParams: any[]): void;
  //     dir(value?: any, ...optionalParams: any[]): void;
  //     dirxml(value: any): void;
  //     error(message?: any, ...optionalParams: any[]): void;
  //     exception(message?: string, ...optionalParams: any[]): void;
  //     group(groupTitle?: string, ...optionalParams: any[]): void;
  //     groupCollapsed(groupTitle?: string, ...optionalParams: any[]): void;
  //     groupEnd(): void;
  //     info(message?: any, ...optionalParams: any[]): void;
  //     log(message?: any, ...optionalParams: any[]): void;
  //     markTimeline(label?: string): void;
  //     profile(reportName?: string): void;
  //     profileEnd(reportName?: string): void;
  //     table(...tabularData: any[]): void;
  //     time(label?: string): void;
  //     timeEnd(label?: string): void;
  //     timeStamp(label?: string): void;
  //     timeline(label?: string): void;
  //     timelineEnd(label?: string): void;
  //     trace(message?: any, ...optionalParams: any[]): void;
  //     warn(message?: any, ...optionalParams: any[]): void;

  var ownKeys = Reflect.ownKeys(obj)
  ownKeys.sort()

  console.log(ownKeys)
  try {
    for (let i = 0; i < ownKeys.length; ++i) {
      let ownKey = ownKeys[i]
      console.log(ownKey.padEnd(20, ' '), obj[ownKey])
    }
  } catch (err) {
    dlog_property(obj, information, options)
  }
  console.groupEnd()
}

function now_time() {
  var date         = new Date()
  var hours        = `${date.getHours()}`.padStart(2, '0')
  var minutes      = `${date.getMinutes()}`.padStart(2, '0')
  var seconds      = `${date.getSeconds()}`.padStart(2, '0')
  var milliseconds = `${date.getMilliseconds()}`.padStart(3, '0')
  return `${hours}:${minutes}:${seconds}:${milliseconds}`
}

//                              /* vue-resource */
/************************************************************************************/
function GET(url, config = {}) {
  return new Promise((resolve, reject) => {
    Vue.http.get(url, config).then(response => {
      // success callback
      resolve(response)
    }, response => {
      // error callback
      reject(response)
    })
  })
}

function POST(url, body = {}, config = { emulateJSON: true, credentials: true }) {
  return new Promise((resolve, reject) => {
    Vue.http.post(url, body, config).then(response => {

      //    // get status
      //     response.status;
      //
      //     // get status text
      //     response.statusText;
      //
      //     // get 'Expires' header
      //     response.headers.get('Expires');
      //
      //     // get body data
      //     this.someData = response.body;

      // success callback
      resolve(response)
    }, response => {
      // error callback
      reject(response)
    })
  })
}

function JSONP(url, config = {}) {
  return new Promise((resolve, reject) => {
    Vue.http.jsonp(url, config).then(response => {
      resolve(response)
    }, response => {
      reject(response)
    })
  })
}

function debug_section(flag = true) {
  if (flag === false) {return}

  var sections = document.getElementsByTagName('section')
  for (let i = 0; i < sections.length; ++i) {
    var section                      = sections[i]
    section.style.padding            = '20px'
    section.style['box-shadow']      = '0 0 0 1px #ccc inset'
    section.style['margin-bottom']   = '20px'
    section.style['display']         = 'flex'
    section.style['flex-direction']  = 'column'
    section.style['flex-wrap']       = 'nowrap'
    section.style['justify-content'] = 'center'
    section.style['align-items']     = 'center'
    section.style['align-content']   = 'center'

    section.style.position  = 'relative'
    var div                 = document.createElement('div')
    div.style.display       = 'block'
    div.style.float         = 'left'
    div.style.position      = 'absolute'
    div.style.left          = '0'
    div.style.top           = '0'
    div.style['box-shadow'] = '0 0 0 1px #ccc inset'
    div.style.padding       = '3px'
    div.innerHTML           = `${section.className}`
    section.appendChild(div)
  }
}

function debug_button(flag = true) {
  if (flag === false) {return}
  var buttons = document.getElementsByTagName('button')
  for (let i = 0; i < buttons.length; ++i) {
    var button                    = buttons[i]
    button.style['box-shadow']    = '0 0 0 1px #ccc inset'
    button.style['padding']       = '8px'
    button.style['border-radius'] = '4px'
    button.style['outline']       = 'none'
    button.style['border']        = 'none'
  }
}

function snplayer(mp4, autoplay = false) {
  Vue.component('sn-player', Vue.extend({
    template: `<div id="dplayer"></div>`,
    mounted() {
      const dp = new DPlayer({
        container : document.getElementById(`dplayer`),
        screenshot: true,
        autoplay  : autoplay,
        video     : {
          url: mp4,
          // pic       : 'demo.jpg',
          // thumbnails: 'thumbnails.jpg',
        },
        // subtitle  : {
        //   url: 'webvtt.vtt',
        // },
        // danmaku   : {
        //   id : 'demo',
        //   api: 'https://api.prprpr.me/dplayer/',
        // },
      })
    },
  }))
}

function snvideo() {
  Vue.component('sn-video', Vue.extend({
    template: `<div><video width="560" height="315" controls :src="src" :autoplay="autoplay"></video></div>`,
    props   : ['src', 'autoplay'],
  }))
}

try {
  module.exports = {
    type,
    dlog,
    dlog_property,
    Info,
  }
} catch (err) {}

// get(url, [config])
// head(url, [config])
// delete(url, [config])
// jsonp(url, [config])
// post(url, [body], [config])
// put(url, [body], [config])
// patch(url, [body], [config])

// exports.dlog          = dlog
// exports.pickColor     = contentColor
// exports.purePickColor = pickColor
// exports.Info          = Info
//
// if (require.main === module) {
// ;(async function () {
//   dlog(`hello_world`, new Info, 0)
// })()
// dlog(`hello_world`, new Info, 0)
//
//http://localhost:8080/t005_v-model/:35:29 <11:51:06:877> :- this[object Object] = ↓
//
// }
//
//
//
//
//
//
