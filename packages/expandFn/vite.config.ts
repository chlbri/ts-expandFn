import { defineProject } from 'vite-plus';
import { defineConfig } from '@bemedev/dev-utils/pack';

export default defineProject({
  pack: defineConfig({ sourcemap: true }),

  run: {
    tasks: {
      pack: {
        command: 'vp pack',

        cache: {
          input: ['src/**', 'package.json', 'tsconfig.json', '!**/*.gen.ts'],
          output: ['lib/**'],
        },
      },
    },
  },
});
