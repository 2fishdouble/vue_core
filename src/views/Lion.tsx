import {defineComponent, onActivated, onDeactivated, ref} from 'vue'

export default defineComponent({
    setup() {
        const list = ref<string[]>(['苹果', '香蕉', '橙子'])
        onActivated(() => {
            console.log('✅ 组件被激活了')
        })

        onDeactivated(() => {
            console.log('💤 组件被缓存失活了')
        })
        return () => (
            <ul style={{padding: 0, listStyle: 'none'}}>
                {list.value.map((item, index) => (
                    <li
                        key={index}
                        style={{padding: '8px', borderBottom: '1px solid #eee'}}
                    >
                        {item}
                    </li>
                ))}
            </ul>
        )
    }
})
