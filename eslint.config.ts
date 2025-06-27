import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';

export default tseslint.config(

  ...tseslint.configs.recommended,
  prettierConfig,

  // Configuration globale pour ignorer des fichiers
  {
    ignores: ['node_modules', 'dist', 'coverage', 'eslint.config.ts'],
  },

  // Appliquer des règles personnalisées par-dessus les recommandations
  {
    rules: {
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'off',
    },
  }
);