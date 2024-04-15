import path from 'path'
import { diskUtil } from '@sprucelabs/spruce-skill-utils'
import AbstractSpruceTest, { test, assert } from '@sprucelabs/test-utils'
import globby from '../../globbyUtil'

export default class GlobbyTest extends AbstractSpruceTest {
    protected static async beforeEach(): Promise<void> {
        await super.beforeEach()
        this.cwd = diskUtil.createRandomTempDir()
        globby.sep = path.sep
    }
    @test()
    protected static async isFunction() {
        assert.isFunction(globby)
    }

    @test()
    protected static async returnsNothingWithNoMatches() {
        await this.assertPatternMatches('**/*.js', [])
    }

    @test()
    protected static async canFindSingleMatch() {
        const file = 'foo.js'
        this.writeFile(file)
        await this.assertPatternMatches('**/*.js', [file])
    }

    @test()
    protected static async canFindMultipleMatches() {
        const file1 = 'foo.js'
        const file2 = 'bar.ts'
        this.writeFile(file1)
        this.writeFile(file2)
        await this.assertPatternMatches('**/*.[j|t]s', [file1, file2])
    }

    @test()
    protected static async canFindDeeperMatches() {
        const file = 'foo/bar/baz.js'
        this.writeFile(file)
        await this.assertPatternMatches('**/*.[j|t]s', [file])
    }

    @test()
    protected static async canMatchWithReversePathSeparators() {
        const file = 'test.js'
        this.writeFile(file)
        globby.sep = '\\'
        const search = this.resolvePath('**/*.[j|t]s').replace(/\//g, '\\')
        const expected = this.resolvePath(file)
        await this.assertPatternMatches(search, [expected])
    }

    private static writeFile(file: string) {
        diskUtil.writeFile(this.resolvePath(file), 'hello')
    }

    private static async assertPatternMatches(
        pattern: string | string[],
        expected: string[]
    ) {
        const results = await globby(pattern, { cwd: this.cwd })
        assert.isEqualDeep(
            results.sort(),
            expected.sort(),
            'Async globby failed'
        )
        const syncResults = globby.sync(pattern, { cwd: this.cwd })
        assert.isEqualDeep(
            syncResults.sort(),
            expected.sort(),
            'sync globby failed'
        )
    }
}
