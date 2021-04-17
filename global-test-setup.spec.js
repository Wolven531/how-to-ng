// run before any single it() block
beforeAll(() => {
	spyOn(window.console, 'debug')
	spyOn(window.console, 'error')
	spyOn(window.console, 'info')
	spyOn(window.console, 'log')
	spyOn(window.console, 'warn')
})

// run after every single it() block
afterEach(done => {
	// use setTimeout to move pending async code to non-main JS event queue
	setTimeout(() => {
		// tell test runner to finish test execution, failing any pending async assertions / tests
		done()
	}, 0)
})
