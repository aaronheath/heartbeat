#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const util = require('util');
const os = require('os');
const Raven = require('raven');
const winston = require('winston');
const bo = require('basic-oauth2');
const getRepoInfo = require('git-repo-info');
const diskusage = require('diskusage');

function init() {
    initLogs();
    log('Starting Heartbeat');

    const config = loadConfig();

    initSentry(config);
    log('Sentry Loaded');

    return config;
}

function hostDir() {
    return path.dirname(require.main.filename);
}

function initLogs() {
    winston.add(winston.transports.File, {filename: `${hostDir()}/heartbeat.log`});
    winston.remove(winston.transports.Console);
}

function log(msg, level = 'info') {
    const parsedMsg = typeof msg === 'object' ? util.inspect(msg) : msg;

    winston.log(level, parsedMsg);
}

function loadConfig() {
    const configPath = `${hostDir()}/.config.json`;

    if(!fs.existsSync(configPath)) {
        throw '.config.json configuration file does not exist.';
    }

    const config = require(configPath);

    if(!config.endpoint) {
        throw 'endpoint is not set within .config.json configuration file.';
    }

    return config;
}

function initSentry(config) {
    if(!config.sentry || !config.sentry.dsn) {
        throw 'dsn is not set within .config.json configuration file.'
    }

    const git = getRepoInfo();

    Raven.config(config.sentry.dsn, {release: git.sha, extra: {git: {branch: git.branch}}}).install();
}

function systemInfo() {
    const disk = diskusage.checkSync('/');

    return {
        hostname: os.hostname(),
        cpu_arch: os.arch(),
        free_memory: os.freemem(),
        total_memory: os.totalmem(),
        load_average: os.loadavg(),
        network_interfaces: os.networkInterfaces(),
        platform: os.platform(),
        release: os.release(),
        uptime: os.uptime(),
        disk_available: disk.available,
        disk_free: disk.free,
        disk_total: disk.total,
    };
}

async function run() {
    try {
        const config = init();

        const info = systemInfo();

        log('Sending server information to server');
        const http = await bo.http();
        await http.post(config.endpoint, info);

        log('Finished');
    } catch(error) {
        log(error, 'error');
        Raven.captureException(error);
        throw error;
    }
}

run();
