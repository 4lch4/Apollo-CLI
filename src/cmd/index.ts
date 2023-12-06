import { TogglCommand } from './Toggl'
import { SmokesCommand } from './Smokes'

export async function buildCommands() {
  const togglCommand = await new TogglCommand().build()
  const smokeCommand = await new SmokesCommand().build()

  return [togglCommand, smokeCommand]
}
