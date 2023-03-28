<script>
</script>

<div class="md:container md:mx-auto p-16">
  <div class="grid grid-cols-3 gap-6 w-full mt-10">
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
                <th class="normal-case">Admission No</th>
                <th class="normal-case">Phone</th>
                <th class="normal-case">Action</th>
              </tr>
            </thead>
            <tbody>
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
                        <img
                          src="https://i.pravatar.cc/150?img=10"
                          alt="Avatar Tailwind CSS Component"
                        />
                      </div>
                    </div>
                    <div>
                      <div class="font-bold">Hart Hagerty</div>
                      <div class="text-sm opacity-50">United States</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div
                    class="tooltip tooltip-right cursor-help"
                    data-tip="Supports responsive prefixes (sm:, lg:, …)"
                  >
                    <span class="badge badge-sm badge-success w-20">18343</span>
                  </div>
                </td>
                <td>080 9605 2376</td>
                <td>
                  <div class="tooltip" data-tip="View">
                    <a href="/students/mkmlsnzns">
                      <div class="m-1 i-mdi:eye-outline text-2xl" />
                    </a>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="card w-96 bg-base-100 shadow-xl">
      <div class="card-body">
        <div class="w-full">
          <input
            type="text"
            placeholder="Type here"
            class="input input-bordered input-info w-full max-w-lg"
          />
        </div>
      </div>
    </div>
  </div>
</div>
