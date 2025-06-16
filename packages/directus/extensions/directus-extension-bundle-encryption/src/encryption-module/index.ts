import { defineModule } from '@directus/extensions-sdk';
import routes from './routes';

export default defineModule({
	id: 'encryption',
	name: 'Encryption',
	icon: 'shield_lock',
	routes: routes,
	preRegisterCheck() {
		return true;
	}
});
