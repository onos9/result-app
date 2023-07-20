<script lang="ts">
  import { enhance } from "$app/forms";
  import { configs } from "$lib/stores/configs";
  import { results } from "$lib/stores/data_store";
  import { user } from "$lib/stores/user";
  import { compressImg } from "$lib/utils";
  import type { Class, Result, Student } from "@prisma/client";
  import { onMount } from "svelte";
  import type { PageData } from "./$types";

  export let data: PageData;
  let isAlert: boolean = false;
  let isNetAlert: boolean = false;
  let message: string;
  let checked: boolean;

  let student:
    | (Student & {
        Class: Class | null;
      })
    | null;

  type FormInput = {
    data: FormData;
    action: URL;
    form: HTMLFormElement;
    cancel(): void;
  };

  $: ({ classes, students, remoteStudents, userData } = data);
  $: console.log(remoteStudents);

  const editStudent = async (id: any) => {
    const resp = await fetch(`/api/student-edit/${id}`);
    const data = await resp.json();
    console.log(data);
  };

  const onAdd = async ({ data, cancel, action }: FormInput) => {
    let id = action.searchParams.get("id");
    let file = data.getAll("avatarUrl")[0] as File;
    data.delete("avatarUrl");
    const admissionNo = data.get("admissionNo") as string;
    file = (await compressImg(file)) as File;

    if (!file && !action.searchParams.get("id")) {
      message = "Error: No student photo selected, please choose an photo";
      isAlert = true;
      setTimeout(() => (isAlert = false), 3000);
      cancel();
    }

    if (admissionNo && !id) {
      const remotStudent = remoteStudents.find(
        (item: any) => item?.admission_no == Number(admissionNo)
      );
      data.set("admissionNo", `${remotStudent.id}`);
    }

    if (id && admissionNo) {
      const remotStudent = remoteStudents.find(
        (item: any) => item?.admission_no == Number(admissionNo)
      );
      const student = students.find((item) => item?.id == id);
      data.set("admissionNo", `${remotStudent.id}/${student?.admissionNo?.split("/")[1]}`);
    }

    if (file) data.set("avatarUrl", file);
    data.set("userId", $user?.id as string);
    return async ({ result, update }: any) => {
      // console.log(result);
      if (result.type == "failure") {
        student = null;
        message = result.data.message;
        isAlert = true;
        setTimeout(() => (isAlert = false), 5000);
      }
      update();
    };
  };

  const handleEdit = (id: string) => {
    student = students.find((student) => student.id == id) as Student & {
      Class: Class | null;
    };
  };

  const isComplete = (id: string) => {
    const stud = students.find((student) => student.id == id);
    const result = stud?.result?.find(
      (result) =>
        result?.studentId == id &&
        result.term == $configs.term &&
        result == $configs.academicYear &&
        result.status == "uploaded"
    );
    return !!result;
  };
</script>

<div class="md:container md:mx-auto">
  <div class="flex flex-col w-full">
    <div class="flex justify-end w-full">
      <label for="modal-std" class="btn mb-3">Add Student</label>
    </div>

    <div class="card bg-base-100 shadow-xl col-span-2 w-full">
      <div class="card-body">
        {#if isNetAlert}
          <div class="alert alert-error shadow-lg mb-3">
            <div>
              <div class="i-bx:close" />
              <span>{message}</span>
            </div>
            <div class="flex-none">
              <!-- <button on:click={() => (isNetAlert = !isNetAlert)} class="btn btn-sm btn-circle">
              ✕
            </button> -->
            </div>
          </div>
        {/if}
        <div class="overflow-x-auto">
          <table class="table-compact table w-full">
            <thead>
              <tr>
                <th />
                <th class="flex items-center gap-2 normal-case">
                  <span>Name</span>
                </th>
                <th class="normal-case">Parent Info</th>
                <th class="normal-case">Admission No</th>
                <th class="normal-case">Action</th>
              </tr>
            </thead>
            <tbody>
              {#each remoteStudents as student}
                <tr>
                  <th>
                    <label>
                      <input checked={isComplete(student.id)} type="checkbox" class="checkbox" />
                    </label>
                  </th>
                  <td>
                    <a href="/students/{student.admission_no}">
                      <div class="flex items-center space-x-3">
                        {#if student?.student_photo}
                          <div class="avatar">
                            <div class="mask mask-squircle w-12 h-12">
                              <img
                                src={`https://llacademy.ng/${student?.student_photo}`}
                                alt="Avatar Tailwind CSS Component"
                              />
                            </div>
                          </div>
                        {:else}
                          <div class="avatar placeholder">
                            <div
                              class="bg-neutral-focus text-neutral-content mask mask-squircle w-12"
                            >
                              <span class="text-xl">{student.full_name.charAt(0)}</span>
                            </div>
                          </div>
                        {/if}
                        <div>
                          <div class="font-bold">{student.full_name}</div>
                          <div class="text-sm opacity-50">
                            {student.class_name}
                          </div>
                        </div>
                      </div>
                    </a>
                  </td>
                  <td>
                    <div>
                      <div class="font-bold">
                        {student.parents.mothers_name || student.parents.fathers}
                      </div>
                      <div class="text-sm opacity-50">
                        {student.parents.guardians_email}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div
                      class="tooltip tooltip-right cursor-help"
                      data-tip="Supports responsive prefixes (sm:, lg:, …)"
                    >
                      <span class="badge badge-sm badge-success w-20">
                        {`${student.school_code}${student.year.slice(-2)}-${String(
                          student.admission_no
                        ).padStart(4, "0")}`}
                      </span>
                    </div>
                  </td>
                  <td class="flex text-xl m-3">
                    <!-- <div class="tooltip mr-3" data-tip="View">
                      <a href="/students/{student.id}">
                        <div class="mr-1 i-mdi:eye-outline text-2xl" />
                      </a>
                    </div> -->
                    <div class="tooltip mr-3" data-tip="Edit">
                      <button on:click={() => editStudent(student.id)} class="i-bx:bxs-edit" />
                    </div>
                    <div class="tooltip" data-tip="Delete">
                      <form action="?/delete&id={student.id}" method="post" use:enhance>
                        <button class="i-bx:bxs-trash" />
                      </form>
                    </div>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Guardians Email * -->

<input bind:checked type="checkbox" id="modal-std" class="modal-toggle" />
<div class="modal">
  <div class="modal-box relative">
    <label for="modal-std" class="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
    <div class="font-bold text-sm mb-5">Add a New Student</div>
    <div class="mt-5 md:col-span-2 md:mt-0">
      <div class="card w-96 bg-base-100 shadow-sm">
        <div class="card-body">
          {#if isAlert}
            <div class="alert alert-error shadow-lg">
              <div>
                <div class="i-bx:close" />
                <span>{message}</span>
              </div>
            </div>
          {/if}

          <form action="?/create&id={student?.id || ''}" method="POST" use:enhance={onAdd}>
            <input
              name="fullName"
              value={student?.fullName || ""}
              placeholder="Full Name"
              class="input input-bordered w-full max-w-lg mb-3"
            />
            <fieldset>
              <legend class="contents text-sm font-semibold leading-6">Gender</legend>
              <div class="mt-3 flex mb-4">
                <div class="flex items-center mr-4">
                  <input type="radio" name="gender" value="male" class="radio" />
                  <label for="male" class="ml-3 block text-sm font-medium leading-6"> Male </label>
                </div>
                <div class="flex items-center">
                  <input type="radio" name="gender" value="female" class="radio" />
                  <label for="female" class="ml-3 block text-sm font-medium leading-6">
                    Female
                  </label>
                </div>
              </div>
            </fieldset>

            <input
              name="parentEmail"
              value={student?.parentEmail || ""}
              placeholder="Parent Email"
              class="input input-bordered w-full max-w-lg mb-3"
            />
            <input
              disabled={isNetAlert}
              name="admissionNo"
              value={student?.admissionNo?.split("/")[0] || ""}
              placeholder="Addmission Number"
              class="input input-bordered w-full max-w-lg mb-3"
            />
            <select name="classId" class="select select-bordered w-full max-w-xs mb-3">
              <option disabled={!!!student?.Class?.name} selected value={student?.classId}>
                {student?.Class?.name || "Select a Class"}
              </option>
              {#each classes as cls}
                <option value={cls.id}>{cls.name}({cls.section})</option>
              {/each}
            </select>
            <div class="form-control w-full max-w-xs mb-3">
              <label for="" class="label">
                <span class="label-text">Avarter</span>
              </label>
              <input
                name="avatarUrl"
                type="file"
                class="file-input file-input-bordered w-full max-w-xs"
              />
              <label for="" class="label">
                <span class="label-text-alt text-info-content"
                  >Select a dieplay picture for this student</span
                >
              </label>
            </div>
            <input
              name="present"
              value={student?.present || ""}
              placeholder="Days Present"
              class="input input-bordered w-full max-w-lg mb-3"
            />
            <input
              name="absent"
              value={student?.absent || ""}
              placeholder="Days Absent"
              class="input input-bordered w-full max-w-lg mb-3"
            />
            <button class="btn btn-sm">Add</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</div>
