#!/usr/bin/env node

require('dotenv').config({ path: '../.env' });

const axios = require('./utils/axiosInstance');
const { Command } = require('commander');
const fs = require('fs');
const path = require('path');
const db = require('../back-end/utils/db');

const validFormats = ['json', 'csv'];

const program = new Command();

require('./commands/login')(program);
require('./commands/logout')(program);
require('./commands/healthcheck')(program);
require('./commands/resetstations')(program);
require('./commands/resetpasses')(program);
require('./commands/tollstationpasses')(program);
require('./commands/passanalysis')(program);
require('./commands/passescost')(program);
require('./commands/admin')(program);

program.parse(process.argv);
