import { Component, ComponentAPI, PluginReference } from '@ayanaware/bento';
import { Byters } from '../Byters';

export class Rest implements Component {

	public name = 'Rest';
	public api!: ComponentAPI;
	public parent: PluginReference = Byters;

}
