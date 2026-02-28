// https://dog.ceo/api/breed/pembroke/images/random
import { watch} from "vue";
import axios from "axios";

export interface Props {
    open?: boolean
}

export type Emits = (e: 'update:open', value: boolean) => void

export const useDog = (props: Props, emit: Emits) => {
    async function fetchDog() {
        const response = await axios.get("https://dog.ceo/api/breed/pembroke/images/random");
        return response.data.message;
    }

    const close = () => {
        emit('update:open', false)
    }

    watch(
        () => props.open,
        (newValue) => {
            console.log(newValue);
        },
    )


    return {fetchDog, close};
}
