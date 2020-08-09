#!/usr/bin/ruby
# -*- coding: UTF-8 -*-

require 'fileutils'
require 'date'
require 'set'
require 'pp'

class String
  def log
    # dlog(%q|self.inspect = | + "#{self.inspect}")
    caller_infos = caller.first.split(":")
    begin
      fmt = "%s:%d <%s>-:▼\n\033[1;7;48m %s \033[0m\n" + "-" * 80
      puts fmt % [caller_infos[0].to_s, caller_infos[1], Time.new.strftime("%H:%M:%S"), self.inspect]
    rescue => err
      puts("\033[1;97;41m error: %s \033[0m" % err)
    ensure
      # puts"Ensuring execution"
    end
  end
  
  # def +(other)
  #   "#{self}#{other}"
  # end
end

def get_color(color)
  case color
    when 0
      a = '1;7;48'
    when 1
      a = '1;44;97'
    when 2
      a = '1;97;42'
    when 3
      a = '1;97;41'
    when 4
      a = '1;0;0'
    else
      a = '1;7;48'
  end
  a
end

def blue(content)
  # "\033[1;34;4m%s:%d <%s>-:▼ %s\n\033[0m"
  return "\033[1;34;4m#{content}\033[0m"
end

def green(content)
  # "\033[1;34;4m%s:%d <%s>-:▼ %s\n\033[0m"
  return "\033[1;32;4m#{content}\033[0m"
end

def specify_color(content, c)
  _color = get_color(c)
  return "\033[#{_color}m #{content}\033[0m"
end

# def dlog (o, color = 0, inline = false, info = true)
def dlog_json(o, info = "json")
  # a            = '1;7;48'
  # fmt          = "\033[1;34;4m%s:%d <%s>-:▼ %s\n\033[0m"
  # fmt          = blue("%s:%d <%s> -: #{green("%s")} = ↓\n")
  fmt          = blue("%s:%d <%s>") + " -: " + green("%s") + " = ↓\n"
  caller_infos = caller.first.split(":")
  print fmt % [
      caller_infos[0].to_s,
      caller_infos[1],
      Time.new.strftime("%H:%M:%S"),
      info
  ]
  pp o
end

def fgx
  # print "\033[1;7;92m\n\033[0m"
  print "\033[1;7;94m\n\033[0m"
  # print "\033[1;7;92m\n\033[0m"
end

def dlog(obj, info = "anonymous", c = 0)
  fmt          = blue("%s:%d <%s>") + " -: " + green("%s") + " = ↓\n" + specify_color("%s\n", c) + "-" * 120
  caller_infos = caller.first.split(":")
  puts fmt % [caller_infos[0].to_s, caller_infos[1], Time.new.strftime("%H:%M:%S"), info, obj.to_s]
end

def dlog_inheritance_hierarchy(obj, info = "anonymous", c = 0)
  fmt          = blue("%s:%d <%s>") + " -: " + green("%s") + " = ↓\n" + specify_color("%s\n", c) + "-" * 120
  caller_infos = caller.first.split(":")
  
  if obj.is_a? Class
    # dlog("#{obj.ancestors}", %Q{obj.ancestors})
    puts fmt % [caller_infos[0].to_s, caller_infos[1], Time.new.strftime("%H:%M:%S"), "inheritance_hierarchy", "#{obj.ancestors}"]
  else
    # dlog("#{obj.class.ancestors}", %Q{obj.class.ancestors})
    puts fmt % [caller_infos[0].to_s, caller_infos[1], Time.new.strftime("%H:%M:%S"), "inheritance_hierarchy", "#{obj.class.ancestors}"]
  end
end


def dlog_func(cls, m, c = 0)
  
  f = "#{cls}".include?('#<')
  
  if f
    class_name = "#{cls.class}"
  else
    class_name = "#{cls}"
  end
  
  o = class_name + " | " + (f ? 'instance' : 'class') + %q| method \| | + "【 #{m} 】"
  
  fmt = blue("%s:%d <%s>") + " -: " + green("%s") + " = ↓\n" + specify_color("%s\n", c) + "-" * 120
  
  caller_infos = caller.first.split(":")
  
  puts fmt % [caller_infos[0].to_s, caller_infos[1], Time.new.strftime("%H:%M:%S"), "method", o.to_s]

end

def get_uuid
  aa     = ("_color".."z").to_a + ("A".."Z").to_a + ("0".."9").to_a
  number = ""
  32.times do
    number << aa.sample
  end
  number
end

def get_number_array(length = 10)
  number_arr = []
  length.times do
    number_arr << rand(0..1000)
  end
  number_arr
end

def say(obj)
  system "say " + "#{obj}"
end

RY_FORMATS = ['%d/%m/%y', '%Y %m %d']

def try_to_parse(s)
  parsed = nil
  TRY_FORMATS.each do |format|
    
    begin
      parsed = Date.strptime(s, format)
      break
    rescue ArgumentError
      #
    end
  end
  parsed
end