#!/usr/bin/evn python
# coding:utf-8

# __all__ = [
#     'f',
#     'info',
#     'dlog',
#     'dlog_json',
#     'json_stringify',
#     'json_parse',
#     # 'color_test'
# ]

import sys, os, time, re, random, types, json, enum, copy
from collections import Iterable
from functools import (
    reduce,
    wraps
)
from pathlib import Path
import itertools


# print('Python %s on %s' % (sys.version, sys.platform))

# noinspection PyProtectedMember
gf = sys._getframe


class Colour(enum.Enum):
    RED = '0;30;91'
    GREEN = '0;32;48'
    BLUE = '0;34;49'
    PURPLE = '0;39;94'
    PINK = '0;30;95'
    CYAN = '0;30;96'
    GREY = '0;30;90'
    BLACK = '0;30;48'
    WHITE = '0;30;97'
    GREEN_WITH_BORDERED = '7;32;48'


# https://www.cnblogs.com/zhuminghui/p/9457185.html
# 使用 color_test(0, (30, 100), (40, 100))
def color_test(i_var, j_var, k_var):
    '''
    麻蛋 原来是在里面写方法的注释啊...\n
    使用 color_test(0, (30, 100), (40, 100))
    
    :param i_var: 0（默认）、1（高亮）、22（非粗体）、4（下划线）、24（非下划线）、 5（闪烁）、25（非闪烁）、7（反显）、27（非反显）
    :param j_var: 30（黑色）、31（红色）、32（绿色）、 33（黄色）、34（蓝色）、35（洋 红）、36（青色）、37（白色）
    :param k_var: 40（黑色）、41（红色）、42（绿色）、 43（黄色）、44（蓝色）、45（洋 红）、46（青色）、47（白色）
    :return:
    '''
    i = i_var
    # i 显示方式
    # 0（默认\）、1（高亮）、22（非粗体）、4（下划线）、24（非下划线）、 5（闪烁）、25（非闪烁）、7（反显）、27（非反显）
    for j in range(j_var[0], j_var[1], 1):
        for k in range(k_var[0], k_var[1], 1):
            print("\033[{0};{1};{2}m\t{3}\t\033[0m | [{0};{1};{2}m".format(i, j, k, 'hello world | 你好吗 世界 | 0123456'))
            # print("\033[{0};{1};{2}m\t{3}\t\033[0m | [{0};{1};{2}m".format(i, j, k, '\n'))


def coloring(color, content):
    return "\033[%sm%s\033[0m" % (color, content)


def fgx():
    # print (coloring('1;7;94', '\n'))
    print("\n\033[1;7;94m\n\033[0m")


def info(message, information):
    assert str(type(information)) == "<class 'frame'>", coloring('0;97;41', ' 可能覆盖了 f 变量, f变量获取执行环境 ')
    return {'message': message, 'information': information}


def red(content):
    return coloring(Colour.RED.value, content)


def green(content):
    return coloring(Colour.GREEN.value, content)


def blue(content):
    return coloring(Colour.BLUE.value, content)


def purple(content):
    return coloring(Colour.PURPLE.value, content)


def pink(content):
    return coloring(Colour.PINK.value, content)


def cyan(content):
    return coloring(Colour.CYAN.value, content)


def grey(content):
    return coloring(Colour.GREY.value, content)


def black(content):
    return coloring(Colour.BLACK.value, content)


def white(content):
    return coloring(Colour.WHITE.value, content)


def green_with_bordered(content):
    return coloring(Colour.GREEN_WITH_BORDERED.value, content)


def specify_color(content, color):
    if color == 0:
        a = '7;30;90'
    elif color == 1:
        a = '0;44;97'
    elif color == 2:
        a = '0;97;42'
    elif color == 3:
        a = '0;97;41'
    elif color == 4:
        a = '0;0;0'
    else:
        a = '0;7;48'
    
    return "\033[{}m{}\033[0m".format(a, content)


def parsing_information(information):
    ifmt = information['information']
    message = information['message']
    code = ifmt.f_code
    filename = code.co_filename
    co_name = code.co_name
    # line_number = code.co_firstlineno
    line_number = ifmt.f_lineno
    
    return filename, line_number, message, co_name


# def version_check(func):
#     def wrapper(*argv, **kwargs):
#         # if sys.version_info[0] < 3:
#         #     raise RuntimeError('At least Python 3 is required')
#         # assert sys.version_info[0] >= 3 , coloring('0;97;41', ' At least Python 3 is required ')
#         assert sys.version_info[0] >= 3 , coloring('0;97;41', ' At least Python 3 is required ')
#         func(*argv, **kwargs)
#     return wrapper

def version_check(version):
    def decorater(func):
        def wrapper(*argv, **kwargs):
            if version < 3:
                assert sys.version_info[0] == version, coloring('0;97;41', ' At least Python {} is required '.format(version))
            else:
                assert sys.version_info[0] >= version, coloring('0;97;41', ' At least Python {} is required '.format(version))
            func(*argv, **kwargs)
        
        return wrapper
    
    return decorater


@version_check(3)
def dlog(obj, information, color = 0, oneline = False, nopath = False):
    # if sys.version_info < (3, 4):
    #     raise RuntimeError('At least Python 3.4 is required')
    if sys.version_info[0] < 3:
        raise RuntimeError('At least Python 3 is required')
    
    # if (type(obj) in {list, tuple, dict}):
    
    if (isinstance(obj, (list, tuple, dict)) or str(type(obj)) == "<class 'mappingproxy'>"):
        dlog_json(obj, information, color, oneline)
    elif (obj == '__func__'):
        dlog_method(obj, information, color, oneline)
    else:
        filename, line_number, message, co_name = parsing_information(information)
        # fmt = blue("%s:%d <%s>") + " -: " + green_with_bordered("%s") + " = ↓\n" + specify_color("%s\n", color) + "-" * 120
        # print(fmt % (filename, line_number, time.strftime("%H:%M:%S"), '{}[ {} ]'.format(message, type(obj)), str(obj)))
        
        if nopath:
            content = '{object}'.format(object = specify_color(str(obj), color))
        else:
            content = '{filename}:{line_number} <{time}> -: {message} = ↓\n{object}{fgx}'.format(
                    filename = blue(filename),
                    line_number = blue(line_number),
                    time = blue(time.strftime("%H:%M:%S")),
                    # message = f'{message}[ {type(obj)} ]'
                    message = '{}{}'.format(green_with_bordered(message), purple('[ ' + str(type(obj)) + ' ]')),
                    object = specify_color(str(obj) + "\n", color),
                    fgx = "-" * 120
            )
        
        print(content)


def description(instance):
    # class_name = str(instance.__class__)
    # class_name = str(type(instance))
    class_name = instance.__class__.__name__
    instance_dir = list(i for i in dir(instance) if not i.startswith('__') and not i.endswith('__'))
    class_dir = list(i for i in dir(instance.__class__) if not i.startswith('__') and not i.endswith('__'))
    
    difference_dir = list(set(instance_dir) - set(class_dir))
    
    m = {}
    # 除方法外的实例变量
    for index, item in enumerate(difference_dir):
        value = getattr(instance, item)
        if str(type(value)) in ("<class 'method'>", "<class 'function'>"):
            pass
        else:
            m[item] = getattr(instance, item)
    # 除方法外的类变量
    for index, item in enumerate(class_dir):
        
        value = getattr(instance, item)
        if str(type(value)) in ("<class 'method'>", "<class 'function'>"):
            pass
        else:
            m[item + "[ClassVar]"] = getattr(instance, item)
    
    properties = json_stringify(m, 2)
    s = '{} {}'.format(class_name, properties)
    return s


def dlog_property(object, information, color = 0, oneline = False, show_private = False):
    filename, line_number, message, co_name = parsing_information(information)
    
    l = dir(object)
    r = []
    for index, item in enumerate(l):
        try:
            t = str(eval('type(object.{})'.format(item)))
        except Exception as e:
            t = "获取失败"

        r.append({'item': item, 'type': t})
    
    r.sort(key = lambda item: item['type'])
    
    if show_private == False:
        def filter_private(item):
            return not item['item'].startswith('__')
        
        r = filter(filter_private, r)
    
    def property_color(content):
        return "\033[7;30;90m%s\033[0m" % content
    
    def type_color(content):
        return "\033[0;40;97m%s\033[0m" % content
    
    fmt = property_color('%-50s') + type_color('%-60s\n')
    
    ss = fmt % ('{}.PROPERTIES[ {} ]'.format(message, type(object)), '{}.TYPES'.format(message))
    
    def property_item_color(content):
        return '\033[7;7;48m%s\033[0m' % content
    
    def type_item_color(content):
        # return '\033[7;44;97m%s\033[0m' % content
        # return '\033[7;30;90m%s\033[0m' % content
        return '\033[7;99;94m%s\033[0m' % content
    
    for r_item in r:
        item_ = r_item['item']
        type_ = r_item['type']
        
        if 'method' in type_ or 'function' in type_:
            item_ = message + "." + item_ + '()'
        else:
            item_ = message + "." + item_
        
        _fmt = property_item_color('%-50s') + type_item_color('%-60s\n')
        s = _fmt % (item_, type_)
        ss += s
    
    # fmt = blue("%s:%d <%s>") + " -: " + green_with_bordered("%s") + " = ↓\n" + specify_color("%s\n", color) + "-" * 120
    # print(fmt % (filename, line_number, time.strftime("%H:%M:%S"), 'dir({})'.format(message), ss))
    
    content = '{filename}:{line_number} <{time}> -: {message} = ↓\n{object}{fgx}'.format(
            filename = blue(filename),
            line_number = blue(line_number),
            time = blue(time.strftime("%H:%M:%S")),
            message = '{}{}'.format(green_with_bordered(' dir({}) '.format(message)), purple('[ ' + str(type(object)) + ' ]')),
            object = specify_color(ss + "\n", color),
            fgx = "-" * 120
    )
    print(content)


def dlog_method(obj, information, color = 0, oneline = False):
    filename, line_number, message, co_name = parsing_information(information)
    content = 'call function 【 {} 】'.format(co_name)
    dlog(content, information, color, oneline)


# 打印json对象
def dlog_json(data, information, color = 0, oneline = False):
    try:
        indent = None if oneline == True else 2
        obj = json.dumps(data, sort_keys = True, indent = indent, separators = (', ', ': '), ensure_ascii = False)
        filename, line_number, message, co_name = parsing_information(information)
        
        content = '{filename}:{line_number} <{time}> -: {message} = ↓\n{object}{fgx}'.format(
                filename = blue(filename),
                line_number = blue(line_number),
                time = blue(time.strftime("%H:%M:%S")),
                # message = f'{message}[ {type(obj)} ]'
                message = '{}{}'.format(green_with_bordered(message), purple('[ ' + str(type(data)) + ' ]')),
                object = specify_color(str(obj) + "\n", color),
                fgx = "-" * 120
        )
        print(content)
    
    except Exception as e:
        pretty_map(data, information, color, oneline)


def pretty_map(obj, information, color = 0, oneline = False):
    m = {}
    
    if isinstance(obj, Iterable) == False:
        dlog(str(obj), information, color, oneline)
        return
    
    if hasattr(obj, 'items'):
        
        for key, value in obj.items():
            m[key] = str(value)
        
        # def select_max_len(item):
        #     return len(item)
        
        max_len = max(m.keys(), key = lambda item: len(item))
        
        m = sorted(m.items(), key = lambda item: item[1])
        
        ss = '{\n'
        
        for index, item in enumerate(m):
            if index == len(m) - 1:
                fmt = '\t%-{}s\t:\t%s'.format(len(max_len))
                ss += fmt % (f'"{item[0]}"', f'"{item[1]}"')
            else:
                fmt = '\t%-{}s\t:\t%s\n'.format(len(max_len))
                ss += fmt % (f'"{item[0]}"', f'"{item[1]}"')
        
        ss += '\n}'
    
    else:
        r = []
        for item in obj:
            # 特殊处理
            if str(type(item)) == "<class 'cell'>":
                contents = item.cell_contents
                r.append({'cell': str(item), 'contents': contents})
            else:
                r.append(str(item))
        ss = json_stringify(r, 2)
    
    filename, line_number, message, co_name = parsing_information(information)
    
    # fmt = blue("%s:%d <%s>") + " -: " + green_with_bordered("%s") + " = ↓\n" + specify_color("%s\n", color) + "-" * 120
    # print(fmt % (filename, line_number, time.strftime("%H:%M:%S"), '{}[ {} ]'.format(message, type(obj)), ss))
    
    content = '{filename}:{line_number} <{time}> -: {message} = ↓\n{object}{fgx}'.format(
            filename = blue(filename),
            line_number = blue(line_number),
            time = blue(time.strftime("%H:%M:%S")),
            message = '{}{} | {} |'.format(green_with_bordered(message), purple('[ ' + str(type(obj)) + ' ]'), red('log by pretty_map')),
            object = specify_color(ss + "\n", color),
            fgx = "-" * 120
    )
    print(content)
    
    # m = dict(m)
    # r = json_stringify(m, 2)
    # filename, line_number, message, co_name = parsing_information(information)
    # fmt = blue("%s:%d <%s>") + " -: " + green_with_bordered("%s") + " = ↓\n" + specify_color("%s\n", color) + "-" * 120
    # print(fmt % (filename, line_number, time.strftime("%H:%M:%S"), '{}[ {} ]'.format(message, type(obj)), r))


def json_stringify(data, indent = None, ensure_ascii = False):
    return json.dumps(data, sort_keys = True, indent = indent, separators = (', ', ': '), ensure_ascii = ensure_ascii)


def json_parse(string):
    # def loads(s, encoding=None, cls=None, object_hook=None, parse_float=None, parse_int=None, parse_constant=None, object_pairs_hook=None, **kw):
    return json.loads(string)


def pWriteTextFile(filepath, content):
    with open(filepath, "w", encoding = 'utf-8') as f:
        f.write(str(content) + '\n')


def pAppendTextFile(filepath, content):
    with open(filepath, "a", encoding = 'utf-8') as f:
        f.write(str(content) + '\n')


def pWriteBinaryFile(filepath, content):
    # type(data)
    assert type(content) == bytes, coloring('0;97;41', ' 请传入<class \'bytes\'> ')
    with open(filepath, "wb") as f:
        f.write(content)


def pReadTextFile(filepath):
    with open(filepath, "r", encoding = 'utf-8') as f:
        return f.read()


def pReadBinaryFile(filepath):
    with open(filepath, "rb") as f:
        data = f.read()
        return data


def pReaddir(file_dir):
    # for root, dirs, files in os.walk(file_dir):
    #      print(root)  # 当前目录路径
    #      print(dirs)  # 当前路径下所有子目录
    #      print(files)  # 当前路径下所有非目录子文件
    
    # for file in os.listdir(path):
    #     file_path = os.path.join(path, file)
    #     if os.path.isdir(file_path):
    #         listdir(file_path, list_name)
    #     elif os.path.splitext(file_path)[1] == '.jpeg':
    #         list_name.append(file_path)
    
    return os.listdir(file_dir)
    # for file in os.listdir(file_dir):
    #     print(file)


def pExists(filepath):
    my_file = Path(filepath)
    return my_file.exists()


def toFlatten(arr):
    return list(itertools.chain.from_iterable(arr))


def toMatrix(arr, elementCount):
    r = []
    for i in range(0, len(arr), elementCount):
        r.append(arr[i: i + elementCount])
    return r


# function toMatrix(arr, elementCount) {
#   let r = []
#   for (let i = 0; i < arr.length; i += elementCount) {
#     r.push(arr.slice(i, i + elementCount))
#   }
#   return r
# }

# StoneTool.prototype.pReadBinaryFile = function (filepath) {
#   return new Promise((resolve, reject) => {
#     fs.readFile(filepath, 'binary', function (err, data) {
#       if (err) {reject(err)} else {resolve(data)}
#     })
#   })
# }

if __name__ == "__main__":
    color_test(0, (30, 100), (40, 100))

# print dir(info)
# print os.path.basename(__file__)
# print os.path.basename(filename)
# print info.f_back
# print info.f_builtins
# print info.f_exc_traceback
# print info.f_exc_type
# print info.f_exc_value
# print info.f_globals
# print info.f_lasti
# print info.f_lineno
# print info.f_locals
# print info.f_restricted
# print info.f_trace
# print info.f_code
# print type(info.f_code)
# code = info.f_code
# print code.co_argcount
# print code.co_cellvars
# print code.co_code
# print code.co_consts
# print code.co_filename  # filename
# print code.co_firstlineno  # line number
# print code.co_flags
# print code.co_freevars
# print code.co_lnotab
# print code.co_name  # method name
# print code.co_names
# print code.co_nlocals
# print code.co_stacksize
# print code.co_varnames
# print code.co_filename
# print code.co_name
# print code.co_firstlineno
