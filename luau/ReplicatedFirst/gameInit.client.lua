-- roblox-ts has limitations when dealing with ReplicatedFirst
-- which is understandable considering all assets of the game aren't loaded yet during that time ofc
local service: ReplicatedFirst = script.Parent.Parent

-- https://devforum.roblox.com/t/removing-the-default-loading-screen/14508/3
game:GetService("Players").LocalPlayer:WaitForChild("PlayerGui")

-- get rid of that default loading screen
service:RemoveDefaultLoadingScreen()
