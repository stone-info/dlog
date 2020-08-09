
function os.capture(cmd, raw)
    local f = assert(io.popen(cmd, 'r'))
    local s = assert(f:read('*a'))
    s = string.gsub(s, '[\n]+', '/')
    f:close()
    if raw then
        return s
    end
    s = string.gsub(s, '^%s+', '')
    s = string.gsub(s, '%s+$', '')
    s = string.gsub(s, '[\n\r]+', ' ')
    return s
end

function split(s, delimiter)
    result = {};
    for match in (s..delimiter):gmatch("(.-)"..delimiter) do
        table.insert(result, match);
    end
    return result;
end


function dlog(...)
    traceback = debug.traceback()
    --print(traceback)
    list = split(traceback, '\n')
    maintrace = list[3]
    list = split(maintrace, ":")
    filename = list[1]
    filename = string.gsub(filename, '\t', '')
    line = list[#list-1]
    str = os.capture('pwd', true) .. debug.getinfo(1, "S").short_src
    str = os.capture('pwd', true) .. filename .. ':' .. line .. ':\n'
    local printResult = ""
    for i, v in ipairs { ... } do
        printResult = printResult .. tostring(v) .. "\t"
    end
    printResult = str .. printResult
    printResult = printResult .. "\n------------------------------------------------------------"
    print(printResult)
end

return dlog