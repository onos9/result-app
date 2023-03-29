<script lang="ts">
  import { enhance } from "$app/forms";
  import { user } from "$lib/stores/user";
  import { compressImg } from "$lib/utils";
  import type { Class, Student } from "@prisma/client";
  import type { PageData } from "./$types";

  export let data: PageData;
  let isAlert: boolean = false;
  let message: string;

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

  $: ({ classes, students } = data);

  // onMount(() => {
  //   let year = new Date().getFullYear().toString().substring(2);
  //   let nanoid = customAlphabet("0123456789", 4);
  //   let admissionNo = "01" + year + "-" + nanoid();
  //   console.log({ admissionNo});
  // });

  const onAdd = async ({ data, cancel, action }: FormInput) => {
    let file = data.getAll("avatarUrl")[0] as File;
    data.delete("avatarUrl");
    file = (await compressImg(file)) as File;
    if (!file && !action.searchParams.get("id")) {
      message = "Error: No student photo selected, please choose an photo";
      isAlert = true;
      setTimeout(() => (isAlert = false), 3000);
      cancel();
    }
    if (file) data.set("avatarUrl", file);
    data.set("userId", $user.id);

    return async ({ result, update }: any) => {
      console.log(result);
      if (result.type == "failure") {
        student = null;
        message = result.data.message;
        isAlert = true;
        setTimeout(() => (isAlert = false), 3000);
      }
      update();
    };
  };

  const handleEdit = (id: string) => {
    student = students.find((student) => student.id == id) as Student & {
      Class: Class | null;
    };
  };
</script>

<div class="md:container md:mx-auto">
  <div class="grid grid-cols-3 gap-6 w-full mt-10">
    <div class="col-span-2">
      <div class="card bg-base-100 shadow-xl col-span-2 mb-10 w-full">
        <div class="card-body">
          <div class="overflow-x-auto">
            <table class="table-compact table w-full">
              <thead>
                <tr>
                  <th />
                  <th class="flex items-center gap-2 normal-case">
                    <span>Name</span>
                  </th>
                  <th class="normal-case">Parent Email</th>
                  <th class="normal-case">Admission No</th>
                  <th class="normal-case">Action</th>
                </tr>
              </thead>
              <tbody>
                {#each students as student}
                  <tr>
                    <th>
                      <label>
                        <input type="checkbox" class="checkbox" />
                      </label>
                    </th>
                    <td>
                      <div class="flex items-center space-x-3">
                        <div class="avatar">
                          <div class="mask mask-squircle w-12 h-12">
                            <img src={student.avatarUrl} alt="Avatar Tailwind CSS Component" />
                          </div>
                        </div>
                        <div>
                          <div class="font-bold">{student.fullName}</div>
                          <div class="text-sm opacity-50">
                            {student?.Class?.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>{student.parentEmail}</td>
                    <td>
                      <div
                        class="tooltip tooltip-right cursor-help"
                        data-tip="Supports responsive prefixes (sm:, lg:, …)"
                      >
                        <span class="badge badge-sm badge-success w-20">
                          {student.admissionNo?.split("/")[1]}
                        </span>
                      </div>
                    </td>
                    <td class="flex text-xl m-3">
                      <div class="tooltip mr-3" data-tip="View">
                        <a href="/students/{student.id}">
                          <div class="mr-1 i-mdi:eye-outline text-2xl" />
                        </a>
                      </div>
                      <div class="tooltip mr-3" data-tip="Edit">
                        <button on:click={() => handleEdit(student.id)} class="i-bx:bxs-edit" />
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
            <legend class="contents text-sm font-semibold leading-6 ">Gender</legend>
            <div class="mt-3 flex mb-4">
              <div class="flex items-center mr-4">
                <input type="radio" name="gender" value="male" class="radio" />
                <label for="male" class="ml-3 block text-sm font-medium leading-6 "> Male </label>
              </div>
              <div class="flex items-center">
                <input type="radio" name="gender" value="female" class="radio" />
                <label for="female" class="ml-3 block text-sm font-medium leading-6 ">
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
