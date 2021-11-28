-- Load the repository's built game file
local game = remodel.readPlaceFile("./build.rbxlx")

-- Classes that shouldn't be extracted automatically
local excluded_classes = {
	"ModuleScript",
	"Script",
	"LocalScript",
	"Terrain",
	"Camera"
}

-- Only extract services when it needs to in the table
local services = {
	"Workspace",
	"Lighting",
	"ReplicatedStorage",
}

-- Excluded instances
local excluded_instances = {
	"ReplicatedStorage.Game",
	"ReplicatedStorage.rbxts_include"
}

local function log(message, ...)
	print(string.format(message, ...))
end

-- Alternative to table.find
local function find(tbl, value)
	for i, v in ipairs(tbl) do
		if v == value then
			return i, v
		end
	end
	return nil, nil
end

-- IsA method does not exists in Remodel but I have to use base classname
local function isObjectExcluded(object)
	for _, class_name in ipairs(excluded_classes) do
		if object.ClassName == class_name then
			return true
		end
	end
	return false
end

-- Extracts any file to real rojo file
function extractFile(object, location)
	-- Make sure that object is not a BaseScript
	if isObjectExcluded(object) then return end
	local is_directory = object.ClassName == "Folder"

	-- Folders should be considered as a directory
	if is_directory then
		return extractDirectory(object, location .. "/")
	end

	-- Extraction process!
	log("Extracting file: %s", location)
	remodel.writeModelFile(object, location .. ".rbxmx")
end

-- Extracts any folder to a directory
function extractDirectory(object, location)
	-- If that object is in the excluded list, do not include it
	if find(excluded_instances, object:GetFullName()) ~= nil then return end

	-- Make a new directory
	log("Extracting directory: %s", location)
	remodel.createDirAll(location)

	-- Extract object's children
	for _, child in ipairs(object:GetChildren()) do
		extractFile(child, location .. child.Name)
	end
end

-- Iterate every extractable services
for _, service_name in ipairs(services) do
	local real_service = game:GetService(service_name)
	extractDirectory(real_service, "assets/game/" .. service_name .. "/")
end
