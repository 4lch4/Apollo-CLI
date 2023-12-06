import Axios, { AxiosInstance, Method } from 'axios'
import Chalk from 'chalk'

// #region Constants
export const PredefinedTimers = [
  '1-on-1',
  'backstage-pairing',
  'backstage-wam',
  'career-sync',
  'flywheel-demos',
  'flywheel-standup',
  'flywheel-wam',
  'monthly-sync-and-showcase',
  'o11y-pairing',
  'o11y-wam',
] as const

const Tags = {
  /** Liatrio related tags. */
  Liatrio: {
    /** For any events/meetings for Demos to be shown. */
    Demos: 'Liatrio/Demos',

    /** For any events related to my career at Liatrio. */
    Career: 'Liatrio/Career',

    /** For 1-on-1 Meetings. */
    OneOnOne: 'Liatrio/1-on-1',

    /** For events related to Internal/Flywheel projects. */
    InternalProjects: 'Liatrio/Internal-Projects',

    /** For any Weekly Sync events. */
    WeeklySync: 'Liatrio/Weekly-Sync',

    /** For events related to Backstage. */
    Backstage: 'Liatrio/Backstage',

    /** For events related to Flywheel. */
    Flywheel: 'Liatrio/Flywheel',

    /** For meetings. */
    Meeting: 'Liatrio/Meeting',

    /** For events related to Project O11y. */
    O11y: 'Liatrio/O11y',

    /** For any Standup meetings. */
    Standup: 'Liatrio/Standup',

    /** For any Weekly Alignment Meetings. */
    WAM: 'Liatrio/WAM',

    /** For any Pairing events. */
    Pairing: 'Liatrio/Pairing',
  },
}

const LIATRIO_PROJECT_ID = 192425782
const MY_WORKSPACE_ID = 1898043
// #endregion Constants

// #region Custom Types
export type TimerName = (typeof PredefinedTimers)[number]

export type PredefinedTimerData = {
  project_id: number
  workspace_id: number
  created_with: string
  description: string
  tags: string[]
  start: string
  duration: number
}

export type ActiveTimerResponse = {
  id: number
  workspace_id: number
  project_id: number
  task_id: null
  billable: boolean
  start: string
  stop: null
  duration: number
  description: string
  tags: string[]
  tag_ids: number[]
  duronly: boolean
  at: string
  server_deleted_at: null
  user_id: number
  uid: number
  wid: number
  pid: number
}
// #endregion Custom Types

export class TogglAPI {
  private client: AxiosInstance

  public constructor(
    username: string = process.env.TOGGL_API_USERNAME!,
    password: string = process.env.TOGGL_API_PASSWORD!,
  ) {
    this.client = Axios.create({
      baseURL: 'https://api.track.toggl.com/api/v9',
      auth: { username, password },
      validateStatus: () => true,
    })
  }

  public getPredefinedTimerData(timerName: TimerName): PredefinedTimerData {
    const timerData: PredefinedTimerData = {
      project_id: LIATRIO_PROJECT_ID,
      workspace_id: MY_WORKSPACE_ID,
      created_with: 'Apollo-CLI',
      start: new Date().toISOString(),
      duration: -1,
      description: '',
      tags: [],
    }

    switch (timerName) {
      case '1-on-1':
        timerData.description = '1 on 1 Meeting'
        timerData.tags.push(Tags.Liatrio.Meeting, Tags.Liatrio.OneOnOne)
        break

      case 'backstage-pairing':
        timerData.description = 'Backstage Pairing'
        timerData.tags.push(Tags.Liatrio.Meeting, Tags.Liatrio.Backstage, Tags.Liatrio.Pairing)
        break

      case 'backstage-wam':
        timerData.description = 'Backstage Weekly Sync'
        timerData.tags.push(
          Tags.Liatrio.Meeting,
          Tags.Liatrio.Backstage,
          Tags.Liatrio.WAM,
          Tags.Liatrio.WeeklySync,
          Tags.Liatrio.InternalProjects,
        )
        break

      case 'career-sync':
        timerData.description = 'Career Sync'
        timerData.tags.push(Tags.Liatrio.Meeting, Tags.Liatrio.Career)
        break

      case 'flywheel-demos':
        timerData.description = 'Flywheel Demos'
        timerData.tags.push(Tags.Liatrio.Meeting, Tags.Liatrio.Flywheel, Tags.Liatrio.Demos)
        break

      case 'flywheel-standup':
        timerData.description = 'Flywheel Daily Standup'
        timerData.tags.push(Tags.Liatrio.Meeting, Tags.Liatrio.Flywheel, Tags.Liatrio.Standup)
        break

      case 'flywheel-wam':
        timerData.description = 'Flywheel Weekly Alignment Meeting'
        timerData.tags.push(Tags.Liatrio.Meeting, Tags.Liatrio.Flywheel, Tags.Liatrio.WAM)
        break

      case 'monthly-sync-and-showcase':
        timerData.description = 'Monthly Sync and Showcase'
        timerData.tags.push(Tags.Liatrio.Meeting, Tags.Liatrio.Demos, Tags.Liatrio.Career)
        break

      case 'o11y-pairing':
        timerData.description = 'O11y Pairing'
        timerData.tags.push(Tags.Liatrio.Meeting, Tags.Liatrio.O11y, Tags.Liatrio.Pairing)
        break

      case 'o11y-wam':
        timerData.description = 'O11y Weekly Sync'
        timerData.tags.push(
          Tags.Liatrio.Meeting,
          Tags.Liatrio.O11y,
          Tags.Liatrio.WAM,
          Tags.Liatrio.WeeklySync,
          Tags.Liatrio.InternalProjects,
        )
        break
    }

    return timerData
  }

  public async startTimer(timerData: PredefinedTimerData) {
    try {
      const { data, status, statusText } = await this.client.post(
        `/workspaces/${timerData.workspace_id}/time_entries`,
        timerData,
      )

      if (status === 200) {
        console.log(Chalk.green(`Successfully started timer for '${timerData.description}'`))
      } else {
        console.log(
          Chalk.red(
            `[TogglAPI#startTimer]: Received a non-200 status code for '${timerData.description}':\n`,
          ),
        )

        console.log(Chalk.red(`[TogglAPI#startTimer]: Status Code: ${status}`))
        console.log(Chalk.red(`[TogglAPI#startTimer]: Status Text: ${statusText}`))
        console.log(
          Chalk.red(`[TogglAPI#startTimer]: Response Data: ${JSON.stringify(data, null, 2)}`),
        )
      }
    } catch (error) {
      console.error(`[TogglAPI#startTimer]: Error caught when trying to start timer:\n`)

      console.error(error)
    }
  }

  public async startPredefinedTimer(timerName: TimerName) {
    try {
      const timerData = this.getPredefinedTimerData(timerName)

      return this.startTimer(timerData)
    } catch (error) {
      throw error
    }
  }

  public async getActiveTimer(): Promise<ActiveTimerResponse | null> {
    const { data, status, statusText } = await this.client.get('/me/time_entries/current')

    // If the status code is 200, then we have an active timer.
    if (status === 200) return data
    // The Toggl API returns a 410 status code if there is no active timer.
    if (status === 410) return null
    // Otherwise, we have an error, or at least something unexpected.
    else {
      console.log(Chalk.red(`Failed to get active timer:\n`))

      console.log(`Status Code: ${status}`)
      console.log(`Status Text: ${statusText}`)
      console.log(`Response Data: ${JSON.stringify(data, null, 2)}`)

      return null
    }
  }

  public async stopActiveTimer() {
    const activeTimer = await this.getActiveTimer()

    if (activeTimer) {
      const { data, status, statusText } = await this.client.patch(
        `/workspaces/${activeTimer.wid}/time_entries/${activeTimer.id}/stop`,
      )

      if (status === 200) {
        console.log(Chalk.green(`Successfully stopped timer for '${activeTimer.description}'`))
      } else {
        console.log(
          Chalk.red(
            `[TogglAPI#stopActiveTimer]: Received a non-200 status code for '${activeTimer.description}':\n`,
          ),
        )

        console.log(Chalk.red(`[TogglAPI#stopActiveTimer]: Status Code: ${status}`))
        console.log(Chalk.red(`[TogglAPI#stopActiveTimer]: Status Text: ${statusText}`))
        console.log(
          Chalk.red(`[TogglAPI#stopActiveTimer]: Response Data: ${JSON.stringify(data, null, 2)}`),
        )
      }
    }
  }

  /**
   * Sends a request to the Toggl API using the provided method, URL, and data.
   *
   * @param method The HTTP method to use for the request.
   * @param endpoint The API endpoint to send the request to.
   * @param data The data to send with the request.
   * @returns The response data from the request, if any.
   */
  public async sendRequest<T = any>(method: Method, endpoint: string, data?: any): Promise<T> {
    try {
      const response = await this.client.request<T>({ method, url: endpoint, data })

      // If the status code starts with a 2, then we're good to go.
      if (response.status.toString().startsWith('2')) return response.data
      else {
        // Make sure we're not in prod(uction), then log some extra error info.
        if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'prod') {
          console.error(
            Chalk.red(
              `[TogglAPI#sendRequest]: Failed to send request to ${method} ${endpoint} with a non-200 status code:\n`,
            ),
          )

          console.error(Chalk.red(`Status Code: ${response.status}`))
          console.error(Chalk.red(`Status Text: ${response.statusText}`))
          console.error(Chalk.red(`Response Data: ${JSON.stringify(response.data, null, 2)}`))
        }

        return response.data
      }
    } catch (error) {
      console.error(
        `[TogglAPI#sendRequest]: Error caught when trying to send request to ${method} ${endpoint}\n`,
      )
      console.error(error)

      throw error
    }
  }
}
