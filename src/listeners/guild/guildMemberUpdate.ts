import { Events, Listener, ListenerOptions } from '@sapphire/framework'
import { ApplyOptions } from '@sapphire/decorators'
import type { GuildMember } from 'discord.js'
import GuildSettings from '#lib/Models/GuildSettings'
// @ts-ignore
import clean from '@aero/sanitizer'

@ApplyOptions<ListenerOptions>({
  event: Events.MessageCreate
})
export default class guildMemberUpdate extends Listener {
  public async run(oldMember: GuildMember, newMember: GuildMember) {
    if (oldMember.displayName === newMember.displayName) return undefined

    const { anti } = await GuildSettings.findOne({ guild_id: newMember.guild.id })

    if (anti.unmentionable) await this.cleanName(newMember)

    return newMember
  }

  public async cleanName(member: GuildMember): Promise<GuildMember> {
    const name = clean(member.displayName)

    return await member.setNickname(name.slice(0, 32), 'Cleaning nickname')
  }
}