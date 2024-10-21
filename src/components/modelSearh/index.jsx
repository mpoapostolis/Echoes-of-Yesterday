import React, { useState } from "react";
import { use3dModels } from "../../hooks/use3dModels";
import { debounce } from "../../lib/utils";
import { Plus } from "lucide-react";
// Constants
const cc0 = "https://creativecommons.org/publicdomain/zero/1.0/";
const ccBy3 = "https://creativecommons.org/licenses/by/3.0";
const ccBy4 = "https://creativecommons.org/licenses/by/4.0";

function FileIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      {...props}
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className="w-4 h-4"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
      />
    </svg>
  );
}

function FolderIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      {...props}
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className="w-4 h-4"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
      />
    </svg>
  );
}

export function TreeFolder(props) {
  return (
    <summary
      style={{
        opacity: props?.selected ? 1 : 0.55,
      }}
      onCut={props?.onClick}
      className="pr-0 w-full h-6"
    >
      <FolderIcon fill={props?.selected ? "#f93" : "none"} />
      <div style={{}} className="flex items-center p-0 m-0 w-full">
        {props?.children}
      </div>
    </summary>
  );
}

export function TreeFile(props) {
  return (
    <li
      className="flex h-6"
      style={{
        opacity: props?.selected ? 1 : 0.55,
      }}
    >
      <a onClick={props?.onClick} className="flex w-full">
        <FileIcon fill={props?.selected ? "#f93" : "none"} />
        <div style={{}} className="flex items-center p-0 m-0 w-full">
          {props?.children}
        </div>
      </a>
    </li>
  );
}

// Sidebar component for category selection
function Sidebar({
  categories,
  category,
  setCategory,
  setPage,
  assetCategory,
  setAssetCategory,
}) {
  return (
    <div>
      <button className="p-2 pl-4 w-full h-10 text-sm font-semibold text-left border-l-0 border-r border-b border-white border-opacity-10 hover:bg-base-300">
        Assets
      </button>
      <ul className="h-full border-r border-white border-opacity-10 menu menu-xs bg-base-200 max-w-60 min-w-60">
        <li>
          <TreeFolder
            onClick={() => setCategory("Library")}
            selected={assetCategory === "Library"}
          >
            Library
          </TreeFolder>
          <ul>
            {categories.map((cat) => (
              <TreeFile
                key={cat}
                onClick={() => {
                  setAssetCategory("Library");
                  setPage(0);
                  setCategory(cat);
                }}
                selected={cat === category}
              >
                {cat}
              </TreeFile>
            ))}
          </ul>
        </li>
      </ul>
    </div>
  );
}

// Model grid display with drag functionality
function ModelGrid({ data, isLoading }) {
  return (
    <div className="grid grid-cols-1 gap-4 p-4 pb-20 w-full md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6">
      {isLoading ? (
        <LoadingMessage text="Loading..." />
      ) : data?.length === 0 ? (
        <LoadingMessage text="No models found" />
      ) : (
        data.map((model) => <ModelCard key={model.id} model={model} />)
      )}
    </div>
  );
}

// Loading message component
function LoadingMessage({ text }) {
  return (
    <div className="grid col-span-3 place-items-center my-auto w-full h-60 text-lg font-bold text-center xl:col-span-6 2xl:col-span-8">
      {text}
    </div>
  );
}

// Individual model card
function ModelCard({ model }) {
  const onDragStart = (event) => {
    event.dataTransfer.setData("application/json", JSON.stringify(model));
  };

  return (
    <div
      draggable
      onDragStart={onDragStart}
      className="overflow-hidden relative z-50"
    >
      <div className="relative group">
        <img
          src={model.thumbnail}
          alt={model.name}
          className="w-full rounded-none min-h-32"
        />
        <p className="flex absolute top-0 justify-between p-2 w-full text-xs text-left bg-black bg-opacity-70 truncate">
          <span>{model.name}</span>
          {model.animated && (
            <span className="text-xs rounded-full badge-xs text-warning">
              Animated
            </span>
          )}
        </p>
        <ModelFooter model={model} />
      </div>
    </div>
  );
}

// Footer section inside model card for license and author links
function ModelFooter({ model }) {
  return (
    <div className="hidden absolute right-0 bottom-0 z-50 gap-2 justify-between p-2 w-full bg-black bg-opacity-80 group-hover:flex">
      <a
        data-tip={model.attribution_owner}
        target="_blank"
        href={model.attribution_url}
        className="flex z-50 gap-2 items-center text-xs link tooltip link-primary tooltip-right"
      >
        <span>Author</span>
      </a>
      <a
        target="_blank"
        href={
          model.licence === "CC0 1.0"
            ? cc0
            : model.licence === "CC-BY 3.0"
              ? ccBy3
              : ccBy4
        }
        className="flex gap-2 items-center text-xs link-primary"
      >
        🔒 <span>{model.licence}</span>
      </a>
    </div>
  );
}

// Model search component with pagination
function Search({
  category,
  changeSearchTerm,
  isLoading,
  page,
  setPage,
  totalPages,
}) {
  return (
    <div className="flex sticky top-0 gap-2 items-center p-4 py-2 px-4 w-full h-10 border-b border-white border-opacity-10">
      <input
        key={category}
        onChange={(e) => changeSearchTerm(e.target.value)}
        type="text"
        placeholder="🔍   Search...."
        className="mr-auto rounded-none input input-xs input-bordered"
      />
      <PaginationControls
        page={page}
        setPage={setPage}
        isLoading={isLoading}
        totalPages={totalPages}
      />
    </div>
  );
}

// Pagination controls component
function PaginationControls({ page, setPage, isLoading, totalPages }) {
  return (
    <>
      <button
        className="rounded-none btn btn-sm text-base-content btn-link"
        onClick={() => setPage(page - 1)}
        disabled={page === 0}
      >
        Prev
      </button>
      {isLoading ? (
        "Loading..."
      ) : (
        <div className="select-none">
          <div className="text-xs font-bold">{`Page: ${page + 1} of ${totalPages}`}</div>
        </div>
      )}
      <button
        className="rounded-none btn btn-sm text-base-content btn-link"
        onClick={() => setPage(page + 1)}
        disabled={page === totalPages - 1}
      >
        Next
      </button>
    </>
  );
}

// Main component for managing 3D models and the editor
export function ModelSearch() {
  const [category, setCategory] = useState(categories[0]);
  const [assetCategory, setAssetCategory] = useState("Library");
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const { data, isLoading, totalPages } = use3dModels(
    page,
    category,
    searchTerm,
  );

  const changeSearchTerm = debounce((str) => {
    setSearchTerm(str);
    setPage(0);
  }, 500);

  return (
    <>
      <button
        onClick={() => document.getElementById("my_modal_2").showModal()}
        className="btn btn-xs btn-ghost text-base-content hover:text-primary"
      >
        <Plus size={14} />
      </button>
      <dialog id="my_modal_2" className="modal">
        <div className="max-w-6xl modal-box">
          <div className="w-full h-full border-t border-white border-opacity-10">
            <div className="flex overflow-hidden w-full h-full">
              <Sidebar
                categories={categories}
                category={category}
                setCategory={setCategory}
                setPage={setPage}
                assetCategory={assetCategory}
                setAssetCategory={setAssetCategory}
              />
              <div className="overflow-hidden w-full h-full">
                <Search
                  category={category}
                  changeSearchTerm={changeSearchTerm}
                  isLoading={isLoading}
                  page={page}
                  setPage={setPage}
                  totalPages={totalPages}
                />
                <div className="overflow-auto w-full h-[80vh]">
                  <ModelGrid data={data} isLoading={isLoading} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}

// Sidebar categories
const categories = [
  "Scenes & Levels",
  "Nature",
  "Weapons",
  "People & Characters",
  "Objects",
  "Transport",
  "Buildings",
  "Other",
  "Food & Drink",
  "Buildings (Architecture)",
  "Animals",
  "Furniture & Decor",
  "Clutter",
];
