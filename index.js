// © 2025 Oscar Knap - Alle rechten voorbehouden

const express = require('express');

const env = {
    port: process.env.PORT || 3000,
    cloudflareProxy: [true, 'true'].includes(process.env.CLOUDFLARE_PROXY ?? false)
};

function getIp(req) {
    if (env.cloudflareProxy) {
        if (req.headers['cf-connecting-ip'])
            return req.headers['cf-connecting-ip'];
        else
            console.warn(new Error('BEHIND_CLOUDFLARE_PROXY is true, but CF-Connecting-IP header is missing. Set BEHIND_CLOUDFLARE_PROXY to false, because users can now spoof their IP address'));
    }

    return req.ip;
}

const allowedFormats = ['text', 'json', 'xml', 'js', 'html', 'yaml', 'csv', 'ini', 'php'];
function parseIp(ip, req) {
    let format = req.query.format || 'text';

    if (!allowedFormats.includes(format))
        format = 'text';

    if (format === 'text')
        return { text: ip, contentType: 'text/plain' };
    else if (format === 'json')
        return { text: JSON.stringify({ ip }), contentType: 'application/json' };
    else if (format === 'xml')
        return { text: `<ip>${ip}</ip>`, contentType: 'text/xml' };
    else if (format === 'js') {
        const callbackName = req.query.callbackname || 'ipcallback';
        return { text: `${callbackName}("${ip}");`, contentType: 'application/javascript' };
    } else if (format === 'html')
        return { text: `<p>${ip}</p>`, contentType: 'text/html' };
    else if (format === 'yaml')
        return { text: `ip: ${ip}`, contentType: 'text/yaml' };
    else if (format === 'csv')
        return { text: `ip\n${ip}`, contentType: 'text/csv' };
    else if (format === 'ini')
        return { text: `ip=${ip}`, contentType: 'text/ini' };
    else if (format === 'php')
        return { text: `array('ip' => '${ip}');`, contentType: 'application/php' };
    else
        throw new Error(`Unknown format: ${format}`);
}

const app = express();

app.use('/', (req, res, next) => {
    if (req.path !== '/') {
        const format = req.query?.format || 'text';
        const callbackname = req.query?.callbackname || 'ipcallback';
        return res.redirect(`/?format=${format}${format === 'js' ? `&callbackname=${callbackname}` : ''}`);
    }

    if (!['HEAD', 'GET'].includes(req.method))
        return res.status(405).send('Method not allowed');

    return next();
});

app.get('/', (req, res, next) => {
    try {
        const ip = getIp(req);
        if (!ip) {
            console.warn(new Error('No IP found on request'));
            return res.status(500).send('');
        }

        const { text, contentType } = parseIp(ip, req);

        return res.type(contentType).send(text);
    } catch (e) {
        console.error(e);
        return res.status(500).send('');
    }
});

app.listen(env.port, () => console.log(`IP API is running on port ${env.port}`));