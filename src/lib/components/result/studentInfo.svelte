<script lang="ts">
  import { enhance } from "$app/forms";
  import { compressImg } from "$lib/utils";
  import type { Class, Result, Student } from "@prisma/client";
  import { student as studentStore } from "$lib/stores/data_store";
  import { configs } from "$lib/stores/configs";

  export let student:
    | (Student & {
        result: Result[];
        Class: Class | null;
      })
    | null = null;

  if (!student) student = $studentStore;
</script>

<!-- <div class="text-sm flex mb-3 print:hidden">
  <label for="modal-info" class="btn btn-sm btn-primary cursor-pointer">
    Edit Student
    <div class="i-bx:bxs-edit-alt text-lg ml-1" />
  </label>
</div> -->

<div class="flex flex-row pt-2">
  <table class="min-w-max w-full table-auto mb-4 rounded">
    <tbody class="align-baseline ">
      <tr class="border-b">
        <td
          class="print:print:bg-violet-900 capitalize btn btn-xs border print:text-slate-300 cursor-default rounded-full"
        >
          <span>Name</span>
        </td>
        <td class="py-2 pl-2 text-xs  print:text-slate-500 uppercase"> {student?.fullName} </td>
        <td />
        <td />
        <td
          class="print:print:bg-violet-900 capitalize btn btn-xs border print:text-slate-300 cursor-default rounded-full"
        >
          <span> Admission No </span>
        </td>
        <td class="py-2 pl-2 text-xs  print:text-slate-500">
          {student?.admissionNo?.split("/")[1] || student?.admissionNo}
        </td>
      </tr>
      <tr class="border-b">
        <td
          class="print:print:bg-violet-900 capitalize btn btn-xs border print:text-slate-300 cursor-default rounded-full"
        >
          <span> Class </span>
        </td>
        <td class="py-2 pl-2 text-xs  print:text-slate-500 uppercase">{student?.Class?.name} </td>
        <td
          class="print:print:bg-violet-900 capitalize btn btn-xs border print:text-slate-300 cursor-default rounded-full"
        >
          <span> Academic Year </span>
        </td>
        <td class="py-2 pl-2 text-xs  print:text-slate-500 uppercase"> 2022/2023 </td>
      </tr>
      <tr class="border-b">
        <td
          class="print:print:bg-violet-900 capitalize btn btn-xs border print:text-slate-300 cursor-default rounded-full"
        >
          <span> Days Opened </span>
        </td>
        <td class="py-2 pl-2 text-xs  print:text-slate-500 capitalize">{$configs.schoolOpened}</td>
        <td
          class="print:print:bg-violet-900 capitalize btn btn-xs border print:text-slate-300 cursor-default rounded-full"
        >
          <span> Days Absent </span>
        </td>
        <td class="py-2 pl-2 text-xs  print:text-slate-500 capitalize"> {student?.absent}</td>
        <td
          class="print:print:bg-violet-900 capitalize btn btn-xs border print:text-slate-300 cursor-default rounded-full"
        >
          <span> Days Present </span>
        </td>
        <td class="py-2 pl-2 text-xs  print:text-slate-500 capitalize"> {student?.present} </td>
      </tr>
    </tbody>
  </table>
  <div class="avatar flex flex-col px-4 justify-center items-center">
    <div class="w-24 rounded-full ring ring-neutral print:ring-violet-900  ring-offset-2 mb-4">
      <img src="/{student?.avatarUrl}" alt="" />
    </div>
  </div>
</div>

<input type="checkbox" id="modal-info" class="modal-toggle" />
<div class="modal">
  <div class="modal-box relative">
    <label for="modal-info" class="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
    <div class="font-bold text-sm">Student Information</div>
    <form action="?/create" method="POST" use:enhance class="mt-8">
      <input hidden name="classId" value={student?.Class?.id} />
      <input
        name="fullName"
        placeholder="Full Name"
        class="input input-bordered w-full max-w-lg mb-3"
      />
      <input
        name="parentEmail"
        placeholder="Parent Email"
        class="input input-bordered w-full max-w-lg mb-3"
      />
      <input
        name="location"
        placeholder="Location"
        class="input input-bordered  w-full max-w-lg mb-3"
      />
      <input
        name="present"
        placeholder="Days Present"
        class="input input-bordered w-full max-w-lg mb-3"
      />
      <input
        name="absent"
        placeholder="Days Absent"
        class="input input-bordered w-full max-w-lg mb-3"
      />
      <button class="btn btn-sm">Save</button>
    </form>
  </div>
</div>
