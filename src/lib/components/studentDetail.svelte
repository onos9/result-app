<script lang="ts">
  import { configs } from "$lib/stores/configs";
  import { student } from "$lib/stores/data_store";
</script>

<div class="avatar flex flex-col p-0 px-4 justify-center items-center">
  <div class="w-24 rounded-full ring ring-neutral ring-offset-base-100 ring-offset-2 mb-4">
    <img src="/{$student?.avatarUrl}" alt="" />
  </div>
</div>

<div class="flex flex-col justify-center items-center w-full mb-4">
  <div class="font-bold ">{$student?.fullName}</div>
  <div class="text-sm opacity-50">{$student?.Class?.name}</div>
</div>

<hr />
<table class="w-full text-left border-collapse">
  <tbody class="align-baseline">
    <tr class="border-b">
      <td
        translate="no"
        class="py-2 pr-2 font-mono font-medium text-xs leading-6 whitespace-nowrap "
      >
        Admissio No
      </td>
      <td translate="no" class="py-2 pl-2 font-mono text-xs leading-6 whitespace-pre ">{$student?.admissionNo}</td>
    </tr>
    <tr class="border-b">
      <td
        translate="no"
        class="py-2 pr-2 font-mono font-medium text-xs leading-6 whitespace-nowrap"
      >
        Present
      </td>
      <td translate="no" class="py-2 pl-2 font-mono text-xs leading-6  whitespace-pre">
       {$student?.present} days
      </td>
    </tr>
    <tr class="border-b">
      <td
        translate="no"
        class="py-2 pr-2 font-mono font-medium text-xs leading-6  whitespace-nowrap"
      >
        Absent
      </td>
      <td translate="no" class="py-2 pl-2 font-mono text-xs leading-6 whitespace-pre">
        {$student?.absent} days
      </td>
    </tr>
  </tbody>
</table>
