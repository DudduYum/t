let configurableCnt = -1;

export default class AFrameCustomProperty {
	static getNextConfigurableID () {
		return ++configurableCnt;
	}

	static getObjectProperty(defaultValue = '{}') {
		return {
			default: defaultValue,
			parse: function (value) {
				return JSON.parse(value);
			},
			stringify: function (value) {
				return JSON.stringify(value);
			}
		}
	}
}
