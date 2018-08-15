<template>
    <div>
        <input type="text"/>
    </div>
</template>
<script>
export default {
	name: 'JInput',
	componentName: 'JInput'
},
data() {
	return {

	}
},
props: {
	value: [String, Number],
    size: String,
    resize: String,
    form: String,
    disabled: Boolean,
    readonly: Boolean,
    type: {
        type: String,
	    default: 'text'
	}
},
computed: {

},
watch: {
	value(val, oldValue) {
		this.setCurrentValue(val);
	}
},
methods: {
	focus() {
		(this.$refs.input || this.$refs.textarea).focus();
	},
	blur() {
		(this.$refs.input || this.$refs.textarea).blur();
	}
}	
</script>