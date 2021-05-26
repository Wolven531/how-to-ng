import { TestBed } from '@angular/core/testing'
import { Observable } from 'rxjs'
import { HEROES } from 'src/mock-heroes'
import { InMemoryDataService } from './in-memory-data.service'


describe('InMemoryDataService', () => {
	let service: InMemoryDataService

	beforeEach(() => {
		TestBed.configureTestingModule({})

		service = TestBed.inject(InMemoryDataService)
	})

	it('creates service', () => {
		expect(service).toBeTruthy()
	})

	describe('createDb()', () => {
		let actual: {} | Observable<{}> | Promise<{}>

		beforeEach(() => {
			actual = service.createDb()
		})

		it('creates DB properly', () => {
			expect(actual).toEqual({
				heroes: HEROES,
			})
		})
	})

	describe('genId() w/ empty array', () => {
		let actual: number

		beforeEach(() => {
			actual = service.genId([])
		})

		it('returns default ID value (of 11)', () => {
			expect(actual).toBe(11)
		})
	})
})
