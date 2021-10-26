-- roblox-ts has limitations when dealing with ReplicatedFirst
-- which is understandable considering all assets of the game aren't loaded yet during that time ofc
local service: ReplicatedFirst = script.Parent.Parent

-- get rid of that default loading screen
service:RemoveDefaultLoadingScreen()
