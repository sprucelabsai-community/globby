import path from 'path'
import { default as globbyNamespace } from 'globby'
import coreGlobby from 'globby'

const globby = async function globby(
    patterns: string | string[],
    options?: Partial<globbyNamespace.GlobbyOptions>
) {
    const pats = normalizePaths(patterns)
    return coreGlobby(pats, options) as unknown as Promise<string[]>
}
globby.sep = path.sep
globby.sync = function (
    patterns: string | string[],
    options?: Partial<globbyNamespace.GlobbyOptions>
) {
    const pats = normalizePaths(patterns)
    return coreGlobby.sync(pats, options)
}
function normalizePaths(patterns: string | string[]) {
    const normalized = Array.isArray(patterns) ? patterns : [patterns]
    const pats = normalized.map((n) => n.split(globby.sep).join(path.posix.sep))
    return pats
}

export default globby
