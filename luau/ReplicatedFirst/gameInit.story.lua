local RunService = game:GetService("RunService")

-- Standalone version of Thread.Loop because of ReplicatedFirst
local function loop(interval: number, callback: () -> nil): RBXScriptConnection
	local conn
	local lastTime = os.clock()
	conn = RunService.RenderStepped:Connect(function()
		local now = os.clock()
		local diff = now - lastTime
		if diff >= interval then
			lastTime = now
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

return function(parent: Instance)
	local blackout = make("Frame", {
		BackgroundColor3 = Color3.new(),
		Size = UDim2.fromScale(1, 1),
		Parent = parent,
	}, {
		Message = make("TextLabel", {
			BackgroundTransparency = 1,
			Font = Enum.Font.FredokaOne,
			Size = UDim2.fromScale(1, 1),
			Text = "Loading Game",
			TextColor3 = Color3.new(1, 1, 1),
			TextSize = 42,
		}),
	})
	local i = -1
	local conn = loop(.5, function()
		i = i == 3 and 0 or i + 1
		blackout.Message.Text = "Loading Game" .. ("."):rep(i)
	end)
	return function()
		conn:Disconnect()
		blackout:Destroy()
	end
end
