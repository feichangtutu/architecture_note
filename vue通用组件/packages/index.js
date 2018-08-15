/**
 * Created by jyn on 2018/8/15.
 */
import JInput from './src/input';

/* istanbul ignore next */
JInput.install = function(Vue) {
	Vue.component(JInput.name, JInput);
};

export default JInput;