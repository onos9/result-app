<script lang="ts">
  import { enhance } from "$app/forms";
  import { configs } from "$lib/stores/configs";

  export let remote_student: any = null;
  export let local_student: any;
  let admin_no: string;
  let checked = false;
  let isCorrect: boolean;

  $: {
    const id = String(remote_student?.admission_no).padStart(4, "0");
    const year = remote_student.year.slice(1, 3);
    const school = remote_student.school_code;
    admin_no = `${year}${school}-${id}`;
  }
</script>

<div class="text-sm flex mb-3 print:hidden">
  <label for="modal-info" class="btn btn-sm btn-primary cursor-pointer">
    Update Student
    <div class="i-bx:bxs-edit-alt text-lg ml-1" />
  </label>
</div>

<div class="flex flex-row p-3 overflow-x-auto">
  <table class="min-w-max table-auto">
    <tbody class="align-baseline">
      <tr class="border-b">
        <td
          class="print:print:bg-violet-900 capitalize btn btn-xs border print:text-slate-300 cursor-default rounded-full"
        >
          <span>Name</span>
        </td>
        <td class="py-2 pl-2 text-xs print:text-slate-500 uppercase">
          {remote_student?.full_name}
        </td>

        <td />
        <td />
        <td
          class="print:print:bg-violet-900 capitalize btn btn-xs border print:text-slate-300 cursor-default rounded-full"
        >
          <span> Admission No </span>
        </td>
        <td class="py-2 pl-2 text-xs print:text-slate-500">
          {admin_no}
        </td>
      </tr>
      <tr class="border-b">
        <td
          class="print:print:bg-violet-900 capitalize btn btn-xs border print:text-slate-300 cursor-default rounded-full"
        >
          <span> Class </span>
        </td>
        <td class="py-2 text-xs print:text-slate-500 uppercase w-44"
          >{`${remote_student?.class_name}(${remote_student?.section_name})`}
        </td>

        <td
          class="print:print:bg-violet-900 capitalize btn btn-xs border print:text-slate-300 cursor-default rounded-full"
        >
          <span>Term</span>
        </td>
        <td class="py-2 pl-2 text-xs print:text-slate-500 uppercase">{`${$configs.term} Term`}</td>
        <td
          class="print:print:bg-violet-900 capitalize btn btn-xs border print:text-slate-300 cursor-default rounded-full"
        >
          <span> Academic Year</span>
        </td>
        <td class="py-2 pl-2 text-xs print:text-slate-500 uppercase">{$configs.academicYear}</td>
      </tr>
      <tr class="border-b">
        <td
          class="print:print:bg-violet-900 capitalize btn btn-xs border print:text-slate-300 cursor-default rounded-full"
        >
          <span> Days Opened </span>
        </td>
        <td class="py-2 pl-2 text-xs print:text-slate-500 capitalize">{$configs.schoolOpened}</td>
        <td
          class="print:print:bg-violet-900 capitalize btn btn-xs border print:text-slate-300 cursor-default rounded-full"
        >
          <span> Days Absent </span>
        </td>
        <td class="py-2 pl-2 text-xs print:text-slate-500 capitalize"> {local_student?.absent}</td>
        <td
          class="print:print:bg-violet-900 capitalize btn btn-xs border print:text-slate-300 cursor-default rounded-full"
        >
          <span> Days Present </span>
        </td>
        <td class="py-2 pl-2 text-xs print:text-slate-500 capitalize">
          {local_student?.present}
        </td>
      </tr>
    </tbody>
  </table>
  <div class="avatar flex flex-col px-4 justify-center items-center">
    <div class="w-24 rounded-full ring ring-neutral print:ring-violet-900 ring-offset-2 mb-4">
      <img src="/{local_student?.avatarUrl}" alt=" " />
    </div>
  </div>
</div>

<input bind:checked type="checkbox" id="modal-info" class="modal-toggle" />
<div class="modal">
  <form
    action="?/confirm&id={local_student?.id}&remoteId={remote_student?.id}"
    method="POST"
    class="modal-box md:w-3/12 w-10/12 max-w-5xl"
    use:enhance
  >
    <label for="modal-info" class="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
    <p class="font-bold text-sm mb-3">Update Student Data</p>
    <div class="mt-5 md:col-span-2 md:mt-0">
      <div class="">
        <div class="avatar flex flex-col p-0 px-4 justify-center items-center">
          <div class="w-24 rounded-full ring ring-neutral ring-offset-base-100 ring-offset-2 mb-4">
            <img src="/{local_student?.avatarUrl}" alt="" />
            <!-- <input hidden type="text" name="remoteId" value={remote_student?.id} /> -->
          </div>
        </div>
        <div class="grid grid-row-3 gap-4">
          <div class="relative col-span-6 sm:col-span-3">
            <input
              value={remote_student?.full_name}
              name="fullName"
              type="text"
              id="fullName"
              class=" input input-bordered floating-input peer focus:border-accent-focus"
              placeholder=" "
            />
            <label for="fullName" class="floating-label peer-focus:text-accent-focus">
              Full Name
            </label>
          </div>
          <div class="relative col-span-6 sm:col-span-3">
            <input
              value={remote_student?.parents?.guardians_email}
              name="parentEmail"
              type="text"
              id="parentEmail"
              class=" input input-bordered floating-input peer focus:border-accent-focus"
              placeholder=" "
            />
            <label for="parentEmail" class="floating-label peer-focus:text-accent-focus">
              Guardians Email
            </label>
          </div>
          <div class="relative col-span-6 sm:col-span-3">
            <input
              value={admin_no}
              name="admissionNo"
              type="text"
              id="admissionNo"
              class=" input input-bordered floating-input peer focus:border-accent-focus"
              placeholder=" "
            />
            <label for="admissionNo" class="floating-label peer-focus:text-accent-focus">
              Admission No
            </label>
          </div>
          <div class="relative col-span-6 md:col-span-1">
            <input
              value={local_student?.present}
              name="present"
              type="text"
              id="present"
              class=" input input-bordered floating-input peer focus:border-accent-focus"
              placeholder=" "
            />
            <label for="present" class="floating-label peer-focus:text-accent-focus">
              Days Present
            </label>
          </div>
          <div class="relative col-span-6 md:col-span-1">
            <input
              value={local_student?.absent}
              name="absent"
              type="text"
              id="absent"
              class=" input input-bordered floating-input peer focus:border-accent-focus"
              placeholder=" "
            />
            <label for="absent" class="floating-label peer-focus:text-accent-focus">
              Days Absent
            </label>
          </div>
          <div class="relative col-span-6 sm:col-span-3">
            <label for="" class="label">
              <span class="label-text">Profile Photo</span>
            </label>
            <input name="student_photo" type="file" class="file-input file-input-bordered w-full" />
          </div>
        </div>
        <div class="modal-action">
          <button on:click={() => (isCorrect = !isCorrect)} class="btn btn-primary">Update</button>
        </div>
      </div>
    </div>
  </form>
</div>
