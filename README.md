# ralph

8bit Nation bespoke mod helper bot

# Installation

1. install node.js v8.11.0+

        $ wget https://nodejs.org/dist/v8.11.1/node-v8.11.1-linux-x64.tar.xz
        $ sudo tar -C /usr/local --strip-components 1 -xf node-v8.11.1-linux-x64.tar.xz 

2. git clone https://github.com/8bitnation/ralph.git
3. npm install
4. edit ecosystem.config.js as required

        DISCORD_TOKEN = <BOT/BUILD-AT-BOT/TOKEN>
        BUNGIE_TOKEN = <BUNGIE-X-API-KEY>
        CLANS = <command separated list of bungie group IDs>

5. start the bot via pm2 

        npm run pm2 start ralph

# discord

- Create a new app here: https://discordapp.com/developers/applications/
- Convert it to a bot account
- Get the client id and follow: https://discordapp.com/oauth2/authorize?scope=bot&client_id=CLIENT_ID
- Get your token from the bot account page
