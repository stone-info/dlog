#!/usr/bin/env bash

# 条件判别表达式 : 真0 , 假1

# color
function success() { echo -e "\e[1;32m$1\e[0m"; }

function error() { echo -e "\e[1;31m$1\e[0m"; }

function warning() { echo -e "\e[1;33m$1\e[0m"; }

function normal() { echo -e "\e[1;38m$1\e[0m"; }

function lock_IFS_begin() {
    SAVE_IFS=$IFS
    IFS=$'\n'
}
function lock_begin() {
    SAVE_IFS=$IFS
    IFS=$'\n'
}

function lock_IFS_end() { IFS=${SAVE_IFS}; }
function lock_end() { IFS=${SAVE_IFS}; }

# 去除前后空格
function trim() {
    local var="$*"
    local var="${var#"${var%%[![:space:]]*}"}"
    local var="${var%"${var##*[![:space:]]}"}"
    # -n 不要打印尾换行符
    echo -n "$var"
}

# 分割线
function fgx() {
    echo -e "\033[0;32;1m=============================================\033[0m"
}

# 行号
function line() {
    echo "${BASH_LINENO}"
}

function func() {
    local name="method"

    local count="${#BASH_SOURCE[*]}"
    local len=$((count - 1))
    #  dlog_file_path=$(echo ${BASH_SOURCE[len]})
    local dlog_file_path="$PWD/${BASH_SOURCE[len]##*/}"

    echo -e "\033[0;34;1m${dlog_file_path}:${BASH_LINENO}\033[0m :- \033[0;32;1m${name}\033[0m = ↓"
    if [ -z $1 ]; then
        echo "call function : main"
    else
        echo "call function : $1"
    fi
}

# 当前文件的目录
function folder() {
    echo "$(dirname $0)"
}

function dlog() {

    local count="${#BASH_SOURCE[*]}"
    local len=$((count - 1))
    #  dlog_file_path=$(echo ${BASH_SOURCE[len]})
    local dlog_file_path="$PWD/${BASH_SOURCE[len]##*/}"

    # last="${@:(-1)}"
    last="${!#}"

    if [ $# -lt 2 ]; then
        # 1个或0个参数
        local message="message"
        echo -e "\033[0;34;1m${dlog_file_path}:${BASH_LINENO}\033[0m :- \033[0;32;1m${message}\033[0m = ↓"
        #        echo -e "\033[0;34;1m${PWD}:${BASH_LINENO}\033[0m :- \033[0;32;1m${message}\033[0m = ↓"
        echo $*
    else
        local message=$last
        echo -e "\033[0;34;1m${dlog_file_path}:${BASH_LINENO}\033[0m :- \033[0;32;1m${message}\033[0m = ↓"
        #        echo -e "\033[0;34;1m${PWD}:${BASH_LINENO}\033[0m :- \033[0;32;1m${message}\033[0m = ↓"
        #        echo ${*%"${!#/$0/}"*}
        echo "${*%"${!#}"*}" # $# 最后一个元素的下标 ${!#}最后一个元素

    #   Linux获取最后一个参数（参数统计）
    #   https://blog.csdn.net/huangbaokang/article/details/86216661
    # 感叹号什么用法??? 间接引用
    # https://blog.csdn.net/hepeng597/article/details/8057692
    fi
}

function get_os() {

    # uname [-amnrsv][--help][--version]
    #参数说明：
    #
    #-a或--all 　显示全部的信息。
    #-m或--machine 　显示电脑类型。
    #-n或-nodename 　显示在网络上的主机名称。
    #-r或--release 　显示操作系统的发行编号。
    #-s或--sysname 　显示操作系统名称。
    #-v 　显示操作系统的版本。
    #--help 　显示帮助。
    #--version 　显示版本信息。

    if [[ "$(uname)" == "Darwin" ]]; then
        # Mac OS X 操作系统
        #    echo "Mac OS X 操作系统"
        echo "darwin"

    elif [[ "$(expr substr $(uname -s) 1 5)" == "Linux" ]]; then
        # GNU/Linux操作系统
        #    echo "GNU/Linux操作系统"
        echo "linux"
    elif [[ "$(expr substr $(uname -s) 1 10)" == "MINGW32_NT" ]]; then
        # Windows NT操作系统
        #    echo "Windows NT操作系统"
        echo "windows"
    fi
}

function get_os_more_detail() {
    if [[ "$(uname)" == "Darwin" ]]; then
        # Mac OS X 操作系统
        #    echo "Mac OS X 操作系统"
        echo "darwin"
    elif [[ "$(expr substr $(uname -s) 1 5)" == "Linux" ]]; then
        # GNU/Linux操作系统
        #    echo "GNU/Linux操作系统"
        #    echo "linux"
        cat /etc/redhat-release > /dev/null 2>&1
        if [ $? -eq 0 ]; then
            echo "linux-centos" # cat /etc/redhat-release 查看版本
        else
            echo "linux-ubantu" # cat /etc/lsb-release 查看版本
        fi
    elif [[ "$(expr substr $(uname -s) 1 10)" == "MINGW32_NT" ]]; then
        # Windows NT操作系统
        #    echo "Windows NT操作系统"
        echo "windows"
    fi
}
