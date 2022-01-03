import GuildSettings from '#lib/Models/GuildSettings'
import { logEmbed, sendToLogs } from '#util'
// @ts-ignore
import clean from '@aero/sanitizer'
import { ApplyOptions } from '@sapphire/decorators'
import { Events, Listener, ListenerOptions } from '@sapphire/framework'
import type { GuildMember } from 'discord.js'

@ApplyOptions<ListenerOptions>({
  event: Events.GuildMemberAdd
})
export default class guildMemberAdd extends Listener {
  public async run(member: GuildMember): Promise<GuildMember> {
    const { anti, logs } = await GuildSettings.findOne({ guild_id: member.guild.id })

    if (anti.unmentionable) await this.cleanName(member)
    if (logs.members) {
      this.log(member)
    }

    return member
  }

  private log(member: GuildMember): boolean {
    const embed = logEmbed('members', {
      action: 'join',
      member
    })

    return void sendToLogs(member.guild, 'members', embed)
  }

  private async cleanName(member: GuildMember) {
    const name: string = clean(member.displayName)

    return await member.setNickname(name.slice(0, 32), 'Cleaning nickname')
  }
}
