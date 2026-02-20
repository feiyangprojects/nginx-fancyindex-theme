export interface Data {
    files: DataFile[];
    path: string[];
    sort: DataSort;
}
export interface DataSort {
    mode: string;
    order: string;
}
export interface DataFile {
    href: string;
    name: string;
    size: string;
    date: string;
    isDirectory: boolean;
}
export function generateData(table: HTMLElement): Data {
    const sq = new URLSearchParams(location.search);

    const data: Data = {
        files: [],
        path: location.pathname.split("/").filter((folder) => folder.length > 0)
            .map((folder) => decodeURIComponent(folder)),
        sort: { mode: sq.get("C") || "N", order: sq.get("O") || "A" },
    };
    data.path.unshift('/')
    for (const tr of table.querySelectorAll<HTMLElement>("tbody>tr")) {
        const a = tr.querySelector<HTMLAnchorElement>(".link>a")!;
        data.files.push({
            href: a.href,
            name: a.innerText.replace(/\/$/, ""),
            size: tr.querySelector<HTMLElement>(".size")!.innerText,
            date: tr.querySelector<HTMLElement>(".date")!.innerText,
            isDirectory: a.innerText.endsWith("/"),
        });
    }
    return data;
}

export function generateSort(sort: DataSort, mode: string): string {
    if (mode === sort.mode) {
        return `?C=${mode}&O=${sort.order === "A" ? "D" : "A"}`;
    } else {
        return `?C=${mode}&O=A`;
    }
}
