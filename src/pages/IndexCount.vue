<template>
  <div class="row q-pa-sm fit wrap justify-evenly items-start content-start">
    <q-card class="my-card bg-blue text-white q-ma-xs">
      <q-card-section>
        <div class="text-h6">Direct store</div>
        <div class="text-h3 text-center">{{ store.counter }}</div>
        <div class="text-h3 text-center">{{ store.doubleCount }}</div>
      </q-card-section>

      <q-separator />

      <q-card-actions vertical>
        <q-btn color="red" @click="store.counter--">Action -</q-btn>
        <q-btn color="green" @click="store.increment()">Action +</q-btn>
      </q-card-actions>
    </q-card>
    <q-card class="my-card bg-orange text-white q-ma-xs">
      <q-card-section>
        <div class="text-h6">Indirect store</div>
        <div class="text-h3 text-center">{{ count }}</div>
        <div class="text-h3 text-center">{{ doubleCountValue }}</div>
      </q-card-section>

      <q-separator />

      <q-card-actions vertical>
        <q-btn color="red" @click="decrementCount()">Action -</q-btn>
        <q-btn color="green" @click="incrementCount()">Action +</q-btn>
      </q-card-actions>
    </q-card>
    <q-card class="my-card bg-purple text-white q-ma-xs">
      <q-card-section>
        <div class="text-h6">Destructured store</div>
        <div class="text-h3 text-center">{{ counter }}</div>
        <div class="text-h3 text-center">{{ doubleCount }}</div>
      </q-card-section>

      <q-separator />

      <q-card-actions vertical>
        <q-btn color="red" @click="counter--">Action -</q-btn>
        <q-btn color="green" @click="increment()">Action +</q-btn>
      </q-card-actions>
    </q-card>
  </div>
</template>

<script>
import { computed } from "vue";
import { useCounterStore } from "stores/example-store";
import { storeToRefs } from "pinia";

export default {
  setup() {
    const store = useCounterStore();

    // Option 2: use computed and functions to use the store
    const count = computed(() => store.counter);
    const doubleCountValue = computed(() => store.doubleCount);
    const incrementCount = () => store.increment(); // use action
    const decrementCount = () => store.counter--; // manipulate directly

    // Option 3: use destructuring to use the store in the template
    const { counter, doubleCount } = storeToRefs(store); // state and getters need "storeToRefs"
    const { increment } = store; // actions can be destructured directly

    return {
      // Option 1: return the store directly and couple it in the template
      store,

      // Option 2: use the store in functions and compute the state to use in the template
      count,
      doubleCountValue,
      incrementCount,
      decrementCount,

      // Option 3: pass the destructed state, getters and actions to the template
      counter,
      increment,
      doubleCount,
    };
  },
};
</script>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 350px
</style>
