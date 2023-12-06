const APOLLO_ICON_PATH =
  '/home/alcha/Development/Projects/Apollo/Assets/Img/Apollo-Portrait-Square.png'

/**
 * This is a utility class that provides functions for sending notifications to
 * the OS using the [notify-send][0] CLI tool.
 *
 * [0]: https://manpages.ubuntu.com/manpages/xenial/man1/notify-send.1.html
 */
export class Notify {
  /**
   * Sends the a notification to the OS using the `notify-send` CLI tool with
   * the given title and message. If no title is provided, the default title
   * of "Msg from Apollo" will be used. The notification will also use the
   * Apollo icon, defined by the `APOLLO_ICON_PATH` constant.
   *
   * @param message The message of the notification, displayed in normal text.
   * @param title The title of the notification, displayed in bold.
   */
  public static send(message: string, title: string = 'Msg from Apollo') {
    const { stdout, stderr } = Bun.spawnSync([
      'notify-send',
      '-i',
      APOLLO_ICON_PATH,
      title,
      message,
    ])

    if (stderr.length > 0) {
      throw new Error(stderr.toString())
    }

    return stdout.length > 0 ? stdout.toString() : undefined
  }
}
