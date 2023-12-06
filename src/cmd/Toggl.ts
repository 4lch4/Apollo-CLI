import Chalk from 'chalk'
import { Argument, Command } from 'commander'
import { Notify, PredefinedTimers, TogglAPI } from '~/lib'

/**
 * This is a utility class that builds out a base Commander Command for
 * interacting with the Toggl API.
 */
export class TogglCommand {
  public async build(
    username: string = process.env.TOGGL_API_USERNAME!,
    password: string = process.env.TOGGL_API_PASSWORD!,
  ) {
    const togglAPI = new TogglAPI(username, password)

    const PredefinedTimerArgument = new Argument(
      '<timer>',
      'The name of the predefined timer to start.',
    ).choices(PredefinedTimers)

    const startSubCommand = new Command('start')
      .description('Starts a Toggl timer.')
      .alias('s')
      .addArgument(PredefinedTimerArgument)
      .action(async timer => {
        try {
          await togglAPI.startPredefinedTimer(timer)

          console.log(Chalk.green(`Successfully started '${timer}' timer`))

          Notify.send(`Successfully started '${timer}' timer`)
        } catch (error) {
          console.error('[TogglCommand#build>startSubCommandAction]: Failed to start the timer:\n')

          console.error(error)
        }
      })

    const stopSubCommand = new Command('stop')
      .description('Stops the current active Toggl timer.')
      .alias('x')
      .action(async () => {
        try {
          await togglAPI.stopActiveTimer()
        } catch (error) {
          console.error('Failed to stop the active timer:\n')

          console.error(error)
        }
      })

    const currentSubCommand = new Command('current')
      .description('Gets the current active Toggl timer.')
      .alias('cur')
      .action(async () => {
        try {
          const activeTimer = await togglAPI.getActiveTimer()

          if (activeTimer) {
            console.log(Chalk.green(`Active Timer: ${Chalk.bold(activeTimer.description)}`))
            console.log(Chalk.green(`Start Time: ${Chalk.bold(new Date(activeTimer.start))}`))

            Notify.send(activeTimer.description, 'Active Toggl Timer')
          } else {
            console.log(Chalk.red('There is no active timer.'))

            Notify.send('There is no active timer.', 'Active Toggl Timer')
          }
        } catch (error) {
          console.error('Failed to get the active timer:\n')

          console.error(error)
        }
      })

    return new Command('toggl')
      .description('Provides sub-commands for interacting w/ the Toggl API.')
      .alias('t')
      .addCommand(currentSubCommand)
      .addCommand(startSubCommand)
      .addCommand(stopSubCommand)
  }
}
