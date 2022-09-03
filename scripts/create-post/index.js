#!/usr/bin/env node

import { hideBin } from 'yargs/helpers'
import yargs from 'yargs/yargs'

import * as post from './command.js'

export const argv = yargs(hideBin(process.argv)).command(
  '$0',
  'Create a new blog post',
  post
).argv
