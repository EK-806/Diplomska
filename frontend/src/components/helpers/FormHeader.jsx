import LogInWithGoogle from "../LogInWithGoogle";

export default function FormHeader({ heading }) {
  return (
    <div>
      <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:justify-between">
        <img
          src="/logo.png"
          alt="logo"
          className="h-10 w-auto max-w-[220px]"/>

        <div className="w-full sm:w-auto flex justify-center sm:justify-end">
          <div className="max-w-full">
            <LogInWithGoogle/>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 my-3">
        <hr className="w-full rounded-lg border-b-2 border-gray-900 dark:border-gray-100"/>
        <h1 className="whitespace-nowrap">{heading}</h1>
        <hr className="w-full rounded-lg border-b-2 border-gray-900 dark:border-gray-100"/>
      </div>
    </div>
  );
}