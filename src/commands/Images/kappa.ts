import { ArielCommand, ArielCommandOptions } from '#lib/Structures/BaseCommand'
import { ApplyOptions } from '@sapphire/decorators'
import { Message, MessageEmbed } from 'discord.js'
import type { Image } from '@aero/ksoft'
import i18 from 'i18next'

@ApplyOptions<ArielCommandOptions>({
  description: 'commands/images:kappa.description',
  cooldownLimit: 3,
  cooldownDelay: 2000
})
export default class Fox extends ArielCommand {
  public async run(message: Message) {
    const { url }: Image = await this.container.client.ksoft.images.random('kappa', {
      nsfw: false
    })
    const embed = new MessageEmbed()
      .setTitle(i18.t('commands/images:kappa.embed.title'))
      .setFooter(i18.t('commands/attributions:poweredByKSoft'))
      .setURL(url)
      .setColor('NOT_QUITE_BLACK')
      .setTimestamp()
      .setImage(url)
    return await message.channel.send({ embeds: [embed] })
  }
}
