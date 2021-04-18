import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import { ReactiveFormsModule } from '@angular/forms'
import { Map } from 'ol'
import { GeoCoord, GeoPos } from '../constants'
import { GameComponent } from './game.component'

describe('GameComponent', () => {
	let component: GameComponent
	let fixture: ComponentFixture<GameComponent>

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ GameComponent ],
			imports: [ ReactiveFormsModule ],
		}).compileComponents()

		fixture = TestBed.createComponent(GameComponent)
		component = fixture.componentInstance
	})

	it('creates component', () => {
		expect(component).toBeTruthy()
	})

	describe('invoke ngOnInit() when window.navigator.geolocation is undefined', () => {
		beforeEach(() => {
			spyOn<any>(component, 'getCurrentPosition')

			spyOnProperty(window.navigator, 'geolocation').and.returnValue(undefined)

			component.ngOnInit()
		})

		it('does NOT invoke getCurrentPosition() on component', () => {
			expect(component['getCurrentPosition']).not.toHaveBeenCalled()
		})
	})

	describe('invoke ngOnInit() when window.navigator.permissions is undefined', () => {
		beforeEach(() => {
			spyOn(window.navigator.geolocation, 'getCurrentPosition')
			spyOnProperty(window.navigator, 'permissions').and.returnValue(undefined)

			component.ngOnInit()
		})

		it('invokes window.navigator.geolocation.getCurrentPosition() properly', () => {
			expect(window.navigator.geolocation.getCurrentPosition).toHaveBeenCalledOnceWith(
				component['handlePositionLoaded'],
				component['handlePositionError'],
				{
					enableHighAccuracy: true,
				}
			)
		})
	})

	describe('invoke ngOnInit() when window.navigator.permissions is granted and getCurrentPosition invokes success callback', () => {
		const FAKE_COORDS: GeoCoord = {
			accuracy: 100,
			altitude: 0,
			altitudeAccuracy: 100,
			heading: 1,
			latitude: 99,
			longitude: 101,
			speed: 1,
		}
		const FAKE_TIMESTAMP = (new Date()).getTime()
		const FAKE_GEO_POSITION: GeoPos = {
			coords: FAKE_COORDS,
			timestamp: FAKE_TIMESTAMP,
		}
		let spyGetCurrentPosition: jasmine.Spy
		let spyHandlePositionLoaded: jasmine.Spy
		let spyUpdateMap: jasmine.Spy

		beforeEach(waitForAsync(() => {
			spyGetCurrentPosition = spyOn<any>(component, 'getCurrentPosition').and.callThrough()
			spyHandlePositionLoaded = spyOn<any>(component, 'handlePositionLoaded').and.callThrough()
			spyUpdateMap = spyOn<any>(component, 'updateMap').and.callThrough()

			spyOn(window.navigator.geolocation, 'getCurrentPosition').and
				.callFake((success, failure, opts) => {
					// invoke success callback ourselves w/ fake position object
					// and component as the `this` context
					success.apply(component, [ FAKE_GEO_POSITION ])
				})
			spyOn(window.navigator.permissions, 'query').and
				.returnValue(Promise.resolve<PermissionStatus>({ state: 'granted' } as PermissionStatus))

			component.ngOnInit()
		}))

		it('invokes window.navigator.geolocation.getCurrentPosition() properly', () => {
			expect(spyUpdateMap).toHaveBeenCalledOnceWith()
			expect(component.map).toBeInstanceOf(Map)

			expect(window.navigator.permissions.query).toHaveBeenCalledOnceWith({ name: 'geolocation' })

			expect(spyGetCurrentPosition).toHaveBeenCalledOnceWith()

			expect(window.navigator.geolocation.getCurrentPosition).toHaveBeenCalledOnceWith(
				component['handlePositionLoaded'],
				component['handlePositionError'],
				{
					enableHighAccuracy: true,
				}
			)

			expect(spyHandlePositionLoaded).toHaveBeenCalledOnceWith(FAKE_GEO_POSITION)
		})
	})

	describe('invoke ngOnInit() when window.navigator.permissions is granted and getCurrentPosition invokes failure callback', () => {
		beforeEach(waitForAsync(() => {
			spyOn(window.navigator.geolocation, 'getCurrentPosition').and
				.callFake((success, failure, opts) => {
					// invoke failure callback ourselves w/ mocked GeolocationPositionError object
					failure({
						code: -1,
						message: '',
						PERMISSION_DENIED: 0,
						POSITION_UNAVAILABLE: 1,
						TIMEOUT: 0,
					})
				})
			spyOn(window.navigator.permissions, 'query').and
				.returnValue(Promise.resolve<PermissionStatus>({ state: 'granted' } as PermissionStatus))

			component.ngOnInit()
		}))

		it('invokes window.navigator.geolocation.getCurrentPosition() properly', () => {
			expect(window.navigator.permissions.query).toHaveBeenCalledOnceWith({ name: 'geolocation' })
			expect(window.navigator.geolocation.getCurrentPosition).toHaveBeenCalledOnceWith(
				component['handlePositionLoaded'],
				component['handlePositionError'],
				{
					enableHighAccuracy: true,
				}
			)
		})
	})
})
