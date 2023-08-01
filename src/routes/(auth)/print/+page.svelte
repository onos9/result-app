<script lang="ts">
  import { browser } from "$app/environment";
  import { page } from "$app/stores";
  import {
    Header,
    Scores,
    Rating as StudentRating,
    Records as StudentRecords,
    Remark as StudentRemark,
  } from "$lib/components/result";

  import StudentInfo from "$lib/components/result/studentInfo.svelte";
  import { user } from "$lib/stores/user";
  import type { PageData } from "./$types";

  export let data: PageData;
  let lowest: number = Number($page.url.searchParams.get("lowest"));
  let highest: number = Number($page.url.searchParams.get("highest"));
  let { rStudent, student, result } = data;

  // $: console.log({ result, rStudent, student });
</script>

<div data-theme="light" class="container mx-auto w-full h-full bg-custom">
  <div class="flex-col w-a4 mx-auto min-w-screen flex">
    <Header />

    <div class="font-san">
      {#if result?.id}
        <StudentInfo remote_student={rStudent} local_student={student} />
      {/if}

      {#if result?.id}
        <StudentRecords records={result?.records} resultId={result.id} />
        <Scores {lowest} {highest} records={result?.records} />

        {#if $user?.arm == "primary"}
          <StudentRating ratings={result?.ratings} resultId={result.id} />
        {/if}

        <StudentRemark remarks={result?.remarks} resultId={result.id} />
      {/if}

      <div class="h-96" />
      <div class="h-96" />
      <div class="h-96" />
    </div>
  </div>
</div>

<style>
  .bg-custom {
    background-color: #ffffff;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='152' height='152' viewBox='0 0 152 152'%3E%3Cg fill-rule='evenodd'%3E%3Cg id='temple' fill='%23ff9000' fill-opacity='0.05'%3E%3Cpath d='M152 150v2H0v-2h28v-8H8v-20H0v-2h8V80h42v20h20v42H30v8h90v-8H80v-42h20V80h42v40h8V30h-8v40h-42V50H80V8h40V0h2v8h20v20h8V0h2v150zm-2 0v-28h-8v20h-20v8h28zM82 30v18h18V30H82zm20 18h20v20h18V30h-20V10H82v18h20v20zm0 2v18h18V50h-18zm20-22h18V10h-18v18zm-54 92v-18H50v18h18zm-20-18H28V82H10v38h20v20h38v-18H48v-20zm0-2V82H30v18h18zm-20 22H10v18h18v-18zm54 0v18h38v-20h20V82h-18v20h-20v20H82zm18-20H82v18h18v-18zm2-2h18V82h-18v18zm20 40v-18h18v18h-18zM30 0h-2v8H8v20H0v2h8v40h42V50h20V8H30V0zm20 48h18V30H50v18zm18-20H48v20H28v20H10V30h20V10h38v18zM30 50h18v18H30V50zm-2-40H10v18h18V10z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  }

  @media print {
    @page {
      margin-top: 5px;
    }

    @page :first {
      margin-top: 0;
    }
  }
</style>
