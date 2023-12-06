import { SmokesCommand } from './Smokes'
import { TogglCommand } from './Toggl'

export async function buildCommands() {
  const togglCommand = await new TogglCommand().build()
  const smokeCommand = await new SmokesCommand().build()

  return [togglCommand, smokeCommand]
}
