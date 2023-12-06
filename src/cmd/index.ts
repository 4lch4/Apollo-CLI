import { TogglCommand } from './Toggl'

export async function buildCommands() {
  const togglCommand = await new TogglCommand().build()

  return [togglCommand]
}
