export function slugify(value) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function classFileName(item) {
  return `clase-${String(item.id).padStart(2, "0")}-${slugify(item.title)}.md`;
}

export function classHref(directory, item, extension = "md") {
  return `curriculum/${directory}/${classFileName(item).replace(/\.md$/, `.${extension}`)}`;
}
