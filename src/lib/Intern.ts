import { FSComponentLoader, Plugin, PluginAPI } from '@ayanaware/bento';
import Byters from './byters';
import * as path from 'path';

// TODO: Add version based on package.json
export class Intern implements Plugin {

	public name = 'Intern';
	public api!: PluginAPI;

	public fsLoader!: FSComponentLoader;

	public async onLoad() {
		this.fsLoader = new FSComponentLoader();
		this.fsLoader.name = 'InternFSComponentLoader';
		await this.api.bento.addPlugin(this.fsLoader);

		const byters: Byters = await (this.fsLoader as any).createInstance(path.resolve(__dirname, 'byters'));
		await this.api.bento.addComponent(byters);
	}

}
