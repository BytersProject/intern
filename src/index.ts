export { Intern as default } from './lib/Intern';

export * from './lib/byters';
export * from './lib/Intern';

import { Bento } from '@ayanaware/bento';
import { Intern } from '.';

const bento = new Bento();

void (async () => {

	const intern = new Intern();

	await bento.addPlugin(intern);
	await bento.verify();

})();
