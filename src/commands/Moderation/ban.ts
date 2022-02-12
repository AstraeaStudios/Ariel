import { ArielCommand, ArielCommandOptions } from '#lib/Structures/Command'
import { ApplyOptions } from '@sapphire/decorators'
import type { GuildMember, Message } from 'discord.js'

@ApplyOptions<ArielCommandOptions>({
  description: 'Bans discord members',
  aliases: ['b', 'hammer'],
  usage: '<user(s)> [duration] [reason]',
  requiredUserPermissions: ['BAN_MEMBERS'],
  preconditions: ['GuildTextOnly']
})
export default class Ban extends ArielCommand {
  public async messageRun(message: Message, args: ArielCommand.Args) {
    let users: GuildMember | GuildMember[] = await args.repeat('member')
    const reason = await args.rest('string').catch(() => 'No reason provided')

    if (users.length < 2) users = [users[0]]

    this.execute(users, message.author.tag, reason)

    return await message.channel.send(
      `Successfully banned ${users.length > 1 ? `${users.length} Users.` : users[0].toString()}`
    )
  }

  private execute(users: GuildMember[], moderator: string, reason: string) {
    for (const user of users) {
      if (!user.bannable) return

      void user.ban({ reason: `${moderator} | ${reason}` })
    }
  }
}
