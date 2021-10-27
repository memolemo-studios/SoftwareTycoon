-- roblox-ts has limitations when dealing with ReplicatedFirst
-- which is understandable considering all assets of the game aren't loaded yet during that time ofc
local service: ReplicatedFirst = script.Parent.Parent
local RunService = game:GetService("RunService")

-- Standalone version of Thread.Loop because of ReplicatedFirst
local function loop(interval: number, callback: () -> nil): RBXScriptConnection
	local conn
	local last_time = os.clock()
	conn = RunService.RenderStepped:Connect(function()
		local now = os.clock()
		local diff = now - last_time
		if diff >= interval then
			last_time = now
			callback()
		end
	end)
	return conn
end

-- Fake Roact and Fusion function wrapper
local function make(className, props, children)
	local _obj = Instance.new(className)
	for prop_name, prop_value in pairs(props) do
		_obj[prop_name] = prop_value
	end
	for child_name, child in pairs(children or {}) do
		child.Parent = _obj
		child.Name = child_name
	end
	return _obj
end

-- https://devforum.roblox.com/t/removing-the-default-loading-screen/14508/3
local player_gui: PlayerGui = game:GetService("Players").LocalPlayer:WaitForChild("PlayerGui")

-- blackout frame
local blackout = make("Frame", {
	BackgroundColor3 = Color3.new(),
	Size = UDim2.new(1, 0, 1, 40),
}, {
	Container = make("Frame", {
		BackgroundTransparency = 1,
		Position = UDim2.fromOffset(0, -40),
		Size = UDim2.fromScale(1, 1),
	}, {
		Message = make("TextLabel", {
			BackgroundTransparency = 1,
			Font = Enum.Font.FredokaOne,
			Size = UDim2.fromScale(1, 1),
			Text = "Loading Game",
			TextColor3 = Color3.new(1, 1, 1),
			TextSize = 42,
		}),
	}),
})

local wrapper = make("ScreenGui", {
	Name = "blackout_gui",
	Parent = player_gui,
	ResetOnSpawn = false,
	DisplayOrder = 10,
}, {
	Blackout = blackout,
})

local conn do
	local i = -1
	conn = loop(0.5, function()
		i = i == 3 and 0 or i + 1
		blackout.Container.Message.Text = "Loading Game" .. ("."):rep(i)
	end)
end

-- get rid of that default loading screen
service:RemoveDefaultLoadingScreen()

local StarterGui = game:GetService("StarterGui")
repeat
	RunService.RenderStepped:Wait()
until pcall(function()
	StarterGui:SetCoreGuiEnabled(Enum.CoreGuiType.All, false)
end)

-- waiting unti the game is loaded
if not game:IsLoaded() then
	game.Loaded:Wait()
end

task.wait(5)

local i = 0
while true do
	i += RunService.RenderStepped:Wait()
	if i >= 1 then
		break
	end
	blackout.BackgroundTransparency = i
	blackout.Container.Message.TextTransparency = i
end
conn:Disconnect()
wrapper:Destroy()
