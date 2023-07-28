<script lang="ts">
  import { browser } from "$app/environment";
  import { enhance } from "$app/forms";
  import { rStudent, rStudents, students, student } from "$lib/stores/data_store";
  import { user } from "$lib/stores/user";

  let isNetAlert: boolean = false;
  let message: string;
  let admin_no: string;
  let disabled: boolean = true;

  $: if (browser && $rStudent) {
    const id = String($rStudent.admission_no).padStart(4, "0");
    const year = $rStudent.year.slice(1, 3);
    const school = $rStudent.school_code;
    admin_no = `${year}${school}-${id}`;
    disabled = !!$rStudent && !!$student;
    // if (!$student) {
    //   const name = new RegExp($rStudent.full_name.replace(" ", "|")).text();
    //   const std = $students.find((std) => std.fullName?.split(" ").some);
    // }

    // console.log({ admin_no, id, $student,disabled });
  }
</script>

<div class="md:container md:mx-auto">
  <div class="flex flex-col w-full">
    <div class="flex justify-end w-full">
      <form action="?/student" method="POST" use:enhance>
        <input hidden value={$user?.classId} name="classId" type="text" />
        <input hidden value={$user?.id} name="userId" type="text" />
        <input hidden value={$rStudent?.full_name} name="fullName" type="text" />
        <input hidden value={`${$rStudent?.id}/${admin_no}`} name="admissionNo" />
        <input hidden value={$rStudent?.parents?.guardians_email} name="parentEmail" />
        <button hidden {disabled} class="btn btn-primary mb-3"> Add Student to list </button>
      </form>
    </div>

    <div class="card bg-base-100 shadow-xl col-span-2 w-screen md:w-full">
      <div class="card-body">
        {#if isNetAlert}
          <div class="alert alert-error shadow-lg mb-3">
            <div>
              <div class="i-bx:close" />
              <span>{message}</span>
            </div>
          </div>
        {/if}
        <div class="overflow-x-auto md:overflow-hidden">
          <table class="table">
            <thead>
              <tr>
                <th class="uppercase">ID</th>
                <th class="flex items-center gap-2 uppercase">
                  <span>Student Name</span>
                </th>
                <th class="uppercase">Parent Info</th>
                <th class="uppercase">Admission Number</th>
              </tr>
            </thead>
            <tbody>
              {#each $rStudents as student, i}
                <tr>
                  <td>{student.id}</td>
                  <td>
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
                  </td>
                  <td>
                    <div>
                      <div class="font-bold">
                        {student.parents.mothers_name || student.parents.fathers_name}
                      </div>
                      <div class="text-sm opacity-50">
                        {student.parents.guardians_email}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span class="badge badge-sm badge-success">
                      {`${student.school_code}${student.year.slice(-2)}-${String(
                        student.admission_no
                      ).padStart(4, "0")}`}
                    </span>
                  </td>
                  <td>
                    <!-- <form action="?/record&id={student.id}" method="post" use:enhance>
                      <div class="tooltip" data-tip="Update">
                        <button class="i-bx:bxs-trash text-lg text-accent-focus" />
                      </div>
                    </form> -->
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
