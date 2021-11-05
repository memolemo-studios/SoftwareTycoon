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
	"Lighting"
}

-- IsA method does not exists in Remodel
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

	local shouldBeDirectory = object.ClassName == "Folder"
	print("Extracting " .. (shouldBeDirectory and "directory" or "file") .. ": " .. location)

	-- Folders should be considered as a directory
	if shouldBeDirectory then
		return extractDirectory(object, location .. "/")
	end

	-- Extraction process!
	remodel.writeModelFile(object, location .. ".rbxmx")
end

-- Extracts any folder to a directory
function extractDirectory(object, location)
	-- Make a new directory
	remodel.createDirAll(location)

	-- Extract object's children
	for _, child in ipairs(object:GetChildren()) do
		extractFile(child, location .. child.Name)
	end
end

-- Iterate every extractable services
for _, service_name in ipairs(services) do
	local real_service = game:GetService(service_name)
	extractDirectory(real_service, "assets/services/" .. service_name .. "/")
end

local ReplicatedStorage = game:GetService("ReplicatedStorage")

-- Since we have a futureproof way to do this, we can actually extract
-- placement and prefab assets found in the game, however Rojo won't load
-- any mesh related issues in it right?
extractDirectory(ReplicatedStorage.Assets.placement, "assets/game/placement/")
extractDirectory(ReplicatedStorage.Assets.prefabs, "assets/game/prefabs/")
