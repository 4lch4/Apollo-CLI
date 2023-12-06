import Axios from 'axios'
import Chalk from 'chalk'
import { Command } from 'commander'
import { Notify } from '~/lib'

const apiClient = Axios.create({ baseURL: 'https://apollo.4lch4.io/api/v1' })

/**
 * This is a utility class that builds out a base Commander Command for
 * tracking my smoking habits.
 */
export class SmokesCommand {
  public async build() {
    // A sub-command for adding/logging a new smoke.
    const addSubCommand = new Command('add')
      .description('Adds/logs a new smoke.')
      .alias('a')
      .action(async () => {
        try {
          const { data, status, statusText } = await apiClient.post('/smokes', { count: 1 })

          if (status === 200) {
            console.log(Chalk.green('Successfully logged a new smoke!'))

            Notify.send('Smoke logged.')
          } else {
            console.log(Chalk.red('Failed to log smoke with a non-201 status code:\n'))
            console.log(Chalk.red(`Status: ${status} ${statusText}`))
            console.log(Chalk.red(`Data: ${JSON.stringify(data, null, 2)}`))
          }
        } catch (error) {
          console.error('Failed to log smoke:\n')

          console.error(error)
        }
      })

    // A sub-command for getting the current smoke count.
    const countSubCommand = new Command('count')
      .description('Gets the current smoke count.')
      .alias('c')
      .action(async () => {
        try {
          const { data, status, statusText } = await apiClient.get('/smokes/today/count')

          if (status === 200) {
            console.log(Chalk.green(`Today's smoke count: ${Chalk.bold(data)}`))

            Notify.send(`Today's smoke count: ${data}`)
          } else {
            console.log(Chalk.red('Failed to get smoke count with a non-200 status code:\n'))
            console.log(Chalk.red(`Status: ${status} ${statusText}`))
            console.log(Chalk.red(`Data: ${JSON.stringify(data, null, 2)}`))
          }
        } catch (error) {
          console.error('Failed to get smoke count:\n')

          console.error(error)
        }
      })

    return new Command('smokes')
      .description('A command for tracking my smoking habits.')
      .addCommand(addSubCommand)
      .addCommand(countSubCommand)
  }
}
