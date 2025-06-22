# ip-api

A very simple to use API to get your IP address

## Usage

You can get your IP address by performing a `GET /` request. You can provide multiple formats by adding `?format=text` at the end.

### Formats

| Format             | Example response                 |
| ------------------ | -------------------------------- |
| `text` *(default)* | `12.34.567.89`                   |
| `json`             | `{ "ip": "12.34.567.89" }`       |
| `xml`              | `<ip>12.34.567.89</ip>`          |
| `js`               | `ipcallback("12.34.567.89");`    |
| `html`             | `<p>12.34.567.89</p>`            |
| `yaml`             | `ip: 12.34.567.89`               |
| `csv`              | `ip \n 12.34.567.89`             |
| `ini`              | `ip=12.34.567.89`                |
| `php`              | `array('ip' => '12.34.567.89');` |

For the `js` format you can add `&callbackname=your_js_function_name` and replace `your_js_function_name` with your own Javascript function to use for the callback, otherwise `ipcallback` is used.

### CORS

The CORS is set to accept all domains

## Options
Below is a table of the environment variables that control this API:

| Environment variable      | Value             | Default | Description                                         |
| ------------------------- | ----------------- | ------- | --------------------------------------------------- |
| `PORT`                    | Number            | `3000`  | The port the webserver listens on                   |
| `BEHIND_CLOUDFLARE_PROXY` | `true` or `false` | `false` | Whether this service sits behind a Cloudflare proxy |