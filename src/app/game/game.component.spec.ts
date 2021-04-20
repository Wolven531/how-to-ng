import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import { ReactiveFormsModule } from '@angular/forms'
import { Map, View } from 'ol'
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

	describe('when window.navigator.permissions is granted', () => {
		beforeEach(() => {
			spyOn(window.navigator.permissions, 'query').and
				.returnValue(Promise.resolve<PermissionStatus>({ state: 'granted' } as PermissionStatus))
		})

		describe('invoke ngOnInit() when getCurrentPosition invokes failure callback', () => {
			const FAKE_GEO_ERROR = {
				code: -1,
				message: '',
				PERMISSION_DENIED: 0,
				POSITION_UNAVAILABLE: 1,
				TIMEOUT: 0,
			}

			beforeEach(waitForAsync(() => {
				spyOn(window.navigator.geolocation, 'getCurrentPosition').and
					.callFake((success, failure, opts) => {
						// invoke success callback ourselves w/ mocked GeolocationPositionError object
						// and component as the `this` context
						failure.apply(component, [ FAKE_GEO_ERROR ])
					})

				component.ngOnInit()
			}))

			it('invokes window.navigator.geolocation.getCurrentPosition() properly', () => {
				expect(window.navigator.permissions.query).toHaveBeenCalledOnceWith({ name: 'geolocation' })
				expect(window.navigator.geolocation.getCurrentPosition).toHaveBeenCalledOnceWith(
					component['handlePositionLoaded'],
					component['handlePositionError'],
					{
						enableHighAccuracy: true,
					},
				)
				// TODO - add assertions for whatever component.handlePositionError() SHOULD do (currently empty)
			})
		})

		describe('invoke ngOnInit() when getCurrentPosition invokes success callback', () => {
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
			let spySetView: jasmine.Spy

			beforeEach(waitForAsync(() => {
				spyOn(window.navigator.geolocation, 'getCurrentPosition').and
					.callFake((success, failure, opts) => {
						// must set spy here, so that map exists
						spySetView = spyOn(component.map, 'setView')
						// invoke success callback ourselves w/ fake position object
						// and component as the `this` context
						success.apply(component, [ FAKE_GEO_POSITION ])
					})

				component.ngOnInit()
			}))

			it('invokes window.navigator.geolocation.getCurrentPosition() properly', () => {
				expect(component.map).toBeInstanceOf(Map)

				expect(window.navigator.permissions.query).toHaveBeenCalledOnceWith({ name: 'geolocation' })

				expect(window.navigator.geolocation.getCurrentPosition).toHaveBeenCalledOnceWith(
					component['handlePositionLoaded'],
					component['handlePositionError'],
					{
						enableHighAccuracy: true,
					}
				)

				expect(spySetView).toHaveBeenCalledTimes(1)

				const paramPassed: View = spySetView.calls.mostRecent().args[0]

				expect(paramPassed.getCenter()).toEqual([
					FAKE_GEO_POSITION.coords.longitude,
					FAKE_GEO_POSITION.coords.latitude,
				])
				expect(paramPassed.getZoom()).toBe(5)
			})
		})
	})
})
