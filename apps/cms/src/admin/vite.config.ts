import { mergeConfig } from 'vite'
import monacoEditorPlugin from 'vite-plugin-monaco-editor'

export default (config) => {
  // Important: always return the modified config
  return mergeConfig(config, {
    plugins: [monacoEditorPlugin({})],
  })
}