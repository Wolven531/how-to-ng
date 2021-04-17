let mockDebug
let mockError
let mockInfo
let mockLog
let mockWarn

let origDebug
let origError
let origInfo
let origLog
let origWarn

// run before any single it() block
beforeAll(() => {
	origDebug = console.debug
	origError = console.error
	origInfo = console.info
	origLog = console.log
	origWarn = console.warn

	console.log('mocking console functions - debug, error, info, log, warn')

	mockDebug = spyOn(window.console, 'debug')
	mockError = spyOn(window.console, 'error')
	mockInfo = spyOn(window.console, 'info')
	mockLog = spyOn(window.console, 'log')
	mockWarn = spyOn(window.console, 'warn')
})

afterAll(() => {
	window.console.debug = origDebug
	window.console.error = origError
	window.console.info = origInfo
	window.console.log = origLog
	window.console.warn = origWarn

	console.log(
		`console.debug was called ${mockDebug.calls.count()} times`,
		`console.error was called ${mockError.calls.count()} times`,
		`console.info was called ${mockInfo.calls.count()} times`,
		`console.log was called ${mockLog.calls.count()} times`,
		`console.warn was called ${mockWarn.calls.count()} times`,
	)
})

// run after every single it() block
afterEach(done => {
	// use setTimeout to move pending async code to non-main JS event queue
	setTimeout(() => {
		// tell test runner to finish test execution, failing any pending async assertions / tests
		done()
	}, 0)
})
