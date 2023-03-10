import AbstractSpruceTest, { test, assert } from '@sprucelabs/test-utils'

export default class GlobbyTest extends AbstractSpruceTest {
	@test()
	protected static async isFunction() {
		assert.isFunction(globby)
	}

	@test()
	protected static async returnsNothingWithNoMatches() {

	}
}

async function globby() {}
