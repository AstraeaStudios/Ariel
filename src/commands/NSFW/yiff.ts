import { ArielCommand, ArielCommandOptions } from '#lib/Structures/BaseCommand'
import { ApplyOptions } from '@sapphire/decorators'
import { MessageEmbed, Message } from 'discord.js'

@ApplyOptions<ArielCommandOptions>({
  name: 'yiff',
  aliases: ['yiff', 'floofydev'],
  description: 'Returns an Image from api.floofy.dev',
  cooldownLimit: 6,
  nsfw: true,
  cooldownDelay: 5000
})
export default class YiffFloofyDev extends ArielCommand {
  public async run(message: Message) {
    const req: Request = await this.container.client.Yiff.floofy()

    const embed = new MessageEmbed().setImage(req.url).setColor('RANDOM')

    return await message.channel.send({
      embeds: [embed]
    })
  }
}

interface Request {
  url: string
}
