#!/usr/bin/env bun

import { readPackageJSON } from '@4lch4/backpack/utils'
import { program } from 'commander'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { buildCommands } from './cmd'

const __dirname = dirname(fileURLToPath(import.meta.url))

async function setup() {
  try {
    const pkg = await readPackageJSON(join(__dirname, '..', 'package.json'))

    const Apollo = program
      .name(pkg.name || 'Placeholder')
      .description(pkg.description || 'Placeholder')
      .version(pkg.version || '0.0.0')

    for (const command of await buildCommands()) {
      Apollo.addCommand(command)
    }

    return Apollo.parse(process.argv)
  } catch (error) {
    console.error('Error caught while setting up Apollo...')
    console.error(error)

    return undefined
  }
}

setup().catch(console.error)
