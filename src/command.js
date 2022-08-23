const path = require('path')
const isWindows = require('./is-windows')

module.exports = commandConvert

/**
 * Converts an environment variable usage to be appropriate for the current OS
 * @param {String} command Command to convert
 * @param {Object} env Map of the current environment variable names and their values
 * @param {boolean} normalize If the command should be normalized using `path`
 * after converting
 * @returns {String} Converted command
 */
function commandConvert(command, env, normalize = false) {
  if (!isWindows()) {
    return command
  }
  const envUnixRegex = /\$(\w+)|\${(\w+)}/g // $my_var or ${my_var}
  const convertedCmd = command.replace(envUnixRegex, (match, $1, $2) => {
    const varName = $1 || $2
    return env[varName] ? `%${varName}%` : ''
  })
  return normalize === true ? path.normalize(convertedCmd) : convertedCmd
}
