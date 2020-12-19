import { Argument } from '../Argument';

export class InternString extends Argument {

	public name = 'string';

	public run(arg: string) {
		return this.ok(arg);
	}

}
