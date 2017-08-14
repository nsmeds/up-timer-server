# [Uptimer](https://github.com/nsmeds/up-timer) [![Build Status](https://travis-ci.org/nsmeds/up-timer.svg?branch=master)](https://travis-ci.org/nsmeds/up-timer)

A JavaScript library for managing monitors via the Uptime Robot API. Written with Node.js version 8 for the current [Uptime Robot APIv2](https://uptimerobot.com/api).

## Features
Current features include creating, retrieving, pausing, resuming, deleting and scheduling monitors.

## Installation
```npm install up-timer```

Alternatively, you can clone or fork repo, `npm install` dependencies and `npm test` to run tests. An optional development server with cron capabilities can be run via `npm start`.

## Example usage
Get an API key from [Uptime Robot](https://uptimerobot.com/api) and either pass it to your instantiation function or store it as an environment variable named UPTIMER.
```javascript
const Uptimer = require('up-timer');
const client = new Uptimer('myAPIkey'); // if UPTIMER env var exists, this function can be called without arguments

client.getMonitors(); // Get all your Uptime Robot monitors. 
client.listMonitors(); // Get all monitors and list by ID, name and status.
client.pauseAll(); // Pause monitors.
client.resumeAll(); // Resume monitors.
client.create('name', 'url', 'method'); // Create a monitor. Name is up to you. Url must be a valid url. Method can be 'http', 'https', 'keyword', 'ping' or 'port'.
client.pause('monitorId') // Pause a single monitor.
client.resume('monitorId') // Resume a single monitor.
client.delete('monitorId') // Delete a single monitor.
```