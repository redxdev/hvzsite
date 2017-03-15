# Access Levels

The following access levels exist at this time, in order from lowest level to highest:

* `unknown`: Not an actual access level, returned when there is an error. Has a value of -100.
* `inactive`: Represents a player that has not been activated yet.
* `player`: A normal player that may participate in the game.
* `hidden`: Has the same access level as `player`, but does not appear in the player list.
* `mod`: A moderator. Moderators have severely restricted access to the admin panel.
* `admin`: An administrator. Full access to the admin panel, bar notifications and API keys.
* `superadmin`: Full access to everything. Basically the same as `admin`, but can also view API keys and
OneSignal notification/device keys.
