import { srcDir } from '#lib/constants'
import { envParseString } from '#lib/env/parser'
import GuildSettings from '#lib/Models/GuildSettings'
import type { InternationalizationContext } from '@sapphire/plugin-i18next'
import { ScheduledTaskRedisStrategy } from '@sapphire/plugin-scheduled-tasks/register-redis'
import { config } from 'dotenv-cra'
import type { FormatFunction } from 'i18next'
import { join } from 'path'
import Client from './lib/Ariel'
import Logger from './lib/Structures/Logger'

config({
  path: join(srcDir, '.env')
})

const client = new Client({
  defaultPrefix: envParseString('PREFIX'),
  regexPrefix: /^(hey +)?ariel[,! ]/i,
  caseInsensitivePrefixes: true,
  caseInsensitiveCommands: true,
  logger: { instance: new Logger('Ariel') },
  intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_BANS', 'GUILD_WEBHOOKS', 'GUILD_MEMBERS', 'GUILD_MESSAGE_REACTIONS'],
  i18n: {
    fetchLanguage: async (message: InternationalizationContext) => {
      const { language } = await GuildSettings.findOne({ guild_id: message.guild.id })

      return language
    },
    i18next: (_: string[], languages: string[]) => ({
      supportLngs: languages,
      preload: languages,
      load: 'all',
      initImmediate: false,
      fallbackLng: 'en-US',
      returnObjects: true,
      returnEmptyString: false,
      returnNull: false,
      interpolation: {
        escapeValue: false,
        format: (...[value, format]: Parameters<FormatFunction>) => {
          switch (format) {
            case 'permissions': {
              return (value as string[]).map(v => `\`${v}\``).join(', ')
            }
            default:
              return value as string
          }
        }
      }
    })
  },
  api: {
    listenOptions: {
      port: 4000
    },
    prefix: '/v1/'
  },
  tasks: {
    strategy: new ScheduledTaskRedisStrategy({
      bull: {
        redis: {
          host: 'redis',
          password: 'redis',
          port: 8287,
          db: 1
        }
      }
    })
  }
})

void client.start()
