import { useRef, useState } from "preact/hooks";
import { Signal, signal } from "@preact/signals";
import {
  ArrowDown01,
  ArrowDownAZ,
  ArrowDownWideNarrow,
  CalendarArrowDown,
  EllipsisVertical,
  File,
  Folder,
  FolderTree,
  HardDrive,
} from "lucide-preact";
import { type Data, generateData, generateSort } from "./utils.ts";

export function App() {
  const [data, _setData] = useState<Data>(
    generateData(document.querySelector<HTMLElement>("#data>table>tbody")!),
  );
  const query = signal("");

  return (
    <>
      <Navbar data={data} query={query} />
      <div className="flex-1 overflow-y-auto px-4 md:px-32">
        <Breadcrumb data={data} />
        <ListWithDialog data={data} query={query} />
      </div>
    </>
  );
}

interface Navbar {
  data: Data;
  query: Signal<string>;
}
export function Navbar({ data, query }: Navbar) {
  return (
    <div className="navbar bg-base-100 shadow-md">
      <div className="navbar-start pl-4">
        <HardDrive className="inline" />
        <p className="font-bold text-nowrap text-xl px-2">Fancy Index</p>
      </div>
      <div className="navbar-center">
        <input
          class="input input-bordered w-24 md:w-auto"
          placeholder="Search"
          type="text"
          onInput={(e) => {
            query.value = e.currentTarget.value;
          }}
        />
      </div>
      <div className="navbar-end pr-4">
        <details class="dropdown dropdown-end dropdown-hover">
          <summary className="btn btn-circle btn-ghost">
            <ArrowDownWideNarrow />
          </summary>
          <ul class="menu dropdown-content rounded-box bg-base-100 p-2 shadow-md w-48 z-1">
            <li>
              <a className="font-semibold" href={generateSort(data.sort, "N")}>
                <ArrowDownAZ className="inline" />By Name
              </a>
            </li>
            <li>
              <a className="font-semibold" href={generateSort(data.sort, "S")}>
                <ArrowDown01 className="inline" />By Size
              </a>
            </li>
            <li>
              <a className="font-semibold" href={generateSort(data.sort, "M")}>
                <CalendarArrowDown className="inline" />By Date
              </a>
            </li>
          </ul>
        </details>
      </div>
    </div>
  );
}

interface Breadcrumb {
  data: Data;
}
export function Breadcrumb({ data }: Breadcrumb) {
  return (
    <div className="breadcrumbs p-4 text-sm">
      <ul>
        {data.path.map((folder, index) => (
          <li>
            <a href={"../".repeat(data.path.length - index - 1)}>
              <FolderTree className="inline" />
              <p className="opacity-60">{folder}</p>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

interface ListWithDialog {
  data: Data;
  query: Signal<string>;
}
export function ListWithDialog({ data, query }: ListWithDialog) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [dialogIndexOfDataFiles, setDialogIndexOfDataFiles] = useState(0);

  return (
    <>
      <ul className="list bg-base-100">
        {data.files.map((file, index) => (
          query.value.length === 0 || file.name.includes(query.value)
            ? (
              <li className="list-row items-center">
                <div>{file.isDirectory ? <Folder /> : <File />}</div>
                <a href={file.href}>
                  <div className="items-center font-medium py-2 text-1g">
                    {file.name}
                  </div>
                </a>
                <button
                  className="btn btn-square btn-ghost"
                  type="button"
                  onClick={() => {
                    setDialogIndexOfDataFiles(index);
                    dialog.current!.showModal();
                  }}
                >
                  <EllipsisVertical />
                </button>
              </li>
            )
            : undefined
        ))}
      </ul>
      <dialog ref={dialog} className="modal">
        <div className="modal-box">
          <h3 className="font-semibold pb-8 text-lg">
            {data.files[dialogIndexOfDataFiles].name}
          </h3>
          {data.files[dialogIndexOfDataFiles].isDirectory
            ? undefined
            : (
              <MultimediaViewer
                href={data.files[dialogIndexOfDataFiles].href}
              />
            )}
          <p className="opacity-60">
            {`File Size: ${data.files[dialogIndexOfDataFiles].size}`}
          </p>
          <p className="opacity-60">
            {`File Date: ${data.files[dialogIndexOfDataFiles].date}`}
          </p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn" type="submit">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}

interface MultimediaViewer {
  href: string;
}
export function MultimediaViewer({ href }: MultimediaViewer) {
  const ext = href.split(".").at(-1);
  switch (ext) {
    case "bmp":
    case "gif":
    case "jpg":
    case "jpeg":
    case "apng":
    case "png":
    case "webp":
    case "avif":
      return <img className="pb-4" src={href}></img>;
    case "m4a":
    case "flac":
    case "ogg":
    case "ogv":
    case "mp4":
    case "webm":
      return <video className="pb-8" controls src={href}></video>;
    default:
      return;
  }
}
