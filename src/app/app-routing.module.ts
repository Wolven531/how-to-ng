import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { DashboardComponent } from './dashboard/dashboard.component'
import { GameComponent } from './game/game.component'
import { NotFoundComponent } from './not-found/not-found.component'

const routes: Routes = [
	{
		component: DashboardComponent,
		path: 'dashboard',
	},
	{
		component: GameComponent,
		path: 'game',
	},
	{
		path: '',
		redirectTo: '/dashboard',
		pathMatch: 'full',
	},
	{
		component: NotFoundComponent,
		path: '**',
	},
]

@NgModule({
	declarations: [],
	exports: [RouterModule],
	imports: [
		RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy', initialNavigation: 'enabled' }),
	],
})
export class AppRoutingModule { }
