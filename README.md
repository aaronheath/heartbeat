# Heartbeat

A script run on my systems to report back to a central server with some basic information as to the status of executing system.

Information communicated:

* Hostname
* CPU arch
* Free memory
* Used memory
* Load average
* Network interfaces
* Platform
* Release
* Uptime
* Disk Free (/)
* Disk Used (/)
* Disk Total (/)

The script is designed for *nix based systems however with a little modification could easily run on Windows. I simply don't run any Windows machines so didn't bother.

Authentication with the central server is achieved via OAuth2 using a client configuration.

## Installation

Clone from [GitHub](https://github.com/aaronheath/heartbeat):

```bash
git clone git@github.com:aaronheath/heartbeat.git
```

## Configuration

Configuration of central server API endpoint and Sentry DSN is required.

```javascript
{
  "endpoint": "https://example.com/api/heartbeat",
  "sentry" : {
    "dsn": "https://xxx@sentry.io/xxx"
  }
}
```

Configuration of OAuth2 is also required via an .oauth-config.json file. See [basic-oauth2](https://github.com/aaronheath/basic-oauth2#configuration) for details of this file.

## Usage

The script can be executed via the following command:

```bash
./heartbeat.js
```

To schedule the script to execute periodically, setup a cronjob:

```bash
crontab -e
```

The add one the following line depending on how often the script to run:

```bash
# Every 15 Minutes
*/15 * * * * node /path/to/repo/heartbeat.js

# Every 30 Minutes
*/30 * * * * node /path/to/repo/heartbeat.js

# Hourly
0 * * * * node /path/to/repo/heartbeat.js

# Every Three Horus
0 */3 * * * node /path/to/repo/heartbeat.js
```

## Tests

*One day...*

## Author

[Aaron Heath](https://aaronheath.com)

## License

MIT