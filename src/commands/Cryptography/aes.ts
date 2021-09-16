import { ArielCommand, ArielCommandOptions } from '#lib/Structures/BaseCommand'
import { ApplyOptions } from '@sapphire/decorators'
import type { Args } from '@sapphire/framework'
import crypto from 'crypto-js'
import { Message, Permissions } from 'discord.js'
import i18 from 'i18next'

@ApplyOptions<ArielCommandOptions>({
  description: 'commands/cryptography:aesDescription',
  flags: ['d', 'decrypt'],
  options: ['secret', 's'],
  usage: '<text> <-s=randomLetters | --secret=randomLetters> [-d | --decrypt]'
})
export default class AES extends ArielCommand {
  public async run(message: Message, args: Args) {
    const decryptFlag = args.getFlags('d', 'decrypt')
    const text = (await args.restResult('string')).value
    const secret = args.getOption('s', 'secret')

    if (!text) return await message.channel.send(i18.t('commands/cryptography:noText'))

    if (!secret) {
      return await message.channel.send(i18.t('commands/cryptography:noSecret'))
    }

    if (message.guild.me.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) void message.delete()

    const result = decryptFlag ? this.decrypt(text, secret) : this.encrypt(text, secret)

    return await message.channel.send(result)
  }

  /**
   * Input: ABC
   * Secret: ABC
   * Output: U2FsdGVkX1+Ocg9Sepezl979pPZ60p54jzzOEeVt98I=
   */
  private encrypt(input: string, secret: string): string {
    return crypto.AES.encrypt(input, secret).toString()
  }

  /**
   * Input: U2FsdGVkX1+Ocg9Sepezl979pPZ60p54jzzOEeVt98I=
   * Secret: ABC
   * Output: ABC
   */
  private decrypt(input: string, secret: string): string {
    return (
      crypto.AES.decrypt(input, secret).toString(crypto.enc.Utf8).toString() ||
      i18.t('commands/cryptography:unsuccessful')
    )
  }
}
