local FlagManager = {}

local None = newproxy(true)
local PrivateKey = newproxy(true)

function FlagManager.new(initialValues)
	for key, value in pairs(initialValues) do
		if value == nil then
			error(string.format("Bad value (%s): the value must be not nil or use `None` provided with FlagManager",
				tostring(key)), 2)
		end
	end
	return setmetatable({
		[PrivateKey] = initialValues,
	}, FlagManager)
end

function FlagManager:__newindex()
	error("FlagManager is readonly", 2)
end

function FlagManager:getAllFlags()
	local flags = {}
	for key in pairs(rawget(self, PrivateKey)) do
		table.insert(flags, key)
	end
	return flags
end

function FlagManager:isFlagExists(flag)
	for key in pairs(rawget(self, PrivateKey)) do
		if key == flag then
			return true
		end
	end
	return false
end

function FlagManager:setEntry(key, value)
	local entries = rawget(self, PrivateKey)
	if entries[key] == nil then
		error(string.format("%s is not registered as 'flag'. Please register it in constructor", tostring(key)))
	end
	if value == nil then
		value = None
	end
	entries[key] = value
end

function FlagManager:__index(key)
	local from_entry = rawget(self, PrivateKey)[key]
	if from_entry ~= nil then
		if from_entry == None then
			return nil
		end
		return from_entry
	end
	local prototype_method = FlagManager[key]
	if prototype_method ~= nil then
		return prototype_method
	end
	error(string.format("%s is not a valid member of FlagManager",
		tostring(key)), 2)
end

FlagManager.None = None

return setmetatable(FlagManager, {
	__tostring = function()
		return "FlagManager"
	end,
})
