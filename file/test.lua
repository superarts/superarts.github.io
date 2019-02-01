funcs = {
	say = function(arg) 
		print('say: ' .. arg)
		native_say(arg)
	end,
	askInput = function(arg)
		print('ask: ' .. arg)
		native_say(arg)
	end,
	askScan = function(arg)
		print('ask: ' .. arg)
		native_say(arg)
	end,
	input = function(arg)
		print('INPUT')
		native_input(arg)
	end,
	scan = function(arg) 
		print('SCAN')
		native_scan(arg)
	end,
}

-- command sequence
local commands = { {
	cmd = 'say',
	arg = 'Hi there!'
}, {
	cmd = 'askInput',
	arg = 'Let\'s start with picking a nickname, OK?'
}, {
	cmd = 'input',
	arg = '__NICKNAME__',
}, {
	cmd = 'say',
	arg = 'Thank you __NICKNAME__!',
}, {
	cmd = 'askScan',
	arg = 'Now we\'re going to check your driver\'s license.',
}, {
	cmd = 'scan',
	arg = '',
}, {
	cmd = 'say',
	arg = 'Thanks again, __NICKNAME__!',
}, {
	cmd = 'say',
	arg = "Info obtained:\n\nName: '__FULL_NAME__'\nAddress: '__ADDRESS__'\nCity: '__CITY__'",
} }

-- stored words, e.g. __NICKNAME__=MyUsername
local dictionary = {
}

index = 0
function lua_process()
	index = index + 1
	command = commands[index]
	-- print(command.cmd .. '/' .. command.arg)
	str = command.arg
	for key, value in pairs(dictionary) do
		-- print(key .. '/' .. value)
		str = str:gsub(key, value)
	end
	funcs[command.cmd](str)
end

function lua_input(text)
	print('INPUT: ' .. text)
	command = commands[index]
	dictionary[command.arg] = text
end

function lua_scan(dict)
	print('SCAN: ' .. dict['Address'])
	dictionary['__ADDRESS__'] = dict['Address']
	dictionary['__CITY__'] = dict['City']
	dictionary['__FIRST_NAME__'] = dict['First Name']
	dictionary['__LAST_NAME__'] = dict['Last Name']
	dictionary['__FULL_NAME__'] = dict['First Name'] .. ' ' .. dict['Last Name']
end

-- lua_process()
--[[
for index, command in pairs(commands) do
	-- print(index)
	-- print(command.cmd)
	-- print(command.arg)
	funcs[command.cmd](command.arg)
end
]]