const fs            = require('fs')
const path          = require('path')
const child_process = require('child_process')
const readline      = require('readline')
// const shelljs         = require('shelljs')
// shelljs.config.silent = true

const moment = require('moment')
moment.locale('zh-cn')
// <script src="http://cdn.staticfile.org/moment.js/2.24.0/moment.min.js" type="text/javascript"></script>
const colors = [1, 4, 7, 31, 32, 33, 34, 35, 36, 37, 40, 41, 42, 43, 44, 45, 46, 47, 91, 92, 93, 94, 95, 96, 97, 100, 101, 102, 103, 104, 105, 106, 107]

const Info = Error

function color_test(i_var, j_var, k_var) {
  // # https://www.cnblogs.com/zhuminghui/p/9457185.html
  // # 使用 color_test(0, (30, 100), (40, 100))
  // def color_test(i_var, j_var, k_var):
  //     '''
  //     麻蛋 原来是在里面写方法的注释啊...\n
  //     使用 color_test(0, (30, 100), (40, 100))
  //
  //     :param i_var: 0（默认）、1（高亮）、22（非粗体）、4（下划线）、24（非下划线）、 5（闪烁）、25（非闪烁）、7（反显）、27（非反显）
  //     :param j_var: 30（黑色）、31（红色）、32（绿色）、 33（黄色）、34（蓝色）、35（洋 红）、36（青色）、37（白色）
  //     :param k_var: 40（黑色）、41（红色）、42（绿色）、 43（黄色）、44（蓝色）、45（洋 红）、46（青色）、47（白色）
  //     :return:
  //     '''
  //     i = i_var
  //     # i 显示方式
  //     # 0（默认\）、1（高亮）、22（非粗体）、4（下划线）、24（非下划线）、 5（闪烁）、25（非闪烁）、7（反显）、27（非反显）
  //     for j in range(j_var[0], j_var[1], 1):
  //         for k in range(k_var[0], k_var[1], 1):
  //             print("\033[{0};{1};{2}m\t{3}\t\033[0m | [{0};{1};{2}m".format(i, j, k, 'hello world | 你好吗 世界 | 0123456'))
  //             # print("\033[{0};{1};{2}m\t{3}\t\033[0m | [{0};{1};{2}m".format(i, j, k, '\n'))
  for (let i = 0; i < 1; i++) {
    for (let j = 0; j < 100; j++) {
      for (let k = 0; k < 100; k++) {
        console.log(`\x1b[${i};${j};${k}m %s \x1b[0m | %sm `, 'hello world | 你好吗 世界 | 0123456', `[${i};${j};${k}`)
      }
    }
  }
}

const fgx = `------------------------------------------------------------------------------------------------------------------------------------------------------------------`

// function choose_color(content, color_index) {return `\x1b[${colors[color_index]}m${content}\n\x1b[0m`}
// function blue(content) {return `\x1b[${colors[6]}m${content}\x1b[0m`}
// function purple(content) {return `\x1b[${colors[21]}m${content}\x1b[0m`}
// function green_with_bordered(content) {return `\x1b[7;32;48m${content}\x1b[0m`}
// function green(content) {return `\x1b[${colors[4]}m${content}\x1b[0m`}
// function red(content) {return `\x1b[${colors[3]}m${content}\x1b[0m`}
// function black(content) {return `\x1b[${colors[32]}m${content}\x1b[0m`}
// function cyan(content) {return `\x1b[${colors[31]}m${content}\x1b[0m`}
// function normal(content) {return `\x1b[${colors[0]}m${content}\x1b[0m`}

// function choose_color(content, color_index) {return `\x1b[${colors[color_index]}m${content}\n\x1b[0m`}
function choose_color(content, color_index) {return `\x1b[0;1;7m${content}\n\x1b[0m`}

function blue(content) {return `\x1b[${colors[6]}m${content}\x1b[0m`}

function purple(content) {return `\x1b[${colors[21]}m${content}\x1b[0m`}

function green_with_bordered(content) {return `\x1b[7;32;48m${content}\x1b[0m`}

function green(content) {return `\x1b[${colors[4]}m${content}\x1b[0m`}

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
    /(?<=\()\/Users.*(?=\))/img,
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

  // if (obj.includes('.')) {
  //   return obj.split('.')[1]
  // } else {
  //   return obj
  // }

  return obj
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

function get_fmt(color, template) {
  switch (template) {
    case 0:
      return `${normal('%s')}${normal(' <')}${blue('%s')}${normal('> :- ')}${green_with_bordered(' %s ')}${purple('%s')}${blue('[ %s ]')}${normal(' = ↓\n')}${choose_color('%s', color)}${fgx}`
    case 1:
      return `${normal('%s')}${normal(' <')}${blue('%s')}${normal('> :- ')}${green_with_bordered(' %s ')}${purple('%s')}${blue('[ %s ]')}${red('%s')}${normal(' = ↓\n')}${choose_color('%s', color)}${fgx}`
    case 2:
      return `${normal('%s')}${normal(' <')}${blue('%s')}${normal('> :- ')}${green_with_bordered(' %s ')}${blue('[ %s ]')}${normal(' = ↓\n')}${choose_color('%s', color)}${fgx}`
    default:
      return `${normal('%s')}${normal(' <')}${blue('%s')}${normal('> :- ')}${green_with_bordered(' %s ')}${purple('%s')}${normal(' = ↓\n')}${choose_color('%s', color)}${fgx}`
  }
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
    var color = 2
    if (options.hasOwnProperty('color')) {color = options.color}
    var { message, filepath_lineno, method } = __parsing_information(information)
    var fmt                                  = get_fmt(color, 0)

    console.log(fmt, filepath_lineno, now_time(), message, `${type(obj)}`, method, obj)
  }
}

function dlog_iterable(obj, information, options = {}) {
  var color = 2
  if (options.hasOwnProperty('color')) {color = options.color}

  var { message, filepath_lineno, method } = __parsing_information(information)
  var fmt                                  = get_fmt(color, 1)

  console.log(fmt, filepath_lineno, now_time(), message, `${type(obj)}`, method, '| log by dlog_iterable |', JSON.stringify(obj, null, 2))
}

function dlog_property(obj, information, options = {}) {
  var color = 2
  if (options.hasOwnProperty('color')) {color = options.color}
  var { message, filepath_lineno, method } = __parsing_information(information)
  var ownKeys                              = Reflect.ownKeys(obj)
  if (ownKeys != null && ownKeys.length == 0) {
    var fmt = get_fmt(color, 0)
    console.log(fmt, filepath_lineno, now_time(), message, `${type(obj)}`, method, '[]')
    return
  }
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
  var fmt = get_fmt(color, 0)
  console.log(fmt, filepath_lineno, now_time(), message, `${type(obj)}`, method, ss)
}

function dlog_array(obj, information, options) {
  var color = 2
  if (options.hasOwnProperty('color')) {color = options.color}

  var { message, filepath_lineno, method } = __parsing_information(information)

  var fmt = get_fmt(color, 0)

  obj.sort()
  console.log(fmt, filepath_lineno, now_time(), message, `${type(obj)}`, method, JSON.stringify(obj, null, 2))
}

function dlog_func(obj, information, options) {
  var color = 2
  if (options.hasOwnProperty('color')) {color = options.color}

  var { message, filepath_lineno, method } = __parsing_information(information)

  var fmt = get_fmt(color, 2)
  console.log(fmt, filepath_lineno, now_time(), message, method, `call【 ${method} 】`)
}

function dlog_obj(obj, information, options) {
  var { message, filepath_lineno, method } = __parsing_information(information)
  var color                                = 2
  if (options.hasOwnProperty('color')) {color = options.color}
  var fmt = get_fmt(color, 0)
  try {
    console.log(fmt, filepath_lineno, now_time(), message, `${type(obj)}`, method, JSON.stringify(obj, null, 2))
  } catch (err) {
    fmt = `${normal('%s')}${normal(' <')}${blue('%s')}${normal('> :- ')}${green_with_bordered('%s')}${purple('%s')}${normal(' = ↓\n')}`
    console.group(fmt, filepath_lineno, now_time(), message, `${type(obj)}`)

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
    console.log(`${fgx}`)
  }
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

// get(url, [config])
// head(url, [config])
// delete(url, [config])
// jsonp(url, [config])
// post(url, [body], [config])
// put(url, [body], [config])
// patch(url, [body], [config])
//                              /* methods */
/************************************************************************************/
// function pExec(cmd) {
//   return new Promise((resolve, reject) => {
//     shelljs.exec(cmd, function (code, stdout, stderr) {
//       // console.log('Exit code:', code)
//       // console.log('Program output:', stdout)
//       // console.log('Program stderr:', stderr)
//       if (code !== 0) {
//         reject(stderr)
//       } else {
//         resolve(stdout)
//       }
//     })
//   })
// }
function pExec(cmd, encoding = 'utf8', maxBuffer = 1000 * 1000 * 10) {
  return new Promise((resolve, reject) => {
    child_process.exec(cmd, {
      encoding : encoding,
      maxBuffer: maxBuffer, // 默认 200 * 1024
    }, function (err, stdout, stderr) {
      if (err) {
        reject(stderr)
      } else {
        resolve(stdout)
      }
    })
  })
}



function pExecFile(cmd, args, encoding = 'utf8', maxBuffer = 1000 * 1000 * 10) {
  return new Promise((resolve, reject) => {
    child_process.execFile(cmd, args, {
      encoding : encoding,
      maxBuffer: maxBuffer, // 默认 200 * 1024
      shell    : false,
    }, function (err, stdout, stderr) {
      if (err) {
        reject(stderr)
      } else {
        resolve(stdout)
      }
    })
  })
}

function pExecSync(cmd, encoding = 'utf8', maxBuffer = 1000 * 1000 * 10) {
  return child_process.execSync('rm -rf dist', { encoding: 'utf-8', maxBuffer: 1000 * 1000 * 10 })
}

function pExecFileSync(cmd, args, encoding = 'utf8', maxBuffer = 1000 * 1000 * 10) {
  return child_process.execFileSync(cmd, args, {
    encoding : encoding,
    maxBuffer: maxBuffer, // 默认 200 * 1024
    shell    : false,
  })
}

function pWriteTextFile(filepath, content) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filepath, content, 'utf8', function (err) {
      if (err) {reject(err)} else {resolve()}
    })
  })
}

function pReadBinaryFile(filepath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filepath, 'binary', function (err, data) {
      if (err) {reject(err)} else {resolve(data)}
    })
  })
}

function pWriteBinaryFile(filepath, content) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filepath, content, 'binary', function (err) {
      if (err) {reject(err)} else {resolve()}
    })
  })
}

function pAppendTextFile(filepath, content) {
  return new Promise((resolve, reject) => {
    fs.appendFile(filepath, content, 'utf8', function (err) {
      if (err) {reject(err)} else {resolve()}
    })
  })
}

function pReadTextFile(filepath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filepath, 'utf-8', function (err, data) {
      if (err) {reject(err)} else {resolve(data)}
    })
  })
}

function pReaddir(filepath) {
  return new Promise((resolve, reject) => {
    fs.readdir(filepath, function (err, files) {
      if (err) {reject(err)} else {resolve(files)}
    })
  })
}

function pStat(path) {
  return new Promise((resolve, reject) => {
    fs.stat(path, (err, stats) => {
      if (err) {reject(err)} else {resolve(stats)}
    })
  })
}

// 转成字符串比较 去重
function uniq(arr) {
  var tmp = new Set(arr.map(item => JSON.stringify(item)))
  return Array.from(tmp).map(item => JSON.parse(item))
}

function uniqWithObject(arr, property) {
  let obj = {}
  arr.forEach(item => {
    obj[item[property]] = item
  })
  return Object.values(obj)
}

function toFlatten(arr) {
  while (arr.some(item => Array.isArray(item))) {arr = [].concat(...arr)}
  return arr
}

function toMatrix(arr, elementCount) {
  let r = []
  for (let i = 0; i < arr.length; i += elementCount) {
    r.push(arr.slice(i, i + elementCount))
  }
  return r
}

function pReadLine(path) {
  return new Promise((resolve, reject) => {
    try {
      let lines = []
      const rl  = readline.createInterface({
        input    : fs.createReadStream(path),
        crlfDelay: Infinity,
      })
      rl.on('line', async (line) => {
        if (line.trim() === '') {
          // 空行
        } else {
          lines.push(line)
        }
      })
      rl.on('close', async () => {
        resolve(lines)
      })
    } catch (err) {
      reject(err)
    }
  })
}

// exports.sleep            = sleep
// exports.pExec            = pExec
// exports.pExecFile        = pExecFile
// exports.pWriteTextFile   = pWriteTextFile
// exports.pWriteBinaryFile = pWriteBinaryFile
// exports.pAppendTextFile  = pAppendTextFile
// exports.pReadTextFile    = pReadTextFile
// exports.pReaddir         = pReaddir
// exports.pStat            = pStat
// exports.uniq             = uniq
// exports.uniqWithObject   = uniqWithObject
// exports.toFlatten        = toFlatten
// exports.toMatrix         = toMatrix
// exports.type             = type
// exports.dlog             = dlog
// exports.dlog_property    = dlog_property
// exports.Info             = Info

module.exports = {
  pExec,
  pExecFile,
  pExecSync,
  pExecFileSync,
  pWriteTextFile,
  pWriteBinaryFile,
  pAppendTextFile,
  pReadBinaryFile,
  pReadTextFile,
  pReaddir,
  pStat,
  pReadLine,
  uniq,
  uniqWithObject,
  toFlatten,
  toMatrix,
  type,
  dlog,
  dlog_property,
  Info,
}

// for i := 'A'; i <= 'Z'; i++ {
//   fmt.Printf("%c",i)
// }
// for i := 'a'; i <= 'z'; i++ {
//   fmt.Printf("%c",i)
// }
if (require.main === module) {
  // ;(async function () {
  //   dlog(`hello_world`, new Info, 0)
  // })()
  // dlog(`hello_world`, new Info, 0)
  color_test('hello world')

  // http://localhost:8080/t005_v-model/:35:29 <11:51:06:877> :- this[object Object] = ↓

  console.log(`\x1b[7;32;48m%s\x1b[0m`, 'hello world')
}
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


