import { TestBed } from '@angular/core/testing'
import { Observable } from 'rxjs'
import { HEROES } from 'src/mock-heroes'
import { Hero } from './hero/hero.interface'
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

	describe('genId() w/ non-empty, non-sorted array', () => {
		const fakeHeroes: Hero[] = [
			{
				id: 2,
				name: 'two',
			},
			{
				id: 7,
				name: 'seven',
			},
			{
				id: 5,
				name: 'five',
			},
		]
		let actual: number

		beforeEach(() => {
			actual = service.genId(fakeHeroes)
		})

		it('returns ID value equal to highest Hero ID + 1', () => {
			expect(actual).toBe(8)
		})
	})
})
