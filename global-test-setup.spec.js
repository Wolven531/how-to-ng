let mockDebug
let mockError
let mockInfo
let mockLog
let mockWarn

// run before any single it() block
beforeAll(() => {
	mockDebug = spyOn(window.console, 'debug')
	mockError = spyOn(window.console, 'error')
	mockInfo = spyOn(window.console, 'info')
	mockLog = spyOn(window.console, 'log')
	mockWarn = spyOn(window.console, 'warn')
})

// run after every single it() block
afterEach(done => {
	// use setTimeout to move pending async code to non-main JS event queue
	setTimeout(() => {
		// tell test runner to finish test execution, failing any pending async assertions / tests
		done()
	}, 0)
})
