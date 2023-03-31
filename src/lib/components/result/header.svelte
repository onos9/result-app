<script lang="ts">
  import { configs } from "$lib/stores/configs";


let vacationDate = new Date($configs.resumptionDate)
</script>

<div
  class="lg:flex lg:justify-between lg:space-x-3 mb-8 w-full font-normal print:flex print:justify-between print:space-x-3"
>
  <div class="flex space-x-3 lg:mb-0 mb-3">
    <div class="avatar">
      <div class="mask mask-squircle w-12 h-12">
        <img src="/logo-lla-sm.svg" alt="" />
      </div>
    </div>
    <div class="leading-7">
      <div class="font-bold ">{$configs.schoolName}</div>
      <div class="text-sm opacity-50 flex">
        <div class="i-bx:bxs-map text-xl mr-1" />
        {$configs.schoolRegion} State, {$configs.city}
      </div>
    </div>
  </div>

  <div class="flex flex-col lg:float-right text-center leading-7">
    <div class="font-bold float-right">{$configs.rusultDesc }</div>
    <div class="text-sm opacity-50 flex lg:justify-end justify-center">
      <div class="i-bx:calendar-alt text-xl mr-1" />
     {vacationDate.toDateString()}
    </div>
  </div>
</div>
