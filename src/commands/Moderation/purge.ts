import { ArielCommand, ArielCommandOptions } from '#lib/Structures/BaseCommand'
import { ApplyOptions, RequiresUserPermissions } from '@sapphire/decorators'
import type { Args } from '@sapphire/framework'
import type { Message, TextChannel } from 'discord.js'
import i18n from 'i18next'

@ApplyOptions<ArielCommandOptions>({
  description: 'commands/moderation:purge.description',
  requiredClientPermissions: ['MANAGE_MESSAGES'],
  cooldownDelay: 2000,
  cooldownLimit: 2,
  preconditions: ['GuildTextOnly'],
  usage: '<amount>'
})
export default class Purge extends ArielCommand {
  @RequiresUserPermissions('MANAGE_MESSAGES')
  public async run(message: Message, args: Args): Promise<unknown> {
    const amount = (await args.pickResult('number')).value

    if (!amount) return await message.channel.send(i18n.t('commands/moderation:purge.error.noAmount'))
    if (amount < 3) return await message.channel.send(i18n.t('commands/moderation:purge.error.little'))
    if (amount > 100) return await message.channel.send(i18n.t('commands/moderation:purge.error.over'))

    await (message.channel as TextChannel).bulkDelete(amount + 1, true)

    return await message.channel.send(i18n.t('commands/moderation:purge.success.purged', { amount })).then(msg => {
      setTimeout(() => {
        void msg.delete()
      }, 2000)
    })
  }
}
