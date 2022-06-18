---@diagnostic disable: undefined-global
local game = remodel.readPlaceFile("./game.rbxlx")

-- It is easier to index an object and tell if it has one
local function setify(members)
    local t = {}
    for _, member in ipairs(members) do
        t[member] = true
    end
    return t
end

-- Some instances are not necessary to put there
local excludedClasses = setify({
    "ModuleScript",
    "Script",
    "LocalScript",
    "Camera",
})

local extractableServices = {
    "Workspace",
    "Lighting",
    "ServerStorage",
    "ReplicatedStorage",
}

local excludedInstances = setify({
    "ReplicatedStorage.TS",
    "ReplicatedStorage.rbxts_include",
})

local function getFullName(object)
    local ancestors = {}
    while object ~= game do
        table.insert(ancestors, 1, object.Name)
        object = object.Parent
    end
    return table.concat(ancestors, ".")
end

local function canObjectExtract(object)
    return excludedClasses[object.ClassName] == nil
end

local function extractFile(object, location)
    if canObjectExtract(object) then
        local isDirectory = object.ClassName == "Folder"
        print(("Extracting %s: %s"):format(isDirectory and "directory" or "file", location))
        if isDirectory then
            return extractDirectory(object, location .. "/")
        end
        remodel.writeModelFile(object, location .. ".rbxmx")
    end
end

function extractDirectory(object, location)
    remodel.createDirAll(location)
    local children = {}
    for _, child in ipairs(object:GetChildren()) do
        if excludedInstances[getFullName(child)] == nil then
            table.insert(children, child)
        end
    end
    if #children > 0 then
        for _, child in ipairs(children) do
            extractFile(child, location .. child.Name)
        end
    else
        print("Adding file: " .. location .. ".gitkeep")
        local file = io.open(location .. ".gitkeep", "w")
        if file == nil then
            error(("Failed to open file: %s.gitkeep"):format(location))
        end
        if not file:write() then
            error(("Unable to write file: %s.gitkeep"):format(location))
        end
        assert(file:close())
    end
end

for _, serviceName in ipairs(extractableServices) do
    local service = game:GetService(serviceName)
    extractDirectory(service, "assets/game/" .. serviceName .. "/")
end
