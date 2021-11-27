-- I hate dealing with LuaTuple types
local defined_type = {
	Validate = function(value)
		return value ~= nil
	end,
	Parse = function(value)
		return value
	end,
}

return function(registry)
	registry:RegisterType("defined", defined_type)
end
