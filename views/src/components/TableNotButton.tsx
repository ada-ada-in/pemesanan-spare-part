export default function TableNotButton({
  children,
  title,
  description,
}: {
  children: any;
  title: string;
  description: string;
  link: string;
  data: any[] | null;
  buttonOff?: boolean;
}) {
  return (
    <>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            {title}
          </h1>
          <p className="mt-2 text-sm text-gray-700">{description}</p>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
