import { envIsDefined } from '#lib/env/parser'
import { ArielCommand, ArielCommandOptions } from '#lib/Structures/Command'
import type { Image } from '@aero/ksoft'
import { ApplyOptions } from '@sapphire/decorators'
import { Message, MessageEmbed } from 'discord.js'

@ApplyOptions<ArielCommandOptions>({
  aliases: ['awww', 'awwww'],
  description: 'commands/images:awww.description',
  cooldownLimit: 3,
  cooldownDelay: 2000,
  enabled: envIsDefined('KSOFT_TOKEN')
})
export default class Aww extends ArielCommand {
  public async messageRun(message: Message, args: ArielCommand.Args) {
    const { url }: Image = await this.container.client.ksoft.images.aww()
    const embed = new MessageEmbed()
      .setFooter(args.t('attributions:poweredByKSoft'))
      .setTimestamp()
      .setImage(url)
      .setColor('AQUA')
    return await message.channel.send({ embeds: [embed] })
  }
}
