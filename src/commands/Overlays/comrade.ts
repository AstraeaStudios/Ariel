import type { ArielCommandOptions } from '#lib/Structures/BaseCommand'
import { ArielOverlayCommand } from '#lib/Structures/commands/CanvasCommand'
import { ApplyOptions } from '@sapphire/decorators'
import type { PieceContext } from '@sapphire/framework'

@ApplyOptions<ArielCommandOptions>({
  aliases: ['russia', 'soviet', 'russian'],
  description: 'Add a soviet flag overlay to your or someone elses profile picture',
  usage: '[@user]'
})
export default class Comrade extends ArielOverlayCommand {
  constructor(Context: PieceContext, options: ArielCommandOptions) {
    super({ overlay: 'comrade' }, Context, options)
  }
}
